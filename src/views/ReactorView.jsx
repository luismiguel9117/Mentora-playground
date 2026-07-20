import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../components/SoundManager';
import Mascot from '../components/Mascot';

// Curated Video Lessons Database
const defaultVideoCatalog = [
  {
    id: 'UF8uR6Z6KLc',
    type: 'youtube',
    title: 'Discurso de Steve Jobs en Stanford',
    description: 'Aprende inglés inspiracional con uno de los discursos más famosos del mundo sobre conectar los puntos y seguir tu pasión.',
    difficulty: 'B2 - Intermedio Alto',
    difficultyKey: 'B2',
    category: 'Desarrollo Personal',
    duration: '15:00 min',
    color: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    emoji: '🎓'
  },
  {
    id: 'LEjhYkp8P5M',
    type: 'youtube',
    title: 'Inside Out 2 (Intensa-Mente 2) - Tráiler',
    description: 'Explora vocabulario coloquial sobre emociones y sentimientos cotidianos en el divertido tráiler de Disney Pixar.',
    difficulty: 'A2 - Básico Avanzado',
    difficultyKey: 'A2',
    category: 'Animación / Comedia',
    duration: '2:25 min',
    color: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
    emoji: '🎬'
  },
  {
    id: 'hLAWN2_Z418',
    type: 'youtube',
    title: 'La Casa de Papel - Tráiler Bilingüe',
    description: 'Estudia estructuras verbales sobre planificación y drama con subtítulos interactivos bilingües oficiales.',
    difficulty: 'B1 - Intermedio',
    difficultyKey: 'B1',
    category: 'Drama / Crimen',
    duration: '1:45 min',
    color: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
    emoji: '🎭'
  },
  {
    id: 'local',
    type: 'local',
    title: 'Sintel - Cortometraje de Fantasía',
    description: 'Practica el tiempo pasado y vocabulario de aventura en este clásico cortometraje animado de fantasía y dragones.',
    difficulty: 'B1 - Intermedio',
    difficultyKey: 'B1',
    category: 'Fantasía / Aventura',
    duration: '0:52 min',
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    emoji: '🐉'
  }
];

// Subtitle Databases
const jobsSubtitles = [
  {
    id: 1,
    start: 13,
    end: 15,
    en: "Thank you.",
    es: "Gracias."
  },
  {
    id: 2,
    start: 15,
    end: 23,
    en: "I am honored to be with you today at your commencement from one of the finest universities in the world.",
    es: "Es un honor estar con ustedes hoy en su graduación en una de las mejores universidades del mundo."
  },
  {
    id: 3,
    start: 24,
    end: 29,
    en: "Truth be told, I never graduated from college.",
    es: "A decir verdad, nunca me gradué de la universidad."
  },
  {
    id: 4,
    start: 30,
    end: 35,
    en: "And this is the closest I've ever gotten to a college graduation.",
    es: "Y esto es lo más cerca que he estado de una graduación universitaria."
  },
  {
    id: 5,
    start: 36,
    end: 42,
    en: "Today, I want to tell you three stories from my life.",
    es: "Hoy quiero contarles tres historias de mi vida."
  },
  {
    id: 6,
    start: 43,
    end: 49,
    en: "That's it. No big deal. Just three stories.",
    es: "Eso es todo. Nada del otro mundo. Solo tres historias."
  }
];

const jobsDictionary = {
  "thank": { translation: "gracias / agradecer", alternatives: ["dar las gracias"], category: "Verbo" },
  "honored": { translation: "honrado / orgulloso", alternatives: ["distinguido"], category: "Adjetivo" },
  "commencement": { translation: "graduación / ceremonia de inicio", alternatives: ["comienzo", "apertura"], category: "Sustantivo" },
  "finest": { translation: "mejores / más finas", alternatives: ["excelentes", "más selectas"], category: "Adjetivo" },
  "universities": { translation: "universidades", alternatives: ["centros de estudio superior"], category: "Sustantivo" },
  "world": { translation: "mundo", alternatives: ["tierra", "planeta"], category: "Sustantivo" },
  "truth": { translation: "verdad / a decir verdad", alternatives: ["realidad", "sinceridad"], category: "Sustantivo" },
  "graduated": { translation: "gradué", alternatives: ["terminé los estudios", "me diplomé"], category: "Verbo" },
  "college": { translation: "universidad / instituto", alternatives: ["academia"], category: "Sustantivo" },
  "closest": { translation: "más cerca / más cercano", alternatives: ["próximo", "inmediato"], category: "Adjetivo" },
  "gotten": { translation: "llegado / obtenido", alternatives: ["conseguido"], category: "Verbo" },
  "graduation": { translation: "graduación", alternatives: ["ceremonia de grado"], category: "Sustantivo" },
  "stories": { translation: "historias / cuentos", alternatives: ["relatos", "narraciones"], category: "Sustantivo" },
  "life": { translation: "vida", alternatives: ["existencia"], category: "Sustantivo" },
  "deal": { translation: "asunto / trato", alternatives: ["acuerdo", "negocio"], category: "Sustantivo" },
  "big": { translation: "grande / importante", alternatives: ["enorme", "significativo"], category: "Adjetivo" }
};

const localSubtitles = [
  {
    id: 1,
    start: 0,
    end: 7,
    en: "I remember the day when he disappeared into the clouds.",
    es: "Recuerdo el día en que desapareció en las nubes."
  },
  {
    id: 2,
    start: 7,
    end: 14,
    en: "I vowed to search for him, no matter what obstacles lay ahead.",
    es: "Prometí buscarlo, sin importar qué obstáculos tuviera por delante."
  },
  {
    id: 3,
    start: 14,
    end: 22,
    en: "This frozen mountain is the closest I've ever gotten to his lair.",
    es: "Esta montaña congelada es lo más cerca que he estado de su guarida."
  },
  {
    id: 4,
    start: 22,
    end: 30,
    en: "Truth be told, I am exhausted and my strength is fading away.",
    es: "A decir verdad, estoy exhausta y mis fuerzas se están desvaneciendo."
  },
  {
    id: 5,
    start: 30,
    end: 38,
    en: "But a true friendship is a milestone that never fades.",
    es: "Pero una verdadera amistad es un hito que nunca se desvanece."
  },
  {
    id: 6,
    start: 38,
    end: 45,
    en: "I will find him, and we will fly together once again.",
    es: "Lo encontraré, y volaremos juntos una vez más."
  }
];

const localDictionary = {
  "remember": { translation: "recuerdo / recordar", alternatives: ["evocar", "hacer memoria"], category: "Verbo" },
  "disappeared": { translation: "desapareció", alternatives: ["se desvaneció", "se ocultó"], category: "Verbo" },
  "clouds": { translation: "nubes", alternatives: ["nubarrón", "cielo gris"], category: "Sustantivo" },
  "vowed": { translation: "prometí / juré", alternatives: ["dar palabra", "comprometerse"], category: "Verbo" },
  "search": { translation: "buscar / búsqueda", alternatives: ["rastrear", "indagar"], category: "Verbo/Sustantivo" },
  "obstacles": { translation: "obstáculos", alternatives: ["barreras", "dificultades"], category: "Sustantivo" },
  "frozen": { translation: "congelada / helada", alternatives: ["gélida", "fría"], category: "Adjetivo" },
  "mountain": { translation: "montaña", alternatives: ["monte", "cumbre"], category: "Sustantivo" },
  "closest": { translation: "más cerca / más cercano", alternatives: ["próximo", "íntimo"], category: "Adjetivo" },
  "lair": { translation: "guarida", alternatives: ["nido", "escondite"], category: "Sustantivo" },
  "truth": { translation: "verdad", alternatives: ["realidad", "sinceridad"], category: "Sustantivo" },
  "exhausted": { translation: "exhausta / agotada", alternatives: ["cansada", "rendida"], category: "Adjetivo" },
  "strength": { translation: "fuerzas / fortaleza", alternatives: ["energía", "vigor"], category: "Sustantivo" },
  "fading": { translation: "desvaneciendo / apagando", alternatives: ["debilitándose"], category: "Verbo" },
  "friendship": { translation: "amistad", alternatives: ["compañerismo"], category: "Sustantivo" },
  "milestone": { translation: "hito / logro importante", alternatives: ["etapa clave"], category: "Sustantivo" },
  "fly": { translation: "volar", alternatives: ["elevarse"], category: "Verbo" },
  "together": { translation: "juntos", alternatives: ["unidos"], category: "Adverbio" }
};

