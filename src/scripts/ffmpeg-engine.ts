import { FFmpeg } from '@ffmpeg/ffmpeg';

export type AudioMode = 'replace' | 'mix';

export interface MergeOptions {
  videoFile: File;
  audioFile: File;
  mode: AudioMode;
  originalVolume: number; // 0.0 to 2.0
  addedVolume: number;    // 0.0 to 2.0
  loopAudio: boolean;
  trimToVideo: boolean;
  videoDurationHint?: number;
  audioDurationHint?: number;
}

export interface MergeStageUpdate {
  stage: 'loading' | 'probing' | 'merging' | 'finalizing';
  progress: number; // 0 to 1
  noticeKey?: 'silentVideoNotice';
}

export interface MergeResult {
  blob: Blob;
  url: string;
  filename: string;
  mimeType: string;
  elapsedMs: number;
  coreMode: 'mt' | 'st';
  hadOriginalAudio: boolean;
}

export interface VideoMeta {
  duration: number;
  width: number;
  height: number;
}

export interface AudioMeta {
  duration: number;
  peaks: number[];
}

function getExtension(filename: string, fallback: string): string {
  const idx = filename.lastIndexOf('.');
  if (idx === -1) return fallback;
  const ext = filename.slice(idx).toLowerCase().replace(/[^a-z0-9.]/g, '');
  return ext.length > 1 ? ext : fallback;
}

