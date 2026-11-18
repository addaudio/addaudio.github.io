export type LangCode = 'en' | 'es' | 'pt' | 'de' | 'fr' | 'ja' | 'zh' | 'ru';

export interface LanguageOption {
  code: LangCode;
  name: string;
  nativeShort: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeShort: 'EN' },
  { code: 'es', name: 'Español', nativeShort: 'ES' },
  { code: 'pt', name: 'Português', nativeShort: 'PT' },
  { code: 'de', name: 'Deutsch', nativeShort: 'DE' },
  { code: 'fr', name: 'Français', nativeShort: 'FR' },
  { code: 'ja', name: '日本語', nativeShort: 'JA' },
  { code: 'zh', name: '简体中文', nativeShort: 'ZH' },
  { code: 'ru', name: 'Русский', nativeShort: 'RU' },
];

export type TranslationKeys = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    howToUse: string;
    privacy: string;
    hireMe: string;
    faqLink: string;
    languageLabel: string;
    themeToggle: string;
    installApp: string;
    installedApp: string;
    supportCta: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  tool: {
    step1Badge: string;
    step1Title: string;
    step1Browse: string;
    step1Formats: string;
    step2Badge: string;
    step2Title: string;
    step2Browse: string;
    step2Formats: string;
    replaceFile: string;
    removeFile: string;
    playPreview: string;
    pausePreview: string;
    modeLabel: string;
    modeReplace: string;
    modeMix: string;
    origVolLabel: string;
    newVolLabel: string;
    loopLabel: string;
    trimLabel: string;
    mergeBtn: string;
    mergingBtn: string;
    statusLoading: string;
    statusProbing: string;
    statusMerging: string;
    statusFinalizing: string;
    successTitle: string;
    successSubtitle: string;
    downloadBtn: string;
    mergeAnotherBtn: string;
    errorTitle: string;
    errorGeneric: string;
    errorBadVideo: string;
    errorBadAudio: string;
    silentVideoNotice: string;
    offlineBadge: string;
  };
  pwa: {
    modalTitle: string;
    iosBody: string;
    desktopBody: string;
    installedBody: string;
    close: string;
  };
  how: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    backToTool: string;
  };
  privacy: {
    title: string;
    subtitle: string;
    backToTool: string;
  };
  hire: {
    badge: string;
    title: string;
    intro: string;
    pitch: string;
    specialtiesHeading: string;
    spec1Title: string;
    spec1Desc: string;
    spec2Title: string;
    spec2Desc: string;
    spec3Title: string;
    spec3Desc: string;
    ctaTitle: string;
    emailBtn: string;
    copyBtn: string;
    copiedBtn: string;
    backToTool: string;
  };
  footer: {
    privacyNote: string;
  };
};