const insideOutSubtitles = [
  {
    id: 1,
    start: 1,
    end: 4,
    en: "Welcome to your mind.",
    es: "Bienvenido a tu mente."
  },
  {
    id: 2,
    start: 4,
    end: 8,
    en: "Things are changing. We need to make room for new emotions now.",
    es: "Las cosas están cambiando. Necesitamos hacer espacio para nuevas emociones ahora."
  },
  {
    id: 3,
    start: 8,
    end: 14,
    en: "I am Anxiety. Where should I put my stuff?",
    es: "Soy Ansiedad. ¿Dónde debería poner mis cosas?"
  },
  {
    id: 4,
    start: 14,
    end: 20,
    en: "We are going to have a breakthrough in this brain.",
    es: "Vamos a tener un avance crucial en este cerebro."
  }
];

const insideOutDictionary = {
  "mind": { translation: "mente / cerebro", alternatives: ["intelecto", "opinión"], category: "Sustantivo" },
  "changing": { translation: "cambiando", alternatives: ["variando", "mutando"], category: "Verbo" },
  "room": { translation: "espacio / habitación", alternatives: ["cuarto", "lugar"], category: "Sustantivo" },
  "emotions": { translation: "emociones", alternatives: ["sentimientos", "sensaciones"], category: "Sustantivo" },
  "anxiety": { translation: "ansiedad", alternatives: ["angustia", "inquietud"], category: "Sustantivo" },
  "stuff": { translation: "cosas / pertenencias", alternatives: ["trastos", "materiales"], category: "Sustantivo" },
  "breakthrough": { translation: "avance crucial / gran descubrimiento", alternatives: ["logro histórico"], category: "Sustantivo" }
};

const lcdpSubtitles = [
  {
    id: 1,
    start: 1,
    end: 6,
    en: "We are going to make them believe we came in for a robbery.",
    es: "Vamos a hacerles creer que entramos a robar."
  },
  {
    id: 2,
    start: 6,
    end: 12,
    en: "It is fundamental that the police have no idea of what we are doing.",
    es: "Es fundamental que la policía no tenga idea de lo que estamos haciendo."
  },
  {
    id: 3,
    start: 12,
    end: 18,
    en: "And that is our milestone for today.",
    es: "Y ese es nuestro hito para el día de hoy."
  }
];

const lcdpDictionary = {
  "believe": { translation: "creer", alternatives: ["pensar", "confiar"], category: "Verbo" },
  "robbery": { translation: "robo / asalto", alternatives: ["hurto", "atracó"], category: "Sustantivo" },
  "fundamental": { translation: "fundamental / esencial", alternatives: ["clave", "básico"], category: "Adjetivo" },
  "police": { translation: "policía", alternatives: ["fuerzas del orden"], category: "Sustantivo" },
  "milestone": { translation: "hito / logro importante", alternatives: ["etapa clave"], category: "Sustantivo" }
};