function getBaseName(filename: string): string {
  const idx = filename.lastIndexOf('.');
  const raw = idx > 0 ? filename.slice(0, idx) : filename;
  const cleaned = raw.trim().replace(/[\\/:*?"<>|]+/g, '_');
  return cleaned || 'merged-video';
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const val = bytes / Math.pow(1024, i);
  return `${val >= 100 || i === 0 ? Math.round(val) : val.toFixed(1)} ${units[i]}`;
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '--:--';
  const total = Math.round(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export async function probeVideoMeta(file: File): Promise<VideoMeta> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';

    const cleanup = (meta: VideoMeta) => {
      video.removeAttribute('src');
      video.load();
      URL.revokeObjectURL(url);
      resolve(meta);
    };

    const timer = window.setTimeout(() => cleanup({ duration: 0, width: 0, height: 0 }), 3500);

    video.onloadedmetadata = () => {
      window.clearTimeout(timer);
      cleanup({
        duration: Number.isFinite(video.duration) ? video.duration : 0,
        width: video.videoWidth || 0,
        height: video.videoHeight || 0,
      });
    };

    video.onerror = () => {
      window.clearTimeout(timer);
      cleanup({ duration: 0, width: 0, height: 0 });
    };

    video.src = url;
  });
}

function generateFallbackPeaks(barCount = 36): number[] {
  const peaks: number[] = [];
  for (let i = 0; i < barCount; i++) {
    const wave = 0.35 + 0.5 * Math.abs(Math.sin(i * 0.48 + 0.7) * Math.cos(i * 0.21));
    peaks.push(Number(wave.toFixed(3)));
  }
  return peaks;
}

export async function probeAudioMeta(file: File): Promise<AudioMeta> {
  const duration = await new Promise<number>((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = document.createElement('audio');
    audio.preload = 'metadata';

    const cleanup = (d: number) => {
      audio.removeAttribute('src');
      audio.load();
      URL.revokeObjectURL(url);
      resolve(d);
    };

    const timer = window.setTimeout(() => cleanup(0), 3500);
    audio.onloadedmetadata = () => {
      window.clearTimeout(timer);
      cleanup(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    audio.onerror = () => {
      window.clearTimeout(timer);
      cleanup(0);
    };
    audio.src = url;
  });

  // Decode waveform peaks cleanly for files <= 40MB without blocking UI
  let peaks = generateFallbackPeaks(36);
  if (file.size <= 40 * 1024 * 1024 && typeof AudioContext !== 'undefined') {
    let ctx: AudioContext | null = null;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AudioCtx();
      const buf = await file.slice(0, file.size).arrayBuffer();
      const decoded = await ctx.decodeAudioData(buf);
      const channel = decoded.getChannelData(0);
      const barCount = 36;
      const step = Math.max(1, Math.floor(channel.length / barCount));
      const computed: number[] = [];
      let maxAmp = 0.01;
      for (let i = 0; i < barCount; i++) {
        const start = i * step;
        const end = Math.min(channel.length, start + step);
        let peak = 0;
        const stride = Math.max(1, Math.floor((end - start) / 120));
        for (let j = start; j < end; j += stride) {
          const v = Math.abs(channel[j]);
          if (v > peak) peak = v;
        }
        computed.push(peak);
        if (peak > maxAmp) maxAmp = peak;
      }
      peaks = computed.map((p) => Math.max(0.16, Math.min(1, p / maxAmp)));
    } catch {
      // Keep fallback peaks if codec isn't natively decodable by Web Audio API
    } finally {
      if (ctx) {
        ctx.close().catch(() => {});
      }
    }
  }

  return { duration, peaks };
}

async function createAndLoadCore(mode: 'mt' | 'st'): Promise<FFmpeg> {
  const origin = window.location.origin;
  const ff = new FFmpeg();

  try {
    if (mode === 'mt') {
      await ff.load({
        coreURL: `${origin}/ffmpeg/mt/ffmpeg-core.js`,
        wasmURL: `${origin}/ffmpeg/mt/ffmpeg-core.wasm`,
        workerURL: `${origin}/ffmpeg/mt/ffmpeg-core.worker.js`,
      });
    } else {
      await ff.load({
        coreURL: `${origin}/ffmpeg/st/ffmpeg-core.js`,
        wasmURL: `${origin}/ffmpeg/st/ffmpeg-core.wasm`,
      });
    }
    return ff;
  } catch (err) {
    ff.terminate();
    throw err;
  }
}

function parseTimestampSeconds(line: string): number | null {
  const match = line.match(/(\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)/);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  const s = Number(match[3]);
  const total = h * 3600 + m * 60 + s;
  return Number.isFinite(total) ? total : null;
}

interface ProbeStreamsResult {
  hasAudio: boolean;
  videoCodec: string;
  duration: number;
}

async function inspectStreams(ffmpeg: FFmpeg, videoPath: string): Promise<ProbeStreamsResult> {
  const logs: string[] = [];
  const logHandler = ({ message }: { message: string }) => {
    logs.push(message);
  };
  ffmpeg.on('log', logHandler);
  try {
    // ffmpeg -i exits with code 1 when no output file is given, while printing full stream metadata
    await ffmpeg.exec(['-i', videoPath]);
  } catch {
    // Expected non-zero exit when inspecting input only
  } finally {
    ffmpeg.off('log', logHandler);
  }

  let hasAudio = false;
  let videoCodec = '';
  let duration = 0;

  for (const line of logs) {
    if (!duration && line.includes('Duration:')) {
      const parsed = parseTimestampSeconds(line);
      if (parsed && parsed > 0) duration = parsed;
    }
    if (!videoCodec && /Stream #\d+:\d+.*Video:\s*([a-zA-Z0-9_]+)/.test(line)) {
      const m = line.match(/Video:\s*([a-zA-Z0-9_]+)/);
      if (m) videoCodec = m[1].toLowerCase();
    }
    if (/Stream #\d+:\d+.*Audio:/.test(line)) {
      hasAudio = true;
    }
  }

  return { hasAudio, videoCodec, duration };
}

function selectOutputContainer(videoExt: string, videoCodec: string): {
  ext: string;
  mimeType: string;
  audioCodecArgs: string[];
  extraFlags: string[];
} {
  if (
    videoCodec === 'vp8' ||
    videoCodec === 'vp9' ||
    videoCodec === 'av1' ||
    (videoExt === '.webm' && !['h264', 'hevc', 'h265', 'mpeg4'].includes(videoCodec))
  ) {
    return {
      ext: '.webm',
      mimeType: 'video/webm',
      audioCodecArgs: ['-c:a', 'libopus', '-b:a', '160k'],
      extraFlags: [],
    };
  }

  if (videoExt === '.mkv' && !['h264', 'hevc', 'h265', 'mpeg4', ''].includes(videoCodec)) {
    return {
      ext: '.mkv',
      mimeType: 'video/x-matroska',
      audioCodecArgs: ['-c:a', 'aac', '-b:a', '192k'],
      extraFlags: [],
    };
  }

  return {
    ext: '.mp4',
    mimeType: 'video/mp4',
    audioCodecArgs: ['-c:a', 'aac', '-b:a', '192k'],
    extraFlags: ['-movflags', '+faststart'],
  };
}

async function executeMergeWithCore(
  coreMode: 'mt' | 'st',
  options: MergeOptions,
  videoBytes: Uint8Array,
  audioBytes: Uint8Array,
  startedAt: number,
  onUpdate?: (update: MergeStageUpdate) => void
): Promise<MergeResult> {
  // Always instantiate a clean FFmpeg worker per merge and terminate afterward so Emscripten
  // pthreads never leak state across jobs and WASM memory is immediately reclaimed.
  const ffmpeg = await createAndLoadCore(coreMode);

  const videoExt = getExtension(options.videoFile.name, '.mp4');
  const audioExt = getExtension(options.audioFile.name, '.mp3');
  const videoPath = `in_video${videoExt}`;
  const audioPath = `in_audio${audioExt}`;
  let outputPath = '';

  try {
    onUpdate?.({ stage: 'probing', progress: 0.14 });

    // Pass copies so ArrayBuffers remain intact if fallback core retry is needed
    await ffmpeg.writeFile(videoPath, videoBytes.slice());
    await ffmpeg.writeFile(audioPath, audioBytes.slice());

    const streamInfo = await inspectStreams(ffmpeg, videoPath);
    const videoDur = streamInfo.duration > 0 ? streamInfo.duration : options.videoDurationHint ?? 0;
    const audioDur = options.audioDurationHint ?? 0;
    const container = selectOutputContainer(videoExt, streamInfo.videoCodec);
    outputPath = `out_merged${container.ext}`;

    const effectiveMix = options.mode === 'mix' && streamInfo.hasAudio;
    if (options.mode === 'mix' && !streamInfo.hasAudio) {
      onUpdate?.({ stage: 'merging', progress: 0.2, noticeKey: 'silentVideoNotice' });
    } else {
      onUpdate?.({ stage: 'merging', progress: 0.2 });
    }

    const args: string[] = ['-i', videoPath];
    if (options.loopAudio) {
      args.push('-stream_loop', '-1');
    }
    args.push('-i', audioPath);

    const addVol = Math.max(0, Math.min(2, options.addedVolume));
    const origVol = Math.max(0, Math.min(2, options.originalVolume));
    const needPad =
      options.trimToVideo &&
      !options.loopAudio &&
      audioDur > 0 &&
      videoDur > 0 &&
      audioDur < videoDur - 0.15;

    if (effectiveMix) {
      const audio1Filters: string[] = [`volume=${addVol.toFixed(2)}`];
      if (needPad) {
        audio1Filters.push(`apad=whole_dur=${videoDur.toFixed(3)}`);
      }
      const filterGraph = [
        `[0:a]volume=${origVol.toFixed(2)}[a0]`,
        `[1:a]${audio1Filters.join(',')}[a1]`,
        '[a0][a1]amix=inputs=2:duration=first:dropout_transition=2:normalize=0[aout]',
      ].join(';');

      args.push('-filter_complex', filterGraph, '-map', '0:v:0', '-map', '[aout]');
    } else {
      const filters: string[] = [];
      if (options.mode === 'mix' && !streamInfo.hasAudio && Math.abs(addVol - 1) > 0.01) {
        filters.push(`volume=${addVol.toFixed(2)}`);
      }
      if (needPad) {
        filters.push(`apad=whole_dur=${videoDur.toFixed(3)}`);
      }

      if (filters.length > 0) {
        args.push(
          '-filter_complex',
          `[1:a]${filters.join(',')}[aout]`,
          '-map',
          '0:v:0',
          '-map',
          '[aout]'
        );
      } else {
        args.push('-map', '0:v:0', '-map', '1:a:0');
      }
    }

    // Stream copy video for zero quality loss and near-instant speed
    args.push('-c:v', 'copy', ...container.audioCodecArgs, ...container.extraFlags);

    // Match output duration cleanly without truncating longer video when audio is shorter
    if (options.trimToVideo || options.loopAudio) {
      if (videoDur > 0) {
        args.push('-t', videoDur.toFixed(3));
      } else {
        args.push('-shortest');
      }
    }

    args.push(outputPath);

    const execLogs: string[] = [];
    const progressHandler = ({ progress, time }: { progress: number; time: number }) => {
      let ratio = Number.isFinite(progress) ? progress : 0;
      if ((ratio <= 0 || ratio > 1) && videoDur > 0 && time > 0) {
        ratio = time / 1_000_000 / videoDur;
      }
      const clamped = Math.max(0, Math.min(0.98, ratio));
      onUpdate?.({ stage: 'merging', progress: 0.2 + clamped * 0.72 });
    };

    const logHandler = ({ message }: { message: string }) => {
      execLogs.push(message);
      if (videoDur > 0 && message.includes('time=')) {
        const m = message.match(/time=(\d{2}:\d{2}:\d{2}(?:\.\d+)?)/);
        if (m) {
          const sec = parseTimestampSeconds(m[1]);
          if (sec !== null && sec >= 0) {
            const clamped = Math.max(0, Math.min(0.98, sec / videoDur));
            onUpdate?.({ stage: 'merging', progress: 0.2 + clamped * 0.72 });
          }
        }
      }
    };

    ffmpeg.on('progress', progressHandler);
    ffmpeg.on('log', logHandler);

    let exitCode = 1;
    try {
      exitCode = await ffmpeg.exec(args);
    } finally {
      ffmpeg.off('progress', progressHandler);
      ffmpeg.off('log', logHandler);
    }

    if (exitCode !== 0) {
      const tail = execLogs.slice(-6).join('\n');
      throw new Error(`FFmpeg exited with code ${exitCode}${tail ? `: ${tail}` : ''}`);
    }

    onUpdate?.({ stage: 'finalizing', progress: 0.96 });
    const rawOut = await ffmpeg.readFile(outputPath);
    const outBytes =
      rawOut instanceof Uint8Array
        ? new Uint8Array(rawOut)
        : new TextEncoder().encode(String(rawOut));
    const blob = new Blob([outBytes], { type: container.mimeType });
    const url = URL.createObjectURL(blob);

    onUpdate?.({ stage: 'finalizing', progress: 1 });

    return {
      blob,
      url,
      filename: `${getBaseName(options.videoFile.name)}-addaudio${container.ext}`,
      mimeType: container.mimeType,
      elapsedMs: Math.round(performance.now() - startedAt),
      coreMode,
      hadOriginalAudio: streamInfo.hasAudio,
    };
  } finally {
    ffmpeg.terminate();
  }
}

export async function mergeAudioAndVideo(
  options: MergeOptions,
  onUpdate?: (update: MergeStageUpdate) => void
): Promise<MergeResult> {
  const startedAt = performance.now();
  onUpdate?.({ stage: 'loading', progress: 0.05 });

  const [videoBytes, audioBytes] = await Promise.all([
    options.videoFile.arrayBuffer().then((b) => new Uint8Array(b)),
    options.audioFile.arrayBuffer().then((b) => new Uint8Array(b)),
  ]);

  const canUseMT =
    typeof window !== 'undefined' &&
    window.crossOriginIsolated === true &&
    typeof SharedArrayBuffer !== 'undefined';

  if (canUseMT) {
    try {
      return await executeMergeWithCore('mt', options, videoBytes, audioBytes, startedAt, onUpdate);
    } catch (err) {
      console.warn('[AddAudio] Multi-threaded FFmpeg fallback to single-threaded:', err);
      onUpdate?.({ stage: 'loading', progress: 0.08 });
    }
  }

  return executeMergeWithCore('st', options, videoBytes, audioBytes, startedAt, onUpdate);
}