export const translations: Record<LangCode, TranslationKeys> = {
  en: {
    meta: {
      title: 'Add Audio to Video Online Free — Private Browser Merger',
      description:
        'Add audio to video online free with zero file uploads. Merge audio and video or put music over video without watermark directly in your browser.',
    },
    nav: {
      home: 'Home',
      howToUse: 'How to Use',
      privacy: 'Privacy',
      hireMe: 'Hire Me',
      faqLink: 'FAQ',
      languageLabel: 'Select language',
      themeToggle: 'Toggle dark mode',
      installApp: 'Add to Home Screen',
      installedApp: 'Offline Ready',
      supportCta: 'Support',
    },
    hero: {
      title: 'Add Audio to Video Online',
      subtitle:
        'Merge audio and video directly in your browser with 100% privacy, zero file uploads, and no watermark.',
    },
    tool: {
      step1Badge: '1 · Video',
      step1Title: 'Drop Video Here',
      step1Browse: 'or tap to select file',
      step1Formats: 'MP4 · WebM · MOV · MKV',
      step2Badge: '2 · Audio',
      step2Title: 'Drop Audio Here',
      step2Browse: 'or tap to select file',
      step2Formats: 'MP3 · WAV · AAC · M4A',
      replaceFile: 'Change',
      removeFile: 'Remove',
      playPreview: 'Play audio preview',
      pausePreview: 'Pause audio preview',
      modeLabel: 'Audio Track',
      modeReplace: 'Replace Original',
      modeMix: 'Mix Audio',
      origVolLabel: 'Video Audio',
      newVolLabel: 'New Audio',
      loopLabel: 'Loop audio if shorter',
      trimLabel: 'Trim audio to video length',
      mergeBtn: 'Merge Audio & Video',
      mergingBtn: 'Merging in Browser...',
      statusLoading: 'Loading FFmpeg WebAssembly engine...',
      statusProbing: 'Analyzing video & audio streams...',
      statusMerging: 'Merging tracks with zero video quality loss...',
      statusFinalizing: 'Preparing instant download...',
      successTitle: 'Merged Successfully!',
      successSubtitle: 'Original video quality 100% preserved',
      downloadBtn: 'Download Video',
      mergeAnotherBtn: 'Start New',
      errorTitle: 'Merge Error',
      errorGeneric:
        'Unable to merge these files. Please verify both files play properly and try again.',
      errorBadVideo: 'Please choose a valid video file (MP4, WebM, MOV, MKV).',
      errorBadAudio: 'Please choose a valid audio file (MP3, WAV, AAC, M4A).',
      silentVideoNotice:
        'Video has no original audio track — adding new audio directly.',
      offlineBadge: '100% Private · Client-Side',
    },
    pwa: {
      modalTitle: 'Install AddAudio Offline',
      iosBody:
        'Tap your browser Share icon, then choose "Add to Home Screen" to use AddAudio 100% offline anytime.',
      desktopBody:
        'Use your browser menu (Install AddAudio / Add to Home Screen) to keep this tool available 100% offline.',
      installedBody:
        'AddAudio is installed and FFmpeg core assets are cached for 100% offline use.',
      close: 'Got it',
    },
    how: {
      title: 'How to Add Music to Video Without Uploading',
      subtitle:
        'Follow three straightforward steps to merge audio and video locally with zero server uploads and no watermark.',
      step1Title: '1. Select or Drop Your Video',
      step1Desc:
        'Choose any MP4, WebM, MOV, or MKV clip from your device. Your video stream is copied directly (-c:v copy) without re-encoding, preserving full resolution and clarity.',
      step2Title: '2. Add or Mix Your Audio Track',
      step2Desc:
        'Load an MP3, WAV, AAC, or M4A soundtrack. Replace the original video sound completely or switch to Mix Audio to balance both tracks with volume sliders.',
      step3Title: '3. Merge & Download Without Watermark',
      step3Desc:
        'Click "Merge Audio & Video" to process everything inside your browser tab via WebAssembly FFmpeg, then preview and download your clean video file right away.',
      backToTool: 'Open Merger Tool',
    },
    privacy: {
      title: 'Privacy & Zero Data Storage Architecture',
      subtitle:
        'How our private audio video merger keeps your personal recordings, music, and projects 100% on your device.',
      backToTool: 'Back to Merger',
    },
    hire: {
      badge: 'Available for Freelance Projects',
      title: 'Need a Custom IT Solution?',
      intro: "Hi, I'm Kishara Dilshan, the developer behind AddAudio.",
      pitch:
        'If you love this fast, client-side tool and need a world-class IT solution for your own business, I am available for freelance projects. I specialize in:',
      specialtiesHeading: 'Core Specialties',
      spec1Title: 'Ultra-fast, SEO-optimized web applications',
      spec1Desc: 'Astro, React, Next.js — engineered for sub-second loads, technical SEO, and clean scalability.',
      spec2Title: 'Client-side processing & WebAssembly (WASM) tools',
      spec2Desc: 'Zero-server media, PDF, and data utilities that run privately inside the browser.',
      spec3Title: 'UI/UX design & High-converting landing pages',
      spec3Desc: 'Minimal, accessible interfaces crafted to convert visitors effortlessly across desktop and mobile.',
      ctaTitle: "Let's build something amazing together.",
      emailBtn: 'Email me directly: kisharadilshan007@gmail.com',
      copyBtn: 'Copy Email',
      copiedBtn: 'Copied!',
      backToTool: 'Back to AddAudio Merger',
    },
    footer: {
      privacyNote:
        '100% client-side processing via WebAssembly. Your files never leave your device.',
    },
  },
  es: {
    meta: {
      title: 'Añadir Audio a Video Online Gratis — Sin Subidas',
      description:
        'Añade audio o música a un video gratis y sin marcas de agua. Une audio y video directamente en tu navegador con 100% de privacidad.',
    },
    nav: {
      home: 'Inicio',
      howToUse: 'Cómo usar',
      privacy: 'Privacidad',
      hireMe: 'Contrátame',
      faqLink: 'FAQ',
      languageLabel: 'Seleccionar idioma',
      themeToggle: 'Cambiar tema claro/oscuro',
      installApp: 'Añadir a inicio',
      installedApp: 'Listo sin conexión',
      supportCta: 'Apoyar',
    },
    hero: {
      title: 'Añadir Audio a Video Online',
      subtitle:
        'Une audio y video directamente en tu navegador con 100% privacidad, cero subidas y sin marca de agua.',
    },
    tool: {
      step1Badge: '1 · Video',
      step1Title: 'Suelta tu Video Aquí',
      step1Browse: 'o toca para elegir archivo',
      step1Formats: 'MP4 · WebM · MOV · MKV',
      step2Badge: '2 · Audio',
      step2Title: 'Suelta tu Audio Aquí',
      step2Browse: 'o toca para elegir archivo',
      step2Formats: 'MP3 · WAV · AAC · M4A',
      replaceFile: 'Cambiar',
      removeFile: 'Quitar',
      playPreview: 'Reproducir vista previa',
      pausePreview: 'Pausar vista previa',
      modeLabel: 'Pista de Audio',
      modeReplace: 'Reemplazar Original',
      modeMix: 'Mezclar Audio',
      origVolLabel: 'Audio del Video',
      newVolLabel: 'Nuevo Audio',
      loopLabel: 'Repetir audio si es más corto',
      trimLabel: 'Recortar audio al largo del video',
      mergeBtn: 'Unir Audio y Video',
      mergingBtn: 'Uniendo en el navegador...',
      statusLoading: 'Cargando motor FFmpeg WebAssembly...',
      statusProbing: 'Analizando pistas de video y audio...',
      statusMerging: 'Uniendo pistas sin pérdida de calidad...',
      statusFinalizing: 'Preparando descarga instantánea...',
      successTitle: '¡Unido con éxito!',
      successSubtitle: 'Calidad original del video 100% conservada',
      downloadBtn: 'Descargar Video',
      mergeAnotherBtn: 'Nuevo Archivo',
      errorTitle: 'Error al unir',
      errorGeneric:
        'No se pudieron unir estos archivos. Verifica los formatos e inténtalo de nuevo.',
      errorBadVideo: 'Selecciona un video válido (MP4, WebM, MOV, MKV).',
      errorBadAudio: 'Selecciona un audio válido (MP3, WAV, AAC, M4A).',
      silentVideoNotice:
        'El video no tiene audio original — añadiendo el nuevo audio directamente.',
      offlineBadge: '100% Privado · En tu Navegador',
    },
    pwa: {
      modalTitle: 'Instalar AddAudio sin conexión',
      iosBody:
        'Toca el botón Compartir de tu navegador y elige "Añadir a pantalla de inicio" para usar AddAudio 100% offline.',
      desktopBody:
        'Usa el menú de tu navegador (Instalar AddAudio) para tener esta herramienta disponible sin conexión.',
      installedBody:
        'AddAudio está instalado y los archivos de FFmpeg están guardados para uso sin conexión.',
      close: 'Entendido',
    },
    how: {
      title: 'Cómo añadir música a un video sin subir archivos',
      subtitle: 'Tres pasos rápidos. Todo permanece en tu dispositivo.',
      step1Title: '1. Elige tu Video',
      step1Desc:
        'Arrastra o selecciona un clip MP4, WebM, MOV o MKV. El flujo de video se copia sin recodificar para mantener la calidad intacta.',
      step2Title: '2. Añade tu Pista de Audio',
      step2Desc:
        'Suelta un archivo MP3, WAV, AAC o M4A. Elige reemplazar el audio original o mezclar ambos con control de volumen.',
      step3Title: '3. Une y Descarga',
      step3Desc:
        'Pulsa "Unir Audio y Video". WebAssembly FFmpeg combina las pistas localmente en segundos con vista previa inmediata.',
      backToTool: 'Abrir Herramienta',
    },
    privacy: {
      title: 'Privacidad y Cero Almacenamiento',
      subtitle: 'Tus videos y audios nunca salen de tu dispositivo.',
      backToTool: 'Volver al Editor',
    },
    hire: {
      badge: 'Disponible para Proyectos Freelance',
      title: '¿Necesitas una Solución IT a Medida?',
      intro: 'Hola, soy Kishara Dilshan, el desarrollador detrás de AddAudio.',
      pitch:
        'Si te encanta esta herramienta rápida en el cliente y necesitas una solución IT de primer nivel para tu negocio, estoy disponible para proyectos freelance. Me especializo en:',
      specialtiesHeading: 'Especialidades Principales',
      spec1Title: 'Aplicaciones web ultrarrápidas y optimizadas para SEO',
      spec1Desc: 'Astro, React, Next.js — diseñadas para carga instantánea y posicionamiento técnico.',
      spec2Title: 'Procesamiento en el cliente y herramientas WebAssembly (WASM)',
      spec2Desc: 'Utilidades multimedia y de datos 100% privadas dentro del navegador.',
      spec3Title: 'Diseño UI/UX y landing pages de alta conversión',
      spec3Desc: 'Interfaces minimalistas y accesibles pensadas para convertir en escritorio y móvil.',
      ctaTitle: 'Construyamos algo increíble juntos.',
      emailBtn: 'Escríbeme directamente: kisharadilshan007@gmail.com',
      copyBtn: 'Copiar correo',
      copiedBtn: '¡Copiado!',
      backToTool: 'Volver a AddAudio',
    },
    footer: {
      privacyNote:
        'Procesamiento 100% local con WebAssembly. Tus archivos nunca salen de tu dispositivo.',
    },
  },
  pt: {
    meta: {
      title: 'Adicionar Áudio ao Vídeo Online Grátis — Privado',
      description:
        'Adicione áudio ou música ao vídeo online grátis sem enviar arquivos. Junte áudio e vídeo sem marca d’água direto no navegador.',
    },
    nav: {
      home: 'Início',
      howToUse: 'Como Usar',
      privacy: 'Privacidade',
      hireMe: 'Contrate-me',
      faqLink: 'FAQ',
      languageLabel: 'Selecionar idioma',
      themeToggle: 'Alternar modo claro/escuro',
      installApp: 'Adicionar à Tela Inicial',
      installedApp: 'Pronto Offline',
      supportCta: 'Apoiar',
    },
    hero: {
      title: 'Adicionar Áudio ao Vídeo Online',
      subtitle:
        'Junte áudio e vídeo direto no navegador com 100% de privacidade, zero uploads e sem marca d’água.',
    },
    tool: {
      step1Badge: '1 · Vídeo',
      step1Title: 'Solte o Vídeo Aqui',
      step1Browse: 'ou toque para selecionar',
      step1Formats: 'MP4 · WebM · MOV · MKV',
      step2Badge: '2 · Áudio',
      step2Title: 'Solte o Áudio Aqui',
      step2Browse: 'ou toque para selecionar',
      step2Formats: 'MP3 · WAV · AAC · M4A',
      replaceFile: 'Trocar',
      removeFile: 'Remover',
      playPreview: 'Ouvir prévia',
      pausePreview: 'Pausar prévia',
      modeLabel: 'Faixa de Áudio',
      modeReplace: 'Substituir Original',
      modeMix: 'Mixar Áudio',
      origVolLabel: 'Áudio do Vídeo',
      newVolLabel: 'Novo Áudio',
      loopLabel: 'Repetir áudio se for menor',
      trimLabel: 'Cortar áudio na duração do vídeo',
      mergeBtn: 'Juntar Áudio e Vídeo',
      mergingBtn: 'Processando no navegador...',
      statusLoading: 'Carregando motor FFmpeg WebAssembly...',
      statusProbing: 'Analisando faixas de vídeo e áudio...',
      statusMerging: 'Unindo faixas sem perda de qualidade...',
      statusFinalizing: 'Preparando download instantâneo...',
      successTitle: 'Combinado com Sucesso!',
      successSubtitle: 'Qualidade original do vídeo 100% preservada',
      downloadBtn: 'Baixar Vídeo',
      mergeAnotherBtn: 'Novo Arquivo',
      errorTitle: 'Erro ao combinar',
      errorGeneric:
        'Não foi possível unir esses arquivos. Verifique os formatos e tente novamente.',
      errorBadVideo: 'Escolha um arquivo de vídeo válido (MP4, WebM, MOV, MKV).',
      errorBadAudio: 'Escolha um arquivo de áudio válido (MP3, WAV, AAC, M4A).',
      silentVideoNotice:
        'O vídeo não possui áudio original — adicionando o novo áudio diretamente.',
      offlineBadge: '100% Privado · No Navegador',
    },
    pwa: {
      modalTitle: 'Instalar AddAudio Offline',
      iosBody:
        'Toque no ícone Compartilhar do navegador e escolha "Adicionar à Tela de Início" para usar 100% offline.',
      desktopBody:
        'Use o menu do navegador (Instalar AddAudio) para manter esta ferramenta disponível sem internet.',
      installedBody:
        'AddAudio está instalado e os arquivos FFmpeg estão salvos para uso offline.',
      close: 'Entendi',
    },
    how: {
      title: 'Como Adicionar Música ao Vídeo sem Upload',
      subtitle: 'Três passos simples. Tudo fica no seu dispositivo.',
      step1Title: '1. Escolha seu Vídeo',
      step1Desc:
        'Arraste ou selecione um vídeo MP4, WebM, MOV ou MKV. O fluxo de vídeo é copiado sem recodificação.',
      step2Title: '2. Adicione o Áudio',
      step2Desc:
        'Solte um arquivo MP3, WAV, AAC ou M4A. Substitua o som original ou faça a mixagem com controle de volume.',
      step3Title: '3. Junte e Baixe',
      step3Desc:
        'Clique em "Juntar Áudio e Vídeo". O FFmpeg em WebAssembly combina tudo localmente em segundos.',
      backToTool: 'Abrir Ferramenta',
    },
    privacy: {
      title: 'Privacidade e Zero Armazenamento',
      subtitle: 'Seus arquivos nunca saem do seu dispositivo.',
      backToTool: 'Voltar para a Ferramenta',
    },
    hire: {
      badge: 'Disponível para Projetos Freelance',
      title: 'Precisa de uma Solução de TI Sob Medida?',
      intro: 'Olá, eu sou Kishara Dilshan, o desenvolvedor por trás do AddAudio.',
      pitch:
        'Se você gostou desta ferramenta rápida no navegador e precisa de uma solução de TI de alto nível para o seu negócio, estou disponível para projetos freelance. Sou especialista em:',
      specialtiesHeading: 'Especialidades Principais',
      spec1Title: 'Aplicações web ultrarrápidas e otimizadas para SEO',
      spec1Desc: 'Astro, React, Next.js — velocidade instantânea, SEO técnico e alta confiabilidade.',
      spec2Title: 'Processamento no cliente e ferramentas WebAssembly (WASM)',
      spec2Desc: 'Ferramentas privadas que processam mídia e dados diretamente no navegador.',
      spec3Title: 'Design UI/UX e landing pages de alta conversão',
      spec3Desc: 'Interfaces minimalistas e responsivas focadas em resultados.',
      ctaTitle: 'Vamos construir algo incrível juntos.',
      emailBtn: 'Envie um e-mail direto: kisharadilshan007@gmail.com',
      copyBtn: 'Copiar e-mail',
      copiedBtn: 'Copiado!',
      backToTool: 'Voltar ao AddAudio',
    },
    footer: {
      privacyNote:
        'Processamento 100% local via WebAssembly. Seus arquivos nunca saem do seu dispositivo.',
    },
  },
  de: {
    meta: {
      title: 'Audio zu Video hinzufügen Online — Kostenlos & Privat',
      description:
        'Audio und Musik kostenlos im Browser mit Videos verbinden. Ohne Upload, ohne Wasserzeichen und 100% lokal per WebAssembly.',
    },
    nav: {
      home: 'Start',
      howToUse: 'Anleitung',
      privacy: 'Datenschutz',
      hireMe: 'Beauftragen',
      faqLink: 'FAQ',
      languageLabel: 'Sprache wählen',
      themeToggle: 'Hell-/Dunkelmodus umschalten',
      installApp: 'Zum Startbildschirm',
      installedApp: 'Offline bereit',
      supportCta: 'Unterstützen',
    },
    hero: {
      title: 'Audio zu Video hinzufügen Online',
      subtitle:
        'Audio und Video direkt im Browser verbinden — 100% privat, ohne Datei-Uploads und ohne Wasserzeichen.',
    },
    tool: {
      step1Badge: '1 · Video',
      step1Title: 'Video hier ablegen',
      step1Browse: 'oder tippen zum Auswählen',
      step1Formats: 'MP4 · WebM · MOV · MKV',
      step2Badge: '2 · Audio',
      step2Title: 'Audio hier ablegen',
      step2Browse: 'oder tippen zum Auswählen',
      step2Formats: 'MP3 · WAV · AAC · M4A',
      replaceFile: 'Ändern',
      removeFile: 'Entfernen',
      playPreview: 'Audio-Vorschau abspielen',
      pausePreview: 'Audio-Vorschau pausieren',
      modeLabel: 'Tonspur',
      modeReplace: 'Original ersetzen',
      modeMix: 'Audio mischen',
      origVolLabel: 'Video-Ton',
      newVolLabel: 'Neues Audio',
      loopLabel: 'Audio wiederholen, falls kürzer',
      trimLabel: 'Audio an Videolänge anpassen',
      mergeBtn: 'Audio & Video verbinden',
      mergingBtn: 'Wird im Browser verbunden...',
      statusLoading: 'FFmpeg WebAssembly-Engine wird geladen...',
      statusProbing: 'Video- und Audiostreams werden geprüft...',
      statusMerging: 'Spuren werden ohne Qualitätsverlust verbunden...',
      statusFinalizing: 'Sofort-Download wird vorbereitet...',
      successTitle: 'Erfolgreich verbunden!',
      successSubtitle: 'Original-Videoqualität zu 100% erhalten',
      downloadBtn: 'Video herunterladen',
      mergeAnotherBtn: 'Neu starten',
      errorTitle: 'Fehler beim Verbinden',
      errorGeneric:
        'Die Dateien konnten nicht verbunden werden. Bitte Formate prüfen und erneut versuchen.',
      errorBadVideo: 'Bitte eine gültige Videodatei wählen (MP4, WebM, MOV, MKV).',
      errorBadAudio: 'Bitte eine gültige Audiodatei wählen (MP3, WAV, AAC, M4A).',
      silentVideoNotice:
        'Video hat keine Original-Tonspur — neues Audio wird direkt hinzugefügt.',
      offlineBadge: '100% Privat · Client-Side',
    },
    pwa: {
      modalTitle: 'AddAudio offline installieren',
      iosBody:
        'Tippe auf Teilen im Browser und wähle „Zum Home-Bildschirm“, um AddAudio jederzeit 100% offline zu nutzen.',
      desktopBody:
        'Wähle im Browser-Menü „AddAudio installieren“, um das Tool komplett offline bereitzuhalten.',
      installedBody:
        'AddAudio ist installiert und die FFmpeg-Dateien sind für den Offline-Betrieb zwischengespeichert.',
      close: 'Verstanden',
    },
    how: {
      title: 'Musik ohne Upload zu Video hinzufügen',
      subtitle: 'Drei schnelle Schritte. Alles bleibt lokal auf deinem Gerät.',
      step1Title: '1. Video auswählen',
      step1Desc:
        'Lege ein MP4-, WebM-, MOV- oder MKV-Video ab. Der Videostream wird ohne Neucodierung direkt kopiert.',
      step2Title: '2. Audiospur hinzufügen',
      step2Desc:
        'Wähle MP3, WAV, AAC oder M4A. Ersetze den Originalton oder mische beide Spuren mit Lautstärkereglern.',
      step3Title: '3. Verbinden & Laden',
      step3Desc:
        'Klicke auf „Audio & Video verbinden“. WebAssembly FFmpeg erledigt alles in Sekunden direkt im Browser.',
      backToTool: 'Zum Tool',
    },
    privacy: {
      title: 'Datenschutz & Zero-Storage Architektur',
      subtitle: 'Deine Medien verlassen niemals dein Gerät.',
      backToTool: 'Zurück zum Tool',
    },
    hire: {
      badge: 'Verfügbar für Freelance-Projekte',
      title: 'Individuelle IT-Lösung benötigt?',
      intro: 'Hallo, ich bin Kishara Dilshan, der Entwickler hinter AddAudio.',
      pitch:
        'Wenn dir dieses schnelle, clientseitige Tool gefällt und du eine erstklassige IT-Lösung für dein Unternehmen suchst, stehe ich für Freelance-Projekte zur Verfügung. Meine Schwerpunkte:',
      specialtiesHeading: 'Spezialgebiete',
      spec1Title: 'Ultraschnelle, SEO-optimierte Webanwendungen',
      spec1Desc: 'Astro, React, Next.js — entwickelt für maximale Geschwindigkeit und sauberes SEO.',
      spec2Title: 'Clientseitige Verarbeitung & WebAssembly (WASM) Tools',
      spec2Desc: 'Datenschutzfreundliche Browser-Tools ohne Server-Upload.',
      spec3Title: 'UI/UX-Design & konversionsstarke Landingpages',
      spec3Desc: 'Minimalistische, barrierefreie Interfaces für Desktop und Mobilgeräte.',
      ctaTitle: 'Lass uns gemeinsam etwas Großartiges bauen.',
      emailBtn: 'Direkt per E-Mail: kisharadilshan007@gmail.com',
      copyBtn: 'E-Mail kopieren',
      copiedBtn: 'Kopiert!',
      backToTool: 'Zurück zu AddAudio',
    },
    footer: {
      privacyNote:
        '100% lokale Verarbeitung per WebAssembly. Deine Dateien verlassen nie dein Gerät.',
    },
  },
  fr: {
    meta: {
      title: 'Ajouter Audio à une Vidéo en Ligne Gratuit — Privé',
      description:
        'Ajoutez de la musique ou de l’audio à une vidéo gratuitement sans envoi sur serveur. Fusionnez audio et vidéo sans filigrane.',
    },
    nav: {
      home: 'Accueil',
      howToUse: 'Mode d’emploi',
      privacy: 'Confidentialité',
      hireMe: 'Me recruter',
      faqLink: 'FAQ',
      languageLabel: 'Choisir la langue',
      themeToggle: 'Changer de thème',
      installApp: 'Ajouter à l’écran d’accueil',
      installedApp: 'Prêt hors ligne',
      supportCta: 'Soutenir',
    },
    hero: {
      title: 'Ajouter Audio à une Vidéo en Ligne',
      subtitle:
        'Fusionnez audio et vidéo directement dans votre navigateur avec 100% de confidentialité, zéro envoi et sans filigrane.',
    },
    tool: {
      step1Badge: '1 · Vidéo',
      step1Title: 'Déposez la Vidéo Ici',
      step1Browse: 'ou touchez pour choisir',
      step1Formats: 'MP4 · WebM · MOV · MKV',
      step2Badge: '2 · Audio',
      step2Title: 'Déposez l’Audio Ici',
      step2Browse: 'ou touchez pour choisir',
      step2Formats: 'MP3 · WAV · AAC · M4A',
      replaceFile: 'Changer',
      removeFile: 'Retirer',
      playPreview: 'Écouter l’aperçu',
      pausePreview: 'Mettre en pause',
      modeLabel: 'Piste Audio',
      modeReplace: 'Remplacer l’original',
      modeMix: 'Mixer les pistes',
      origVolLabel: 'Audio Vidéo',
      newVolLabel: 'Nouvel Audio',
      loopLabel: 'Boucler l’audio si plus court',
      trimLabel: 'Couper l’audio à la durée vidéo',
      mergeBtn: 'Fusionner Audio & Vidéo',
      mergingBtn: 'Fusion dans le navigateur...',
      statusLoading: 'Chargement du moteur FFmpeg WebAssembly...',
      statusProbing: 'Analyse des flux vidéo et audio...',
      statusMerging: 'Fusion des pistes sans perte de qualité...',
      statusFinalizing: 'Préparation du téléchargement...',
      successTitle: 'Fusion réussie !',
      successSubtitle: 'Qualité vidéo d’origine 100% préservée',
      downloadBtn: 'Télécharger la Vidéo',
      mergeAnotherBtn: 'Nouveau Projet',
      errorTitle: 'Erreur de fusion',
      errorGeneric:
        'Impossible de fusionner ces fichiers. Vérifiez les formats et réessayez.',
      errorBadVideo: 'Veuillez choisir une vidéo valide (MP4, WebM, MOV, MKV).',
      errorBadAudio: 'Veuillez choisir un audio valide (MP3, WAV, AAC, M4A).',
      silentVideoNotice:
        'Vidéo sans piste audio d’origine — ajout direct de la nouvelle piste.',
      offlineBadge: '100% Privé · Local',
    },
    pwa: {
      modalTitle: 'Installer AddAudio hors ligne',
      iosBody:
        'Touchez le bouton Partager puis « Sur l’écran d’accueil » pour utiliser AddAudio 100% hors ligne.',
      desktopBody:
        'Utilisez le menu du navigateur (Installer AddAudio) pour garder cet outil disponible sans internet.',
      installedBody:
        'AddAudio est installé et les modules FFmpeg sont en cache pour un usage 100% hors ligne.',
      close: 'Compris',
    },
    how: {
      title: 'Comment ajouter de la musique à une vidéo sans téléversement',
      subtitle: 'Trois étapes simples. Tout reste sur votre appareil.',
      step1Title: '1. Choisissez votre Vidéo',
      step1Desc:
        'Déposez un fichier MP4, WebM, MOV ou MKV. Le flux vidéo est copié sans réencodage pour conserver 100% de la qualité.',
      step2Title: '2. Ajoutez votre Piste Audio',
      step2Desc:
        'Sélectionnez un MP3, WAV, AAC ou M4A. Remplacez la bande-son originale ou mixez les deux avec précision.',
      step3Title: '3. Fusionnez et Téléchargez',
      step3Desc:
        'Cliquez sur « Fusionner Audio & Vidéo ». WebAssembly FFmpeg assemble le tout localement en quelques secondes.',
      backToTool: 'Ouvrir l’outil',
    },
    privacy: {
      title: 'Confidentialité & Zéro Stockage',
      subtitle: 'Vos médias ne quittent jamais votre appareil.',
      backToTool: 'Retour à l’outil',
    },
    hire: {
      badge: 'Disponible en Freelance',
      title: 'Besoin d’une Solution IT sur Mesure ?',
      intro: 'Bonjour, je suis Kishara Dilshan, le développeur derrière AddAudio.',
      pitch:
        'Si vous appréciez cet outil rapide côté client et recherchez une solution informatique sur mesure pour votre entreprise, je suis disponible pour des missions freelance. Je suis spécialisé en :',
      specialtiesHeading: 'Domaines d’expertise',
      spec1Title: 'Applications web ultra-rapides et optimisées SEO',
      spec1Desc: 'Astro, React, Next.js — conçues pour des chargements instantanés et un SEO solide.',
      spec2Title: 'Traitement côté client & outils WebAssembly (WASM)',
      spec2Desc: 'Outils multimédia et utilitaires respectueux de la vie privée directement dans le navigateur.',
      spec3Title: 'Design UI/UX & pages d’atterrissage performantes',
      spec3Desc: 'Interfaces épurées et accessibles pensées pour convertir efficacement.',
      ctaTitle: 'Construisons ensemble quelque chose d’exceptionnel.',
      emailBtn: 'Écrivez-moi directement : kisharadilshan007@gmail.com',
      copyBtn: 'Copier l’e-mail',
      copiedBtn: 'Copié !',
      backToTool: 'Retour à AddAudio',
    },
    footer: {
      privacyNote:
        'Traitement 100% local par WebAssembly. Vos fichiers ne quittent jamais votre appareil.',
    },
  },
  ja: {
    meta: {
      title: '動画に音声を追加 オンライン無料 — 完全ローカル結合',
      description:
        'アップロード不要・透かしなしで動画に音声やBGMを無料追加。ブラウザ内WebAssembly処理でプライバシーを100%保護します。',
    },
    nav: {
      home: 'ホーム',
      howToUse: '使い方',
      privacy: 'プライバシー',
      hireMe: '制作依頼',
      faqLink: 'FAQ',
      languageLabel: '言語を選択',
      themeToggle: 'ライト/ダーク切替',
      installApp: 'ホーム画面に追加',
      installedApp: 'オフライン対応済',
      supportCta: '応援する',
    },
    hero: {
      title: '動画に音声を追加 オンライン',
      subtitle:
        '100%プライバシー保護・サーバー送信ゼロ・透かしなしで、ブラウザ上から音声と動画を高速結合できます。',
    },
    tool: {
      step1Badge: '1 · 動画',
      step1Title: '動画をドロップ',
      step1Browse: 'またはタップして選択',
      step1Formats: 'MP4 · WebM · MOV · MKV',
      step2Badge: '2 · 音声',
      step2Title: '音声をドロップ',
      step2Browse: 'またはタップして選択',
      step2Formats: 'MP3 · WAV · AAC · M4A',
      replaceFile: '変更',
      removeFile: '削除',
      playPreview: '音声を再生',
      pausePreview: '音声を一時停止',
      modeLabel: '音声モード',
      modeReplace: '元の音声を置換',
      modeMix: '元の音声とミックス',
      origVolLabel: '動画の音量',
      newVolLabel: '追加音声',
      loopLabel: '短い音声をループ再生',
      trimLabel: '動画の長さに合わせてカット',
      mergeBtn: '音声と動画を結合',
      mergingBtn: 'ブラウザで処理中...',
      statusLoading: 'FFmpeg WebAssemblyエンジンを読み込み中...',
      statusProbing: '動画・音声ストリームを解析中...',
      statusMerging: '画質無劣化のまま結合しています...',
      statusFinalizing: 'ダウンロードファイルを準備中...',
      successTitle: '結合が完了しました！',
      successSubtitle: '元の動画画質を100%維持しています',
      downloadBtn: '動画をダウンロード',
      mergeAnotherBtn: '別のファイルを作る',
      errorTitle: '結合エラー',
      errorGeneric:
        '結合できませんでした。ファイル形式を確認してもう一度お試しください。',
      errorBadVideo: '対応している動画ファイルを選択してください (MP4, WebM, MOV, MKV)。',
      errorBadAudio: '対応している音声ファイルを選択してください (MP3, WAV, AAC, M4A)。',
      silentVideoNotice:
        '元の動画に音声トラックがないため、新しい音声をそのまま追加します。',
      offlineBadge: '100% プライバシー保護・ローカル処理',
    },
    pwa: {
      modalTitle: 'AddAudioをオフラインで使う',
      iosBody:
        'ブラウザの共有ボタンから「ホーム画面に追加」を選ぶと、いつでも完全オフラインで利用できます。',
      desktopBody:
        'ブラウザのメニュー（アプリをインストール / ホーム画面に追加）からオフラインアプリとして保存できます。',
      installedBody:
        'インストール済みです。FFmpegコアもキャッシュされ、完全オフラインで動作します。',
      close: '閉じる',
    },
    how: {
      title: 'アップロードなしで動画にBGMを追加する方法',
      subtitle: 'わずか3ステップ。すべての処理はお使いの端末内で完結します。',
      step1Title: '1. 動画を選択',
      step1Desc:
        'MP4・WebM・MOV・MKVをドロップします。映像は再エンコードせずコピーするため、画質は100%そのままです。',
      step2Title: '2. 音声を追加',
      step2Desc:
        'MP3・WAV・AAC・M4Aを追加し、置換またはミックス（音量調整可）を選択します。',
      step3Title: '3. 結合して保存',
      step3Desc:
        '「音声と動画を結合」を押すだけ。WebAssembly版FFmpegが数秒でローカル結合し、すぐダウンロードできます。',
      backToTool: 'ツールを開く',
    },
    privacy: {
      title: 'プライバシーとデータ非保存設計',
      subtitle: 'あなたのメディアが端末の外に出ることは一切ありません。',
      backToTool: 'ツールに戻る',
    },
    hire: {
      badge: 'フリーランス案件受付中',
      title: 'カスタムITソリューションをお探しですか？',
      intro: 'こんにちは。AddAudioの開発者 Kishara Dilshan です。',
      pitch:
        'このような高速・クライアント完結型ツールを気に入り、ビジネス向けのカスタムITソリューションをご希望でしたら、フリーランスとして開発をお受けしています。主な専門分野：',
      specialtiesHeading: '専門領域',
      spec1Title: '超高速・SEO最適化されたWebアプリケーション',
      spec1Desc: 'Astro・React・Next.js を用いた高速レンダリングと堅牢なテクニカルSEO設計。',
      spec2Title: 'クライアント側処理・WebAssembly (WASM) ツール',
      spec2Desc: 'サーバー送信ゼロでブラウザ上で完結する高プライバシーWebツール。',
      spec3Title: 'UI/UXデザイン・高コンバージョンLP制作',
      spec3Desc: 'ミニマルでアクセシブルな体験と成果につながるランディングページ設計。',
      ctaTitle: '素晴らしいプロダクトを一緒に作りましょう。',
      emailBtn: 'メールで直接問い合わせ: kisharadilshan007@gmail.com',
      copyBtn: 'メールをコピー',
      copiedBtn: 'コピーしました！',
      backToTool: 'AddAudioに戻る',
    },
    footer: {
      privacyNote:
        'WebAssemblyによる100%ローカル処理。ファイルが外部へ送信されることはありません。',
    },
  },
  zh: {
    meta: {
      title: '在线免费为视频添加音频 — 浏览器本地无损合并',
      description:
        '无需上传文件、无水印，直接在浏览器中免费将音乐或音频合并到视频。100%本地WebAssembly处理，保护文件隐私。',
    },
    nav: {
      home: '首页',
      howToUse: '使用指南',
      privacy: '隐私保护',
      hireMe: '雇佣合作',
      faqLink: '常见问题',
      languageLabel: '选择语言',
      themeToggle: '切换明暗主题',
      installApp: '添加到主屏幕',
      installedApp: '已支持离线',
      supportCta: '赞助支持',
    },
    hero: {
      title: '在线为视频添加音频',
      subtitle:
        '直接在浏览器本地合并音频与视频，100%隐私安全、零文件上传、无水印。',
    },
    tool: {
      step1Badge: '1 · 视频',
      step1Title: '拖放视频到这里',
      step1Browse: '或点击选择文件',
      step1Formats: 'MP4 · WebM · MOV · MKV',
      step2Badge: '2 · 音频',
      step2Title: '拖放音频到这里',
      step2Browse: '或点击选择文件',
      step2Formats: 'MP3 · WAV · AAC · M4A',
      replaceFile: '更换',
      removeFile: '移除',
      playPreview: '试听音频',
      pausePreview: '暂停试听',
      modeLabel: '音轨模式',
      modeReplace: '替换原声',
      modeMix: '与原声混音',
      origVolLabel: '视频原声',
      newVolLabel: '新加音频',
      loopLabel: '音频较短时自动循环',
      trimLabel: '自动裁剪音频匹配视频时长',
      mergeBtn: '合并音频与视频',
      mergingBtn: '正在本地合并...',
      statusLoading: '正在加载 FFmpeg WebAssembly 引擎...',
      statusProbing: '正在分析音视频流信息...',
      statusMerging: '正在无损复制视频流并合并音轨...',
      statusFinalizing: '正在生成可下载视频...',
      successTitle: '合并完成！',
      successSubtitle: '100% 保留原始视频画质',
      downloadBtn: '下载视频',
      mergeAnotherBtn: '处理下一个',
      errorTitle: '合并失败',
      errorGeneric: '无法合并所选文件，请确认音视频格式正常后重试。',
      errorBadVideo: '请选择有效的视频文件 (MP4, WebM, MOV, MKV)。',
      errorBadAudio: '请选择有效的音频文件 (MP3, WAV, AAC, M4A)。',
      silentVideoNotice: '原视频无音轨 — 将直接添加所选音频。',
      offlineBadge: '100% 本地隐私 · 零上传',
    },
    pwa: {
      modalTitle: '离线安装 AddAudio',
      iosBody:
        '点击浏览器底部分享图标，选择“添加到主屏幕”，即可随时 100% 离线使用 AddAudio。',
      desktopBody:
        '通过浏览器菜单（安装 AddAudio / 添加到主屏幕）保存为本地应用，断网也能正常使用。',
      installedBody:
        'AddAudio 已安装且 FFmpeg 核心文件已缓存，可 100% 离线运行。',
      close: '知道了',
    },
    how: {
      title: '无需上传即可为视频添加背景音乐',
      subtitle: '只需三步，所有处理完全在您的设备本地完成。',
      step1Title: '1. 选择视频',
      step1Desc:
        '拖入或选择 MP4、WebM、MOV 或 MKV 视频。视频画面直接流式拷贝，不重新编码，画质零损失。',
      step2Title: '2. 添加音轨',
      step2Desc:
        '导入 MP3、WAV、AAC 或 M4A 音频。可选择直接替换原声，或调节音量滑块混合双音轨。',
      step3Title: '3. 一键合并下载',
      step3Desc:
        '点击“合并音频与视频”，WebAssembly 版 FFmpeg 将在数秒内于本地完成合并并即时预览下载。',
      backToTool: '返回合并工具',
    },
    privacy: {
      title: '隐私安全与零数据存储说明',
      subtitle: '您的媒体文件永远不会离开您的设备。',
      backToTool: '返回工具首页',
    },
    hire: {
      badge: '承接自由职业开发项目',
      title: '需要定制 IT 解决方案吗？',
      intro: '你好，我是 AddAudio 的开发者 Kishara Dilshan。',
      pitch:
        '如果您喜欢这款极速本地化的浏览器工具，并希望为您的业务打造高质量的定制 IT 解决方案，欢迎随时联系我承接项目。我专注于：',
      specialtiesHeading: '核心专长',
      spec1Title: '超快、SEO 友好的现代 Web 应用',
      spec1Desc: 'Astro、React、Next.js —— 为极致加载速度、技术 SEO 与可扩展性而构建。',
      spec2Title: '纯客户端处理与 WebAssembly (WASM) 工具',
      spec2Desc: '零服务器上传、充分保护数据隐私的浏览器原生工具。',
      spec3Title: 'UI/UX 设计与高转化率落地页',
      spec3Desc: '兼顾极简美学、无障碍体验与高转化效率的桌面及移动端页面。',
      ctaTitle: '让我们一起打造令人惊艳的产品。',
      emailBtn: '直接发邮件给我: kisharadilshan007@gmail.com',
      copyBtn: '复制邮箱',
      copiedBtn: '已复制！',
      backToTool: '返回 AddAudio',
    },
    footer: {
      privacyNote:
        '100% 浏览器本地 WebAssembly 处理，文件绝不上传至任何服务器。',
    },
  },
  ru: {
    meta: {
      title: 'Добавить аудио в видео онлайн бесплатно — Без загрузки',
      description:
        'Наложите музыку на видео без водяных знаков и без загрузки на сервер. Объединяйте аудио и видео прямо в браузере бесплатно.',
    },
    nav: {
      home: 'Главная',
      howToUse: 'Инструкция',
      privacy: 'Приватность',
      hireMe: 'Нанять меня',
      faqLink: 'FAQ',
      languageLabel: 'Выбрать язык',
      themeToggle: 'Светлая / тёмная тема',
      installApp: 'На экран «Домой»',
      installedApp: 'Готово офлайн',
      supportCta: 'Поддержать',
    },
    hero: {
      title: 'Добавить аудио в видео онлайн',
      subtitle:
        'Объединяйте аудио и видео прямо в браузере со 100% приватностью, без загрузки файлов и без водяных знаков.',
    },
    tool: {
      step1Badge: '1 · Видео',
      step1Title: 'Перетащите видео сюда',
      step1Browse: 'или нажмите для выбора',
      step1Formats: 'MP4 · WebM · MOV · MKV',
      step2Badge: '2 · Аудио',
      step2Title: 'Перетащите аудио сюда',
      step2Browse: 'или нажмите для выбора',
      step2Formats: 'MP3 · WAV · AAC · M4A',
      replaceFile: 'Заменить',
      removeFile: 'Удалить',
      playPreview: 'Прослушать аудио',
      pausePreview: 'Пауза',
      modeLabel: 'Аудиодорожка',
      modeReplace: 'Заменить звук',
      modeMix: 'Смешать звуки',
      origVolLabel: 'Звук видео',
      newVolLabel: 'Новое аудио',
      loopLabel: 'Повторять аудио, если короче',
      trimLabel: 'Обрезать аудио по длине видео',
      mergeBtn: 'Объединить аудио и видео',
      mergingBtn: 'Обработка в браузере...',
      statusLoading: 'Загрузка движка FFmpeg WebAssembly...',
      statusProbing: 'Анализ видео- и аудиопотоков...',
      statusMerging: 'Сборка без потери качества видео...',
      statusFinalizing: 'Подготовка файла к скачиванию...',
      successTitle: 'Готово к скачиванию!',
      successSubtitle: 'Исходное качество видео сохранено на 100%',
      downloadBtn: 'Скачать видео',
      mergeAnotherBtn: 'Новый файл',
      errorTitle: 'Ошибка объединения',
      errorGeneric:
        'Не удалось объединить файлы. Проверьте форматы и попробуйте снова.',
      errorBadVideo: 'Выберите корректный видеофайл (MP4, WebM, MOV, MKV).',
      errorBadAudio: 'Выберите корректный аудиофайл (MP3, WAV, AAC, M4A).',
      silentVideoNotice:
        'В видео нет исходного звука — новая дорожка будет добавлена напрямую.',
      offlineBadge: '100% Приватно · Локально',
    },
    pwa: {
      modalTitle: 'Установить AddAudio офлайн',
      iosBody:
        'Нажмите «Поделиться» в браузере и выберите «На экран „Домой“», чтобы пользоваться AddAudio полностью офлайн.',
      desktopBody:
        'Откройте меню браузера и выберите «Установить AddAudio», чтобы работать без интернета.',
      installedBody:
        'AddAudio установлен, а файлы FFmpeg кэшированы для работы полностью офлайн.',
      close: 'Понятно',
    },
    how: {
      title: 'Как добавить музыку в видео без загрузки на сервер',
      subtitle: 'Три простых шага. Все данные остаются на вашем устройстве.',
      step1Title: '1. Выберите видео',
      step1Desc:
        'Перетащите клип MP4, WebM, MOV или MKV. Видеопоток копируется напрямую без перекодирования.',
      step2Title: '2. Добавьте аудио',
      step2Desc:
        'Загрузите MP3, WAV, AAC или M4A. Замените оригинальную дорожку или смешайте обе с помощью ползунков громкости.',
      step3Title: '3. Объедините и скачайте',
      step3Desc:
        'Нажмите «Объединить аудио и видео». WebAssembly FFmpeg мгновенно объединит дорожки прямо в браузере.',
      backToTool: 'Открыть инструмент',
    },
    privacy: {
      title: 'Приватность и нулевое хранение данных',
      subtitle: 'Ваши файлы никогда не покидают ваше устройство.',
      backToTool: 'Вернуться к редактору',
    },
    hire: {
      badge: 'Открыт для фриланс-проектов',
      title: 'Нужно индивидуальное IT-решение?',
      intro: 'Привет! Я Кишара Дилшан, разработчик AddAudio.',
      pitch:
        'Если вам понравился этот быстрый браузерный инструмент и вы хотите создать качественное IT-решение для своего бизнеса, я открыт к фриланс-проектам. Моя специализация:',
      specialtiesHeading: 'Ключевые компетенции',
      spec1Title: 'Сверхбыстрые SEO-оптимизированные веб-приложения',
      spec1Desc: 'Astro, React, Next.js — высокая скорость загрузки, техническое SEO и надежная архитектура.',
      spec2Title: 'Клиентская обработка и WebAssembly (WASM) инструменты',
      spec2Desc: 'Приватные веб-утилиты без загрузки файлов на сервер.',
      spec3Title: 'UI/UX-дизайн и высококонверсионные лендинги',
      spec3Desc: 'Минималистичные, доступные интерфейсы с высокой конверсией.',
      ctaTitle: 'Давайте создадим что-нибудь потрясающее вместе.',
      emailBtn: 'Написать напрямую: kisharadilshan007@gmail.com',
      copyBtn: 'Скопировать email',
      copiedBtn: 'Скопировано!',
      backToTool: 'Назад в AddAudio',
    },
    footer: {
      privacyNote:
        '100% локальная обработка на WebAssembly. Ваши файлы не покидают устройство.',
    },
  },
};