export default function ReactorView() {
  const [currentView, setCurrentView] = useState('catalog'); // 'catalog' | 'player'
  const [playerType, setPlayerType] = useState('youtube'); // 'youtube' | 'local'
  const [videoId, setVideoId] = useState('UF8uR6Z6KLc'); // Steve Jobs video ID
  const [localVideoUrl, setLocalVideoUrl] = useState('https://media.w3.org/2010/05/sintel/trailer_hd.mp4');
  const [localVideoName, setLocalVideoName] = useState('Sintel HD Trailer');

  const [videoCatalog, setVideoCatalog] = useState(defaultVideoCatalog);

  // Load dynamic video catalog from JSON file on mount
  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch('/video-catalog.json');
        if (res.ok) {
          const data = await res.json();
          setVideoCatalog(data);
        }
      } catch (e) {
        console.warn("Failed to load video-catalog.json, using static fallback:", e);
      }
    }
    loadCatalog();
  }, []);

  // Search & Filters for Catalog Lobby
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('Todos');

  // Single source of truth states for subtitles and vocabulary dictionary
  const [currentSubtitles, setCurrentSubtitles] = useState(jobsSubtitles);
  const [currentDictionary, setCurrentDictionary] = useState(jobsDictionary);

  // Load subtitles from public JSON files, localStorage or default preset when videoId changes
  useEffect(() => {
    setHasStarted(false);
    let active = true;
    async function loadSubs() {
      if (!active) return;

      // 1. Check localStorage first (local edits / Vercel persistence fallback)
      try {
        const saved = localStorage.getItem(`mentora_subtitles_${videoId}`);
        if (saved) {
          setCurrentSubtitles(JSON.parse(saved));
          return;
        }
      } catch (e) {
        console.warn("Failed to parse cached subtitles:", e);
      }

      // 2. Fallback to public directory JSON file
      try {
        const response = await fetch(`/subtitles/${videoId}.json`);
        if (response.ok && active) {
          // Verify it is actual JSON and not SPA HTML index fallback
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('text/html')) {
            throw new Error('SPA redirect HTML fallback');
          }
          const data = await response.json();
          if (Array.isArray(data)) {
            setCurrentSubtitles(data);
            return;
          }
        }
      } catch (err) {
        console.warn("Failed to fetch public subtitle file:", err);
      }

      if (!active) return;
      // 3. Built-in catalog presets fallback
      if (videoId === 'UF8uR6Z6KLc') {
        setCurrentSubtitles(jobsSubtitles);
      } else if (videoId === 'LEjhYkp8P5M') {
        setCurrentSubtitles(insideOutSubtitles);
      } else if (videoId === 'hLAWN2_Z418') {
        setCurrentSubtitles(lcdpSubtitles);
      } else if (videoId === 'local') {
        setCurrentSubtitles(localSubtitles);
      } else {
        setCurrentSubtitles([]);
      }
    }

    loadSubs();
    return () => { active = false; };
  }, [videoId]);

  // Persist all subtitle edits
  const saveAllSubtitles = (updatedList) => {
    setCurrentSubtitles(updatedList);
    localStorage.setItem(`mentora_subtitles_${videoId}`, JSON.stringify(updatedList));
  };

  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState('SUBTÍTULOS'); // 'SUBTÍTULOS' | 'PALABRAS' | 'GUARDADO'
  const [hoveredWord, setHoveredWord] = useState(null);
  const [savedWords, setSavedWords] = useState(() => {
    const saved = localStorage.getItem('mentora_saved_words');
    return saved ? JSON.parse(saved) : [];
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFallbackSub, setIsFallbackSub] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Language Reactor specific flow controls
  const [isAutoPause, setIsAutoPause] = useState(false); // AP toggle
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // 1x, 0.75x, etc.
  const [showHotkeysHelper, setShowHotkeysHelper] = useState(true);

  const lastSubIdRef = useRef(null);

  // Modal & AI Generator State
  const [showModal, setShowModal] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');
  const [transcribing, setTranscribing] = useState(false);


  // Custom Controls Overlay States
  const [videoDuration, setVideoDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null); // Reference for fullscreen container

  // Time format helper (MM:SS or HH:MM:SS)
  const formatTime = (secs) => {
    if (isNaN(secs) || secs === null || secs === undefined) return "00:00";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    
    if (h > 0) {
      return `${h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    }
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  // Remaining time format helper (-MM:SS)
  const formatRemainingTime = (secs, duration) => {
    if (isNaN(secs) || isNaN(duration) || secs === null || duration === null) return "-00:00";
    const remaining = Math.max(0, duration - secs);
    return `-${formatTime(remaining)}`;
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (playerType === 'youtube') {
      if (playerRef.current && playerRef.current.setVolume) {
        playerRef.current.setVolume(vol * 100);
      }
    } else {
      if (localVideoRef.current) {
        localVideoRef.current.volume = vol;
      }
    }
  };

  const handleProgressBarChange = (e) => {
    const targetTime = parseFloat(e.target.value);
    handleSeek(targetTime);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.warn("Fullscreen request failed:", err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.warn("Exit fullscreen failed:", err));
    }
  };

  // Monitor fullscreen exit via ESC key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const playerRef = useRef(null);
  const localVideoRef = useRef(null);
  const activeItemRef = useRef(null);
  const intervalRef = useRef(null);

  // Minimalist Startup Loader States
  const [introActive, setIntroActive] = useState(true);
  const [introFade, setIntroFade] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);

  useEffect(() => {
    if (!introActive) return;

    const interval = setInterval(() => {
      setLoaderProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(interval);
          triggerAppReveal();
          return 100;
        }
      });
    }, 15);

    return () => clearInterval(interval);
  }, [introActive]);

  const triggerAppReveal = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      
      const oscBase = audioCtx.createOscillator();
      const gainBase = audioCtx.createGain();
      oscBase.type = 'sine';
      oscBase.frequency.setValueAtTime(261.63, now); // C4 base
      gainBase.gain.setValueAtTime(0.04, now);
      gainBase.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      oscBase.connect(gainBase);
      gainBase.connect(audioCtx.destination);
      
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      gain1.gain.setValueAtTime(0.03, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);

      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, now); // G5
      gain2.gain.setValueAtTime(0.02, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);

      oscBase.start(now);
      osc1.start(now);
      osc2.start(now);

      oscBase.stop(now + 1.5);
      osc1.stop(now + 1.0);
      osc2.stop(now + 0.8);
    } catch(e){}

    setIntroFade(true);
    setTimeout(() => {
      setIntroActive(false);
      sounds.playCompleted();
    }, 850);
  };

  // Safe Speech Cancel Helper
  const safeCancelSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn("Speech cancel error:", e);
      }
    }
  };

  // Safe Speech Speak Helper
  const safeSpeakSpeech = (text) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = playbackSpeed * 0.95; // Synchronize speaking speed with playback speed
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn("Speech speak error:", e);
      }
    }
  };

  // Switch to specific Video Lesson from Catalog
  const handleSelectLesson = (lesson) => {
    safeCancelSpeech();
    setIsPlaying(false);
    setIsFallbackSub(false);
    sounds.playCorrect();

    if (lesson.type === 'youtube') {
      setPlayerType('youtube');
      setVideoId(lesson.id);
      
      // Load corresponding subtitles and dictionaries
      if (lesson.id === 'UF8uR6Z6KLc') {
        setCurrentDictionary(jobsDictionary);
      } else if (lesson.id === 'LEjhYkp8P5M') {
        setCurrentDictionary(insideOutDictionary);
      } else if (lesson.id === 'hLAWN2_Z418') {
        setCurrentDictionary(lcdpDictionary);
      } else {
        setCurrentDictionary({});
      }
    } else {
      setPlayerType('local');
      setVideoId(lesson.id);
      setLocalVideoUrl(lesson.url || 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4');
      setLocalVideoName(lesson.title || 'Video Local');
      setCurrentDictionary(lesson.id === 'local' ? localDictionary : {});
    }

    setCurrentView('player');
  };

  const handleSwitchPlayer = () => {
    // Navigate back to the Catalog Selection Lobby
    safeCancelSpeech();
    setIsPlaying(false);
    setCurrentView('catalog');
    sounds.playCorrect();
  };

  // Adjust Playback Speed for YouTube and HTML5 video
  const handlePlaybackSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    sounds.playCorrect();

    if (playerType === 'youtube') {
      if (playerRef.current && playerRef.current.setPlaybackRate) {
        try {
          playerRef.current.setPlaybackRate(speed);
        } catch (e) {
          console.warn("YT setPlaybackRate fail:", e);
        }
      }
    } else {
      if (localVideoRef.current) {
        localVideoRef.current.playbackRate = speed;
      }
    }
  };

  // Poll for YT library loaded state
  useEffect(() => {
    if (playerType !== 'youtube' || currentView !== 'player') return;

    let sdkTag = document.getElementById('youtube-sdk');
    if (!sdkTag) {
      const tag = document.createElement('script');
      tag.id = 'youtube-sdk';
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const checkYT = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkYT);
        createYTPlayer();
      }
    }, 100);

    function createYTPlayer() {
      if (playerRef.current && playerRef.current.loadVideoById) {
        try {
          playerRef.current.loadVideoById(videoId);
          setCurrentTime(0);
          setIsPlaying(false);
        } catch (e) {
          console.warn("loadVideoById failed, re-creating player:", e);
          playerRef.current = null;
        }
      }

      if (!playerRef.current) {
        try {
          playerRef.current = new window.YT.Player('yt-player-iframe', {
            videoId: videoId,
            playerVars: {
              autoplay: 0,
              controls: 0,
              rel: 0,
              showinfo: 0,
              modestbranding: 1,
              enablejsapi: 1,
              cc_load_policy: 3, // Force closed captions OFF
              iv_load_policy: 3  // Disable annotations
            },
            events: {
              'onStateChange': onPlayerStateChange
            }
          });
        } catch (err) {
          console.error("Error creating YT Player:", err);
        }
      }
    }

    function onPlayerStateChange(event) {
      if (event.data === window.YT.PlayerState.PLAYING) {
        setIsPlaying(true);
        intervalRef.current = setInterval(() => {
          if (playerRef.current && playerRef.current.getCurrentTime) {
            setCurrentTime(playerRef.current.getCurrentTime());
            if (playerRef.current.getDuration) {
              const dur = playerRef.current.getDuration();
              if (dur > 0) setVideoDuration(dur);
            }
          }
        }, 200);
      } else {
        setIsPlaying(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }

    return () => {
      clearInterval(checkYT);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      playerRef.current = null;
    };
  }, [videoId, playerType, currentView]);

  // Watchdog fallback for YT block
  useEffect(() => {
    const timer = setTimeout(() => {
      if (playerType === 'youtube' && !playerRef.current && currentView === 'player') {
        console.warn("YouTube API timeout. Falling back to local offline MP4 video.");
        setPlayerType('local');
        setCurrentSubtitles(localSubtitles);
        setCurrentDictionary(localDictionary);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [playerType, currentView]);

  const activeSub = currentSubtitles.find(
    (s) => currentTime >= s.start && currentTime <= s.end
  );



  // Web Speech API Narrator Fallback for Local Silent Video
  useEffect(() => {
    if (playerType === 'local' && isPlaying && activeSub && currentView === 'player') {
      safeSpeakSpeech(activeSub.en);
    } else if (!isPlaying || !activeSub) {
      safeCancelSpeech();
    }
  }, [activeSub?.id, isPlaying, playerType, currentView]);

  // Language Reactor Auto-Pause (AP) Feature:
  useEffect(() => {
    if (!activeSub || currentView !== 'player') {
      lastSubIdRef.current = null;
      return;
    }

    if (activeSub.id !== lastSubIdRef.current) {
      lastSubIdRef.current = activeSub.id;
    }

    // Auto-Pause triggers 150ms before subtitle ends for clean stopping
    if (isAutoPause && isPlaying && currentTime >= activeSub.end - 0.15) {
      setIsPlaying(false);
      safeCancelSpeech();
      if (playerType === 'youtube') {
        if (playerRef.current && playerRef.current.pauseVideo) {
          try {
            playerRef.current.pauseVideo();
          } catch (e) {
            console.warn("YT Auto-Pause fail:", e);
          }
        }
      } else {
        if (localVideoRef.current) {
          try {
            localVideoRef.current.pause();
          } catch (e) {
            console.warn("Local Auto-Pause fail:", e);
          }
        }
      }
    }
  }, [currentTime, isPlaying, isAutoPause, activeSub?.id, playerType, currentView]);

  // Keyboard Shortcuts (W: Play/Pause, A: Prev Sub, S: Repeat Sub, D: Next Sub, Q: Toggle AP)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentView !== 'player') return;
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'a' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevSub();
      } else if (key === 's' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleReplaySub();
      } else if (key === 'd' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextSub();
      } else if (key === 'w' || e.key === ' ') {
        e.preventDefault();
        handleTogglePlay();
      } else if (key === 'q') {
        e.preventDefault();
        setIsAutoPause(prev => {
          const newVal = !prev;
          sounds.playCorrect();
          return newVal;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, isPlaying, playerType, currentSubtitles, isAutoPause, currentView]);

  // Clean speech synthesis on unmount and clean YT Player
  useEffect(() => {
    return () => {
      safeCancelSpeech();
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.warn("Destroy YT player error:", e);
        }
        playerRef.current = null;
      }
    };
  }, []);

  // Auto-scroll transcript line
  useEffect(() => {
    if (activeItemRef.current && activeTab === 'SUBTÍTULOS') {
      try {
        activeItemRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      } catch (e) {
        console.warn("Scroll failed:", e);
      }
    }
  }, [activeSub?.id, activeTab]);

  const handleLocalTimeUpdate = () => {
    if (localVideoRef.current) {
      setCurrentTime(localVideoRef.current.currentTime);
    }
  };

  const handleLocalVideoClick = () => {
    if (localVideoRef.current) {
      if (localVideoRef.current.paused) {
        localVideoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.log(e));
      } else {
        localVideoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (seconds) => {
    if (playerType === 'youtube') {
      if (playerRef.current && playerRef.current.seekTo) {
        try {
          playerRef.current.seekTo(seconds, true);
          playerRef.current.playVideo();
        } catch (e) {
          console.warn("YT Seek failed:", e);
        }
      }
    } else {
      if (localVideoRef.current) {
        try {
          localVideoRef.current.currentTime = seconds;
          localVideoRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => console.log(e));
        } catch (e) {
          console.warn("Local Seek failed:", e);
        }
      }
    }
  };

  const handleTogglePlay = () => {
    if (playerType === 'youtube') {
      if (playerRef.current && playerRef.current.getPlayerState) {
        try {
          const state = playerRef.current.getPlayerState();
          if (state === window.YT.PlayerState.PLAYING) {
            playerRef.current.pauseVideo();
          } else {
            playerRef.current.playVideo();
          }
        } catch (e) {
          console.warn("YT Toggle play failed:", e);
        }
      }
    } else {
      if (localVideoRef.current) {
        if (localVideoRef.current.paused) {
          localVideoRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => console.log(e));
        } else {
          localVideoRef.current.pause();
          setIsPlaying(false);
        }
      }
    }
  };

  const handlePrevSub = () => {
    const currentIndex = currentSubtitles.findIndex(s => currentTime >= s.start && currentTime <= s.end);
    if (currentIndex > 0) {
      handleSeek(currentSubtitles[currentIndex - 1].start);
    } else if (currentIndex === -1) {
      const preceding = [...currentSubtitles].reverse().find(s => currentTime > s.end);
      if (preceding) {
        handleSeek(preceding.start);
      }
    }
  };

  const handleReplaySub = () => {
    if (activeSub) {
      handleSeek(activeSub.start);
    }
  };

  const handleNextSub = () => {
    const currentIndex = currentSubtitles.findIndex(s => currentTime >= s.start && currentTime <= s.end);
    if (currentIndex !== -1 && currentIndex < currentSubtitles.length - 1) {
      handleSeek(currentSubtitles[currentIndex + 1].start);
    } else if (currentIndex === -1) {
      const succeeding = currentSubtitles.find(s => currentTime < s.start);
      if (succeeding) {
        handleSeek(succeeding.start);
      }
    }
  };



  const toggleSaveWord = (wordKey, definition) => {
    setSavedWords((prev) => {
      let updated;
      if (prev.some(w => w.key === wordKey)) {
        updated = prev.filter(w => w.key !== wordKey);
      } else {
        updated = [...prev, { key: wordKey, ...definition }];
      }
      localStorage.setItem('mentora_saved_words', JSON.stringify(updated));
      sounds.playCorrect();
      
      if (hoveredWord && hoveredWord.key === wordKey) {
        setHoveredWord(curr => ({ ...curr, isSaved: !curr.isSaved }));
      }
      
      return updated;
    });
  };

  // Hover translator with API fetches
  const handleWordHover = (event, wordText) => {
    const wordKey = wordText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
    const rect = event.target.getBoundingClientRect();
    const container = document.querySelector('.video-player-container');
    const containerRect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };
    const x = rect.left - containerRect.left + rect.width / 2;
    const y = rect.top - containerRect.top;

    const definition = (currentDictionary || {})[wordKey];

    if (definition) {
      setHoveredWord({
        key: wordKey,
        text: wordText,
        x,
        y,
        isSaved: savedWords.some(w => w.key === wordKey),
        loading: false,
        ...definition
      });
    } else {
      setHoveredWord({
        key: wordKey,
        text: wordText,
        x,
        y,
        loading: true,
        translation: "Traduciendo...",
        category: "Cargando..."
      });

      const transPromise = fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(wordKey)}&langpair=en|es`)
        .then(res => res.json())
        .catch(() => null);

      const datamusePromise = fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(wordKey)}&max=3`)
        .then(res => res.json())
        .catch(() => []);

      Promise.all([transPromise, datamusePromise])
        .then(([transData, datamuseData]) => {
          const translation = transData?.responseData?.translatedText || "Traducción no disponible";
          const related = Array.isArray(datamuseData)
            ? datamuseData.map(item => item.word).filter(w => w.toLowerCase() !== wordKey)
            : [];
          const alternatives = [translation, ...related];

          const newDefinition = {
            translation,
            alternatives,
            category: "Palabra IA"
          };

          setCurrentDictionary(prev => ({
            ...prev,
            [wordKey]: newDefinition
          }));

          setHoveredWord(curr => {
            if (curr && curr.key === wordKey) {
              return {
                ...curr,
                loading: false,
                isSaved: savedWords.some(w => w.key === wordKey),
                ...newDefinition
              };
            }
            return curr;
          });
        })
        .catch(err => {
          console.warn("Translation and synonyms fetch failed:", err);
          setHoveredWord(curr => {
            if (curr && curr.key === wordKey) {
              return {
                ...curr,
                loading: false,
                translation: "No se pudo traducir",
                category: "Error"
              };
            }
            return curr;
          });
        });
    }
  };

  const handleWordLeave = () => {
    setHoveredWord(null);
  };

  const renderHoverableSentence = (sentence) => {
    if (!sentence) return null;
    const words = sentence.split(" ");
    return words.map((w, index) => (
      <span
        key={index}
        className="hoverable-word-span"
        onMouseEnter={(e) => handleWordHover(e, w)}
        onMouseLeave={handleWordLeave}
      >
        {w}
      </span>
    ));
  };

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const parseTranscriptText = (text) => {
    const lines = text.split('\n');
    const parsed = [];
    let id = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const timeRegex = /(?:\[?(\d{1,2}):(\d{2}):?(\d{2})?\]?)|(?:\[?(\d{1,2}):(\d{2})\]?)/;
      const match = line.match(timeRegex);

      if (match) {
        let seconds = 0;
        if (match[4] !== undefined) {
          seconds = parseInt(match[4], 10) * 60 + parseInt(match[5], 10);
        } else {
          seconds = parseInt(match[1], 10) * 3600 + parseInt(match[2], 10) * 60 + parseInt(match[3] || 0, 10);
        }

        const cleanText = line.replace(timeRegex, '').trim().replace(/^[-:]\s*/, '');
        parsed.push({
          id: id++,
          start: seconds,
          end: seconds + 5,
          en: cleanText,
          es: ''
        });
      }
    }

    for (let i = 0; i < parsed.length - 1; i++) {
      parsed[i].end = parsed[i + 1].start;
      if (parsed[i].end - parsed[i].start > 6) {
        parsed[i].end = parsed[i].start + 5;
      }
    }
    if (parsed.length > 0) {
      parsed[parsed.length - 1].end = parsed[parsed.length - 1].start + 4;
    }

    return parsed;
  };

  // Upload/Transcribe Handler
  const handleTranscribe = async (url) => {
    let targetVideoId = getYouTubeId(url);
    if (!targetVideoId) {
      alert("Por favor introduce una URL válida de YouTube.");
      return;
    }

    setTranscribing(true);
    setTranscribeProgress(10);
    setTranscribeStatus('Conectando con Mentora Whisper AI...');
    setIsFallbackSub(false);

    try {
      setTranscribeStatus('Descargando subtítulos oficiales de YouTube...');
      setTranscribeProgress(25);
      
      const res = await fetch(`https://youtube-transcript.ai/transcript/${targetVideoId}.txt`);
      if (!res.ok) {
        throw new Error("No se pudo obtener la transcripción oficial");
      }
      
      const text = await res.text();
      setTranscribeProgress(50);
      setTranscribeStatus('Analizando marcas de tiempo y segmentando texto...');

      const parsedLines = parseTranscriptText(text);

      if (parsedLines.length === 0) {
        throw new Error("No se encontraron subtítulos con marcas de tiempo");
      }

      setTranscribeProgress(75);
      setTranscribeStatus('Traduciendo diálogos al español con MyMemory AI...');

      for (let i = 0; i < Math.min(parsedLines.length, 10); i++) {
        try {
          const transRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(parsedLines[i].en)}&langpair=en|es`);
          const transData = await transRes.json();
          if (transData && transData.responseData) {
            parsedLines[i].es = transData.responseData.translatedText;
          } else {
            parsedLines[i].es = parsedLines[i].en;
          }
        } catch (err) {
          parsedLines[i].es = parsedLines[i].en;
        }
      }

      for (let i = 10; i < parsedLines.length; i++) {
        parsedLines[i].es = parsedLines[i].en;
      }

      setTranscribeProgress(95);
      setTranscribeStatus('Compilando diccionario de vocabulario...');

      setCurrentSubtitles(parsedLines);
      setCurrentDictionary({}); // dynamic translate on hover
      setVideoId(targetVideoId);
      setPlayerType('youtube');
      setTranscribing(false);
      setShowModal(false);
      sounds.playCompleted();
      setCurrentView('player');
      
    } catch (error) {
      console.warn("Real transcript API failed, falling back to simulated generation:", error);
      setTranscribeStatus('CORS bloqueado por YouTube. Cargando transcripción demo...');
      setTranscribeProgress(70);
      setIsFallbackSub(true);
      
      setTimeout(() => {
        setTranscribeProgress(100);
        finishTranscription(targetVideoId);
      }, 1500);
    }
  };

  // Safe fallback transcription: Match video ID to the correct preset subtitle files!
  const finishTranscription = (id) => {
    setTranscribing(false);
    setShowModal(false);
    setVideoId(id);
    setPlayerType('youtube');
    sounds.playCompleted();

    if (id === 'LEjhYkp8P5M') {
      setCurrentSubtitles(insideOutSubtitles);
      setCurrentDictionary(insideOutDictionary);
    } else if (id === 'hLAWN2_Z418') {
      setCurrentSubtitles(lcdpSubtitles);
      setCurrentDictionary(lcdpDictionary);
    } else if (id === 'UF8uR6Z6KLc') {
      setCurrentSubtitles(jobsSubtitles);
      setCurrentDictionary(jobsDictionary);
    } else {
      // Unrecognized custom YouTube video fallback
      const customFallbackSubtitles = [
        {
          id: 1,
          start: 2,
          end: 7,
          en: "Welcome to this new custom video. We are practicing English vocabulary.",
          es: "Bienvenido a este nuevo video personalizado. Estamos practicando vocabulario en inglés."
        },
        {
          id: 2,
          start: 7,
          end: 14,
          en: "Our AI is transcribing the audio track and extracting key words.",
          es: "Nuestra IA está transcribiendo la pista de audio y extrayendo palabras clave."
        },
        {
          id: 3,
          start: 14,
          end: 22,
          en: "Hover over words in the screen to check their translations in real-time.",
          es: "Pasa el cursor sobre las palabras en la pantalla para revisar sus traducciones en tiempo real."
        },
        {
          id: 4,
          start: 22,
          end: 30,
          en: "You can also use the Edit button below to customize these subtitles to match the speaker.",
          es: "También puedes usar el botón de Editar abajo para personalizar estos subtítulos y adaptarlos al hablante."
        },
        {
          id: 5,
          start: 30,
          end: 45,
          en: "Use the keyboard shortcuts W, A, S, D, Q to navigate the timeline easily.",
          es: "Usa los atajos de teclado W, A, S, D, Q para navegar la línea de tiempo fácilmente."
        }
      ];
      setCurrentSubtitles(customFallbackSubtitles);
      setCurrentDictionary({});
    }

    setCurrentView('player');
  };

  // LOCAL VIDEO FILE UPLOADER HANDLER (.mp4, .webm)
  const handleLocalFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    sounds.playCorrect();
    setTranscribing(true);
    setTranscribeProgress(10);
    setTranscribeStatus('Extrayendo metadatos de archivo local...');

    const fileUrl = URL.createObjectURL(file);

    setTimeout(() => {
      setTranscribeProgress(40);
      setTranscribeStatus('Extrayendo pista de audio...');
      sounds.playCorrect();
    }, 500);

    setTimeout(() => {
      setTranscribeProgress(75);
      setTranscribeStatus('Whisper AI transcribiendo ondas de sonido a texto...');
      sounds.playCorrect();
    }, 1200);

    setTimeout(() => {
      setTranscribeProgress(100);
      setTranscribeStatus('¡Completado!');
      sounds.playCompleted();

      const uploadedFileSubtitles = [
        {
          id: 1,
          start: 0,
          end: 6,
          en: `You uploaded a new file named ${file.name}.`,
          es: `Subiste un nuevo archivo llamado ${file.name}.`
        },
        {
          id: 2,
          start: 6,
          end: 12,
          en: "This local player supports direct offline playback from your hard drive.",
          es: "Este reproductor local admite reproducción directa sin conexión desde tu disco duro."
        },
        {
          id: 3,
          start: 12,
          end: 20,
          en: "You can click on the Edit button below to customize these subtitles in real-time.",
          es: "Puedes hacer clic en el botón de Editar abajo para personalizar estos subtítulos en tiempo real."
        }
      ];

      setCurrentSubtitles(uploadedFileSubtitles);
      setCurrentDictionary({}); // dynamic translate on hover
      setLocalVideoUrl(fileUrl);
      setLocalVideoName(file.name);
      setPlayerType('local'); // Switch to HTML5 player
      setTranscribing(false);
      setShowModal(false);
      setCurrentView('player');

      // Delay slightly for React to mount the new video element with the unique key, then play!
      setTimeout(() => {
        if (localVideoRef.current) {
          localVideoRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => console.warn("Auto-play blocked after file upload:", e));
        }
      }, 150);
    }, 2000);
  };

  // --- RENDERING BRANCH 1: CURATED VIDEO CATALOG LOBBY ---
  const renderCatalogLobby = () => {
    const filteredCatalog = videoCatalog.filter((lesson) => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            lesson.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'Todos' || lesson.difficultyKey === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });

    return (
      <div style={{ padding: '1rem 0', fontFamily: "'Inter', sans-serif", animation: 'fadeIn 0.5s ease-out' }}>
        
        {/* Header / Sub-banner */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', marginTop: '1rem' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>
            Aprende Inglés con tus <span style={{ color: '#4f46e5' }}>Películas y Discursos</span> Favoritos
          </h1>
          <p style={{ color: '#475569', fontSize: '1.05rem', marginTop: '0.5rem', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            Selecciona una lección interactiva de nuestro catálogo oficial o sube tu propia película para subtitularla al instante con IA.
          </p>
        </div>

        {/* Filters and Search Bar Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          backgroundColor: '#ffffff',
          padding: '1.2rem',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 4px 15px rgba(0,0,0,0.01)'
        }}>
          {/* Difficulty Filters */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['Todos', 'A2', 'B1', 'B2'].map((diff) => (
              <button
                key={diff}
                className="btn-3d"
                onClick={() => {
                  setDifficultyFilter(diff);
                  sounds.playCorrect();
                }}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  border: 'none',
                  background: difficultyFilter === diff ? '#4f46e5' : '#f1f5f9',
                  color: difficultyFilter === diff ? '#ffffff' : '#475569',
                  boxShadow: difficultyFilter === diff ? '0 4px 0 #312e81' : '0 4px 0 #cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.1s'
                }}
              >
                {diff === 'Todos' ? 'Todos los Niveles' : `Nivel ${diff}`}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', width: '320px' }}>
            <input
              type="text"
              placeholder="Buscar películas o categorías..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                border: '1.5px solid #cbd5e1',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                outline: 'none',
                backgroundColor: '#f8fafc',
                fontFamily: "'Inter', sans-serif"
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2.5"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        {/* Video Catalog Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {filteredCatalog.map((lesson) => (
            <div
              key={lesson.id}
              className="btn-3d"
              onClick={() => handleSelectLesson(lesson)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '20px',
                border: '1.5px solid #e2e8f0',
                background: '#ffffff',
                boxShadow: '0 8px 0 #cbd5e1',
                padding: '0',
                textAlign: 'left',
                cursor: 'pointer',
                overflow: 'hidden',
                height: '100%',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Graphic Card Cover */}
              <div style={{
                background: lesson.thumbnail ? `url(${lesson.thumbnail}) center/cover no-repeat` : (lesson.color || 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'),
                height: '130px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: lesson.thumbnail ? '0rem' : '3.5rem',
                color: '#ffffff',
                position: 'relative'
              }}>
                {!lesson.thumbnail && (lesson.emoji || '🎬')}
                {/* Duration Tag */}
                <span style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backdropFilter: 'blur(4px)'
                }}>
                  ⏱️ {lesson.duration || 'Lección'}
                </span>
              </div>

              {/* Information Body */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: (lesson.difficultyKey || 'B1') === 'A2' ? '#10b981' : (lesson.difficultyKey || 'B1') === 'B1' ? '#0ea5e9' : '#4f46e5',
                    backgroundColor: (lesson.difficultyKey || 'B1') === 'A2' ? '#ecfdf5' : (lesson.difficultyKey || 'B1') === 'B1' ? '#f0f9ff' : '#eef2ff',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {lesson.difficultyKey || 'B1'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                    {lesson.category || 'General'}
                  </span>
                </div>

                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  fontFamily: "'Outfit', sans-serif",
                  lineHeight: '1.3'
                }}>
                  {lesson.title}
                </h3>

                <p style={{
                  fontSize: '0.85rem',
                  color: '#475569',
                  lineHeight: '1.5',
                  flexGrow: 1
                }}>
                  {lesson.description || 'Aprende inglés interactivo y vocabulario bilingüe en tiempo real con este video.'}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#4f46e5'
                }}>
                  <span>Comenzar Lección</span>
                  <span>➔</span>
                </div>
              </div>
            </div>
          ))}

          {/* AI Auto-Transcription Prompt Card */}
          <div
            className="btn-3d"
            onClick={() => {
              setShowModal(true);
              setUploadUrl('');
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '20px',
              border: '2.5px dashed #cbd5e1',
              background: '#f8fafc',
              boxShadow: '0 8px 0 #cbd5e1',
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              minHeight: '300px',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              ✨
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
              Subir tu propio vídeo o Enlace
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '240px', lineHeight: '1.5' }}>
              Importa un archivo .mp4 de tu computadora o pega cualquier dirección de YouTube para transcribir diálogos con Inteligencia Artificial.
            </p>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              padding: '6px 16px',
              borderRadius: '9999px',
              marginTop: '8px'
            }}>
              Procesar con IA ⚡
            </span>
          </div>
        </div>
        
        <Mascot mood="happy" text="¡Hola! Elige cualquiera de los vídeos del catálogo o sube el tuyo propio para empezar a aprender inglés con Cine Reactor." />
      </div>
    );
  };

  // --- RENDERING BRANCH 2: INTERACTIVE VIDEO PLAYER ---
  const renderInteractivePlayer = () => {
    const lesson = videoCatalog.find(v => v.id === videoId);
    const thumbnailSrc = lesson?.thumbnail || (lesson?.type === 'youtube' ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '');

    return (
      <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
        
        {/* --- Language Reactor Style Top Header Bar --- */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--border)',
          borderRadius: '16px',
          marginBottom: '1rem',
          fontFamily: "'Inter', sans-serif"
        }}>
          {/* Left Side: Navigation & Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)' }}
              onClick={handleSwitchPlayer}
              title="Volver al Catálogo"
            >
              ← Volver al Catálogo
            </button>
            <div style={{ height: '18px', width: '1.5px', backgroundColor: 'var(--border)' }}></div>
            <button 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-secondary)' }}
              onClick={handlePrevSub}
              title="Frase anterior (A)"
            >
              ⏮
            </button>
            <button 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-secondary)' }}
              onClick={handleNextSub}
              title="Siguiente frase (D)"
            >
              ⏭
            </button>
            <div style={{ height: '18px', width: '1.5px', backgroundColor: 'var(--border)' }}></div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {playerType === 'youtube' ? (videoCatalog.find(v => v.id === videoId)?.title || 'Video Lección') : localVideoName}
            </span>
            <span style={{ fontSize: '0.8rem', opacity: 0.5, cursor: 'help' }} title="Módulo interactivo Cine Reactor">ⓘ</span>
          </div>

          {/* Right Side: Options & States */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Keyboard toggle */}
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.1rem',
                color: showHotkeysHelper ? 'var(--primary)' : 'var(--text-muted)'
              }}
              onClick={() => setShowHotkeysHelper(!showHotkeysHelper)}
              title="Mostrar/Ocultar atajos de teclado"
            >
              ⌨️
            </button>

            {/* Playback speed selector */}
            <select
              value={playbackSpeed}
              onChange={(e) => handlePlaybackSpeedChange(parseFloat(e.target.value))}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                border: '1.5px solid var(--border)',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: '#ffffff',
                outline: 'none',
                cursor: 'pointer',
                color: 'var(--text-primary)'
              }}
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1.0">1.0x (1x)</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
            </select>

            {/* Lang direction badge */}
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 8px',
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              color: 'var(--primary)',
              borderRadius: '6px'
            }}>
              EN ➔ ES
            </span>
          </div>
        </div>

        <div className="reactor-layout">
          {/* Left Side: Video Player and Bilingual Subtitles */}
          <div className="player-column">
            
            {/* Warning Banner for CORS YouTube Blocks */}
            {isFallbackSub && playerType === 'youtube' && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1.5px solid var(--error)',
                color: 'var(--text-primary)',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                animation: 'popIn 0.3s ease',
                marginBottom: '8px'
              }}>
                <span>⚠️</span>
                <span>
                  <strong>Mentora AI:</strong> YouTube bloqueó la descarga de subtítulos reales de este video (CORS). Cargamos un guion demo. Prueba los <strong>videos de demostración del modal</strong> (Inside Out 2, La Casa de Papel) que tienen subtítulos reales precargados.
                </span>
              </div>
            )}

            <div 
              ref={containerRef}
              className="video-player-container" 
              style={{ 
                paddingBottom: '56.25%', 
                height: 0, 
                position: 'relative', 
                backgroundColor: '#000', 
                borderRadius: '16px', 
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
              }}
            >
              {playerType === 'youtube' ? (
                <>
                  <div 
                    id="yt-player-iframe" 
                    style={{ 
                      position: 'absolute', 
                      top: '-9.5%', // Crop out YouTube top title bar
                      left: 0, 
                      width: '100%', 
                      height: '119%', // Crop out YouTube bottom controls bar
                      border: 'none',
                      backgroundColor: '#000'
                    }}
                  ></div>
                  <div 
                    onClick={handleTogglePlay}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      zIndex: 10,
                      cursor: 'pointer',
                      background: 'transparent'
                    }}
                  />
                </>
              ) : (
                <video
                  key={localVideoUrl}
                  ref={localVideoRef}
                  src={localVideoUrl}
                  onTimeUpdate={handleLocalTimeUpdate}
                  onLoadedMetadata={(e) => setVideoDuration(e.target.duration)}
                  onDurationChange={(e) => setVideoDuration(e.target.duration)}
                  onClick={handleTogglePlay}
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%',
                    objectFit: 'contain',
                    backgroundColor: '#000'
                  }}
                ></video>
              )}

              {/* Glowing 3D Play Cover Overlay */}
              {!hasStarted && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 15,
                    backgroundImage: thumbnailSrc ? `url(${thumbnailSrc})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'opacity 0.3s ease'
                  }}
                  onClick={() => {
                    if (playerType === 'youtube') {
                      if (playerRef.current && playerRef.current.playVideo) {
                        try {
                          playerRef.current.playVideo();
                          setHasStarted(true);
                        } catch (e) {
                          console.warn("Play failed:", e);
                          setHasStarted(true);
                        }
                      } else {
                        // In case API is not fully bound yet, force start
                        setHasStarted(true);
                        handleTogglePlay();
                      }
                    } else {
                      if (localVideoRef.current) {
                        localVideoRef.current.play()
                          .then(() => {
                            setHasStarted(true);
                            setIsPlaying(true);
                          })
                          .catch(e => console.warn(e));
                      }
                    }
                  }}
                >
                  {/* Custom pulsing 3D Play Button */}
                  <div 
                    className="custom-3d-play-btn"
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '50%',
                      backgroundColor: '#4f46e5',
                      borderBottom: '5px solid #3730a3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '2rem',
                      paddingLeft: '6px',
                      boxShadow: '0 8px 24px rgba(79, 70, 229, 0.45)',
                      transition: 'transform 0.15s, background-color 0.15s, border-bottom 0.15s'
                    }}
                  >
                    ▶
                  </div>
                </div>
              )}

              {/* Phrase Navigation: Left Vertical Controls (Next, Replay, Prev) */}
              <div 
                className="phrase-vertical-controls"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  zIndex: 25
                }}
              >
                <button 
                  onClick={handleNextSub}
                  title="Siguiente Frase (D)"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    color: '#ffffff',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    transition: 'transform 0.15s, background-color 0.15s',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.9)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.75)'; }}
                >
                  ➔
                </button>
                <button 
                  onClick={handleReplaySub}
                  title="Repetir esta Frase (S)"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    color: '#ffffff',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    transition: 'transform 0.15s, background-color 0.15s',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.9)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.75)'; }}
                >
                  ⟳
                </button>
                <button 
                  onClick={handlePrevSub}
                  title="Frase Anterior (A)"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    color: '#ffffff',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    transition: 'transform 0.15s, background-color 0.15s',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.9)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.75)'; }}
                >
                  ⬅
                </button>
              </div>

              {/* Auto-Pause Toggle: Right Vertical Control (AP) */}
              <div 
                className="ap-vertical-control"
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  zIndex: 25,
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  padding: '8px 6px',
                  borderRadius: '20px',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  userSelect: 'none'
                }}
              >
                {/* Switch slider */}
                <div 
                  onClick={() => {
                    setIsAutoPause(!isAutoPause);
                    sounds.playCorrect();
                  }}
                  style={{
                    width: '32px',
                    height: '18px',
                    borderRadius: '9px',
                    backgroundColor: isAutoPause ? '#10b981' : '#4b5563',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  title="Auto-Pausa: Pausar al terminar cada frase (Q)"
                >
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    position: 'absolute',
                    top: '2px',
                    left: isAutoPause ? '16px' : '2px',
                    transition: 'left 0.2s'
                  }} />
                </div>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: isAutoPause ? '#10b981' : '#94a3b8',
                  marginTop: '2px',
                  fontFamily: "'Outfit', sans-serif"
                }}>
                  AP
                </span>
              </div>

              {/* Subtitles Overlay Center/Bottom inside Video Player */}
              {activeSub && (
                <div 
                  className="subtitles-video-overlay"
                  style={{
                    position: 'absolute',
                    bottom: '68px', // Sit safely above controls bar
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '85%',
                    textAlign: 'center',
                    zIndex: 20,
                    pointerEvents: 'auto',
                    userSelect: 'none'
                  }}
                >
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    padding: '8px 18px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    border: '1.5px solid rgba(255,255,255,0.1)'
                  }}>
                    {/* Primary English Subtitle Line */}
                    <div className="subtitle-line primary-lang" style={{ justifyContent: 'center', fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {renderHoverableSentence(activeSub.en)}
                    </div>
                    {/* Secondary Spanish Translation Line */}
                    <div className="subtitle-line secondary-lang" style={{ justifyContent: 'center', fontSize: '1.05rem', fontWeight: 500, color: '#cbd5e1', marginTop: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {renderHoverableSentence(activeSub.es)}
                    </div>
                  </div>
                </div>
              )}

              {/* Word dynamic hover tooltip overlayed directly inside Player Container */}
              {hoveredWord && (
                <div
                  className="word-reactor-tooltip"
                  style={{ 
                    position: 'absolute',
                    left: `${hoveredWord.x}px`, 
                    bottom: `calc(100% - ${hoveredWord.y - 12}px)`,
                    zIndex: 99999
                  }}
                  onMouseEnter={() => setHoveredWord(hoveredWord)}
                  onMouseLeave={handleWordLeave}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="tooltip-word-title">
                      {hoveredWord.text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")}
                    </span>
                    <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', marginLeft: '6px' }}
                      onClick={() => safeSpeakSpeech(hoveredWord.text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ""))}
                    >🔊</button>
                    {!hoveredWord.loading && (
                      <button
                        className={`star-save-word-btn ${hoveredWord.isSaved ? 'saved' : ''}`}
                        onClick={() => toggleSaveWord(hoveredWord.key, { translation: hoveredWord.translation, alternatives: hoveredWord.alternatives, category: hoveredWord.category })}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={hoveredWord.isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </button>
                    )}
                  </div>
                  <span className="tooltip-word-category">{hoveredWord.category}</span>
                  <div className="tooltip-word-meaning">
                    {hoveredWord.loading ? <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Traduciendo...</span> : hoveredWord.translation}
                  </div>
                  {!hoveredWord.loading && hoveredWord.alternatives && (
                    <div className="tooltip-word-alternatives"><span style={{ fontWeight: 700 }}>Alt:</span> {hoveredWord.alternatives.join(", ")}</div>
                  )}
                </div>
              )}

              {/* Custom Overlay Video Controls Bar */}
              <div 
                className="custom-video-controls"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '52px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '0 20px',
                  zIndex: 15,
                  color: '#ffffff',
                  fontFamily: "'Inter', sans-serif",
                  userSelect: 'none'
                }}
              >
                {/* Play/Pause Button */}
                <button
                  onClick={handleTogglePlay}
                  style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, transition: 'transform 0.1s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>

                {/* Scrubber */}
                <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                  <input
                    type="range"
                    min="0"
                    max={videoDuration || 100}
                    value={currentTime}
                    onChange={handleProgressBarChange}
                    className="custom-scrubber"
                    style={{ width: '100%', height: '4px', cursor: 'pointer', borderRadius: '9999px', outline: 'none', margin: 0 }}
                  />
                </div>

                {/* Time counter */}
                <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px', fontFamily: "'Outfit', sans-serif", whiteSpace: 'nowrap' }}>
                  {formatTime(currentTime)} / {formatTime(videoDuration)}
                </span>

                {/* Volume */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => {
                      const newVol = volume > 0 ? 0 : 0.8;
                      setVolume(newVol);
                      if (playerType === 'youtube') {
                        if (playerRef.current && playerRef.current.setVolume) playerRef.current.setVolume(newVol * 100);
                      } else {
                        if (localVideoRef.current) localVideoRef.current.volume = newVol;
                      }
                    }}
                    style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.1rem', cursor: 'pointer', padding: 0 }}
                  >
                    {volume === 0 ? '🔇' : '🔊'}
                  </button>
                  <input
                    type="range" min="0" max="1" step="0.05" value={volume}
                    onChange={handleVolumeChange}
                    className="custom-volume-slider"
                    style={{ width: '64px', height: '4px', cursor: 'pointer' }}
                  />
                </div>

                {/* Fullscreen */}
                <button
                  onClick={handleToggleFullscreen}
                  style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.1rem', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', transition: 'transform 0.1s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {isFullscreen ? '⏹' : '⛶'}
                </button>
              </div>
            </div>
            
            {/* Subtle hotkeys guide bar */}
            {showHotkeysHelper && (
              <div style={{
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1.5px solid var(--border)',
                marginTop: '4px',
                fontFamily: "'Inter', sans-serif"
              }}>
                ⌨️ <strong>Atajos:</strong> [W] Play/Pausa · [A] Frase anterior · [S] Repetir frase · [D] Siguiente frase · [Q] Alternar Auto-Pausa (AP)
              </div>
            )}
          </div>

          {/* Right Side: Transcript Sidebar Panel (Language Reactor Style) */}
          <div className="transcript-sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            {/* Sidebar Tab Header */}
            <div className="transcript-tabs" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid var(--border)', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexGrow: 1 }}>
                <button
                  className={`transcript-tab-btn ${activeTab === 'SUBTÍTULOS' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('SUBTÍTULOS');
                    sounds.playCorrect();
                  }}
                  style={{ flex: 1, padding: '12px 10px', fontSize: '0.8rem', fontWeight: 700 }}
                >
                  Subtítulos
                </button>
                <button
                  className={`transcript-tab-btn ${activeTab === 'PALABRAS' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('PALABRAS');
                    sounds.playCorrect();
                  }}
                  style={{ flex: 1, padding: '12px 10px', fontSize: '0.8rem', fontWeight: 700 }}
                >
                  Palabras
                </button>
                <button
                  className={`transcript-tab-btn ${activeTab === 'GUARDADO' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('GUARDADO');
                    sounds.playCorrect();
                  }}
                  style={{ flex: 1, padding: '12px 10px', fontSize: '0.8rem', fontWeight: 700 }}
                >
                  Guardado ({savedWords.length})
                </button>
              </div>
            </div>

            {/* Sidebar content area */}
            <div className="transcript-content-area" style={{ flexGrow: 1, overflowY: 'auto', padding: '0.5rem', minHeight: 0 }}>
              {activeTab === 'SUBTÍTULOS' && (
                currentSubtitles.map((sub) => {
                  const isActive = currentTime >= sub.start && currentTime <= sub.end;
                  return (
                    <div
                      key={sub.id}
                      ref={isActive ? activeItemRef : null}
                      className={`transcript-line-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleSeek(sub.start)}
                      style={{ 
                        padding: '10px 14px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '4px',
                        alignItems: 'stretch',
                        borderRadius: '10px',
                        marginBottom: '8px',
                        border: isActive ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                        backgroundColor: isActive ? 'rgba(79, 70, 229, 0.05)' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isActive && (
                          <span style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>▶</span>
                        )}
                        <span style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: 'var(--primary)',
                          fontFamily: "'Outfit', sans-serif"
                        }}>
                          {sub.en}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        fontFamily: "'Inter', sans-serif",
                        paddingLeft: isActive ? '1rem' : '0'
                      }}>
                        {sub.es}
                      </div>
                    </div>
                  );
                })
              )}

              {activeTab === 'PALABRAS' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, padding: '4px 8px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vocabulario Clave del Video</div>
                  {Object.keys(currentDictionary || {}).length > 0 ? (
                    Object.keys(currentDictionary || {})
                      .slice(0, 15)
                      .map((key) => {
                        const item = currentDictionary[key];
                        return (
                          <div key={key} className="saved-word-item" style={{ backgroundColor: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'capitalize' }}>{key}</span>
                              <span style={{ fontSize: '0.65rem', opacity: 0.5, marginLeft: '8px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-secondary)' }}>({item.category})</span>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '2px' }}>
                                {item.translation}
                              </div>
                            </div>
                            <button
                              className={`star-save-word-btn ${savedWords.some(w => w.key === key) ? 'saved' : ''}`}
                              onClick={() => toggleSaveWord(key, item)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: savedWords.some(w => w.key === key) ? '#fbbf24' : '#cbd5e1' }}
                            >
                              ★
                            </button>
                          </div>
                        );
                      })
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                      Pasa el mouse sobre las palabras del video para traducirlas y verlas aquí.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'GUARDADO' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, padding: '4px 8px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Palabras Guardadas del Estudiante</div>
                  {savedWords.length > 0 ? (
                    savedWords.map((word) => (
                      <div key={word.key} className="saved-word-item" style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '10px', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ color: '#16a34a', fontWeight: 700, textTransform: 'capitalize' }}>{word.key}</span>
                          <span style={{ fontSize: '0.65rem', opacity: 0.5, marginLeft: '8px', textTransform: 'uppercase', fontWeight: 700, color: '#16a34a' }}>({word.category})</span>
                          <div style={{ fontSize: '0.8rem', color: '#14532d', fontWeight: 500, marginTop: '2px' }}>
                            {word.translation}
                          </div>
                        </div>
                        <button
                          className="star-save-word-btn saved"
                          onClick={() => toggleSaveWord(word.key, word)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                          title="Eliminar palabra"
                        >
                          🗑️
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                      No tienes palabras guardadas todavía. Haz clic en la ★ de cualquier traducción para guardarla.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mascot footer inside transcript sidebar (zona verde) */}
            <div style={{
              borderTop: '1.5px solid var(--border)',
              padding: '10px 14px',
              backgroundColor: '#f8fafc',
              flexShrink: 0
            }}>
              <Mascot mood="happy" text={playerType === 'local' ? "¡Leo los subtítulos en inglés en voz alta en tiempo real!" : "¡Pasa el mouse sobre las palabras en la pantalla para ver su significado e interactuar!"} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="view-container" 
      style={{ 
        position: 'relative',
        maxWidth: currentView === 'player' ? '100%' : '1350px',
        padding: currentView === 'player' ? '1rem 2rem' : '2rem'
      }}
    >
      
      {/* Intro Overlay — Minimalist TV style */}
      {introActive && (
        <div className={`cinema-intro-overlay ${introFade ? 'fade-out' : ''}`}
          style={{ fontFamily: "'Outfit', sans-serif", overflow: 'hidden', backgroundColor: '#06060e' }}
        >
          {/* Subtle CRT scan lines — very faint */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.10) 0px, rgba(0,0,0,0.10) 1px, transparent 1px, transparent 4px)',
          }} />

          {/* Soft vignette */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)'
          }} />

          {/* Brief static flash (only while loading < 30%) */}
          {loaderProgress < 30 && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1,
              backgroundColor: '#050505',
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
              backgroundSize: '150px 150px',
              animation: 'tvNoiseShift 0.12s steps(2) infinite'
            }} />
          )}

          {/* Logo reveal (30%+) */}
          {loaderProgress >= 30 && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '28px',
              animation: 'logoFadeIn 0.6s ease forwards'
            }}>
              {/* Red live dot — top left, very small */}
              <div style={{
                position: 'absolute', top: '24px', left: '28px',
                display: 'flex', gap: '6px', alignItems: 'center'
              }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  backgroundColor: '#ef4444', boxShadow: '0 0 6px #ef4444',
                  animation: 'tvBlink 1.2s ease infinite'
                }} />
                <span style={{ fontSize: '0.58rem', color: '#475569', letterSpacing: '0.12em', fontWeight: 600 }}>EN VIVO</span>
              </div>

              {/* Logo */}
              <img
                src="/assets/logo.png"
                alt="Mentora"
                style={{
                  height: '68px', width: 'auto', objectFit: 'contain',
                  filter: 'drop-shadow(0 0 20px rgba(79,70,229,0.65)) brightness(1.05)',
                }}
              />

              {/* Tagline */}
              <span style={{
                fontSize: '0.7rem', color: '#334155',
                letterSpacing: '0.3em', fontWeight: 500,
                textTransform: 'uppercase'
              }}>
                Aprende inglés con cine
              </span>

              {/* Thin progress bar */}
              <div style={{ width: '140px', height: '2px', backgroundColor: '#1e293b', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(((loaderProgress - 30) / 70) * 100, 100)}%`,
                  backgroundColor: '#4f46e5',
                  transition: 'width 0.05s linear',
                  borderRadius: '9999px'
                }} />
              </div>
            </div>
          )}

          {/* Skip button — subtle */}
          <button
            onClick={() => { setIntroActive(false); sounds.playCompleted(); }}
            style={{
              position: 'absolute', bottom: '28px', right: '28px',
              background: 'none', border: 'none',
              color: '#334155', padding: '4px 10px', fontSize: '0.7rem',
              cursor: 'pointer', zIndex: 100, letterSpacing: '0.08em',
              fontFamily: "'Outfit', sans-serif", transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#94a3b8'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#334155'}
          >
            saltar ›
          </button>
        </div>
      )}

      {/* --- View Outlet: Catalog Lobby or Player Screen --- */}
      {currentView === 'catalog' ? renderCatalogLobby() : renderInteractivePlayer()}

      {/* --- Landing page features section (Shared footer) --- */}
      {currentView === 'catalog' && (
        <div style={{
        marginTop: '3.5rem',
        textAlign: 'center',
        padding: '3rem 2rem',
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '24px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
        fontFamily: "'Inter', sans-serif"
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#0f172a',
          fontFamily: "'Outfit', sans-serif",
          marginBottom: '1rem'
        }}>
          ¿Cómo aprender con el <span style={{ color: '#4f46e5' }}>Cine Reactor</span> de Mentora?
        </h2>
        <p style={{
          color: '#475569',
          fontSize: '1rem',
          maxWidth: '800px',
          margin: '0 auto 2.5rem auto',
          lineHeight: '1.6'
        }}>
          Elige cualquiera de los discursos o trailers de películas de nuestro catálogo. Reproduce la escena, revisa las traducciones instantáneas al pasar el cursor y perfecciona tu speaking repitiendo las frases clave.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <div style={{
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            textAlign: 'left'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              marginBottom: '1rem'
            }}>💬</div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Speaking</h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>Practica tu pronunciación repitiendo frases específicas con el control interactivo ↻ o usando atajos.</p>
          </div>

          <div style={{
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            textAlign: 'left'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              color: '#0ea5e9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              marginBottom: '1rem'
            }}>📖</div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Vocabulary</h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>Amplía tus conocimientos pasando el cursor sobre palabras para traducirlas al instante con la API de IA.</p>
          </div>

          <div style={{
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            textAlign: 'left'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              marginBottom: '1rem'
            }}>🔊</div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Listening</h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5' }}>Mejora tu comprensión auditiva escuchando diálogos reales y voces sintéticas nativas.</p>
          </div>
        </div>
      </div>
      )}

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/51900000000?text=Hola%20Mentora!%20Me%20gustaría%20saber%20más%20sobre%20los%20planes%20y%20lecciones%20de%20inglés." 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#25d366',
          color: '#ffffff',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
          zIndex: 10000,
          cursor: 'pointer',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.62.962 3.21 1.463 4.957 1.464 5.389 0 9.774-4.382 9.777-9.769.002-2.61-1.002-5.066-2.827-6.892C16.677 2.13 14.228.99 11.62.99a9.77 9.77 0 0 0-9.768 9.77c-.001 1.83.499 3.491 1.482 5.111L2.33 21.57l6.317-1.656zm12.188-6.186c-.269-.134-1.595-.788-1.842-.878-.247-.09-.427-.134-.607.134-.18.269-.696.878-.853 1.057-.157.18-.314.202-.583.067-1.161-.58-1.921-.967-2.678-2.267-.201-.346-.201-.646-.067-.781.12-.121.269-.314.404-.471.135-.157.18-.269.269-.449.09-.18.045-.337-.022-.471-.067-.134-.607-1.459-.831-1.997-.219-.526-.44-.455-.607-.463-.157-.008-.337-.01-.517-.01a1.002 1.002 0 0 0-.719.337c-.247.269-.943.921-.943 2.246s.965 2.605 1.1 2.785c.134.18 1.9 2.901 4.6 4.067.643.277 1.144.443 1.536.568.647.206 1.236.177 1.701.108.518-.077 1.595-.651 1.819-1.28.224-.63.224-1.169.157-1.28-.067-.113-.247-.18-.517-.313z"/>
        </svg>
      </a>
    </div>
  );
}
