import React, { useState, useEffect, useRef } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Play, Pause } from 'lucide-react';

export const WeddingAudio: React.FC = () => {
  const { data } = useWedding();
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const youtubeIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Synthesized fallback notes if neither audio file nor youtube is available
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<number | null>(null);

  const musicSettings = data.music || {
    title: 'Ullam Paadum',
    subtitle: '2 States',
    audioUrl: 'https://www.youtube.com/watch?v=MbLpZXIZZOg',
  };

  // Helper to extract YouTube ID
  const getYouTubeId = (url?: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = getYouTubeId(musicSettings.audioUrl);
  const isDirectAudio =
    musicSettings.audioUrl?.startsWith('data:audio') ||
    musicSettings.audioUrl?.endsWith('.mp3') ||
    musicSettings.audioUrl?.endsWith('.m4a') ||
    musicSettings.audioUrl?.endsWith('.wav') ||
    musicSettings.audioUrl?.endsWith('.ogg');

  // Stop synthetic audio if running
  const stopSynthesizer = () => {
    if (synthTimerRef.current) {
      clearTimeout(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  };

  // Graceful Shehnai synthesized melody sequence
  const startSynthesizer = () => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
    const melody = [
      { note: 0, dur: 1.2 },
      { note: 1, dur: 0.8 },
      { note: 2, dur: 1.4 },
      { note: 3, dur: 1.8 },
      { note: 2, dur: 0.9 },
      { note: 4, dur: 1.6 },
      { note: 3, dur: 1.2 },
      { note: 5, dur: 2.2 },
      { note: 4, dur: 1.0 },
      { note: 3, dur: 1.4 },
      { note: 2, dur: 1.6 },
      { note: 1, dur: 1.2 },
      { note: 0, dur: 2.8 },
    ];

    let step = 0;
    const playNext = () => {
      const current = melody[step % melody.length];
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[current.note], now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, now + current.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + current.dur + 0.05);

      step++;
      synthTimerRef.current = window.setTimeout(playNext, current.dur * 1000);
    };

    playNext();
  };

  const handlePlay = () => {
    setIsPlaying(true);

    if (youtubeId && youtubeIframeRef.current?.contentWindow) {
      youtubeIframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
        '*'
      );
    } else if (isDirectAudio && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Fallback to synthesizer if direct audio load blocked
        startSynthesizer();
      });
    } else {
      startSynthesizer();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);

    if (youtubeId && youtubeIframeRef.current?.contentWindow) {
      youtubeIframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
        '*'
      );
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    stopSynthesizer();
  };

  const toggleMusic = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  // Listen to messages from YouTube iframe to stay in sync with player state
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      if (typeof event.data === 'string') {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.event === 'infoDelivery' && parsed.info) {
            if (parsed.info.playerState === 1) {
              setIsPlaying(true);
            } else if (parsed.info.playerState === 2 || parsed.info.playerState === 0) {
              setIsPlaying(false);
            }
          }
        } catch {
          // Ignore non-json messages
        }
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSynthesizer();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="relative inline-flex items-center">
      {/* Hidden YouTube Iframe Audio Player */}
      {youtubeId && (
        <iframe
          ref={youtubeIframeRef}
          title="Wedding Music Player"
          src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&origin=${encodeURIComponent(
            window.location.origin
          )}&playsinline=1&loop=1`}
          className="absolute -top-[9999px] -left-[9999px] w-1 h-1 opacity-0 pointer-events-none"
          allow="autoplay"
        />
      )}

      {/* Hidden HTML5 Audio Element for Direct URLs */}
      {isDirectAudio && (
        <audio
          ref={audioRef}
          src={musicSettings.audioUrl}
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Minimalist Aesthetic Play/Pause Button in Header (No song name) */}
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Pause music' : 'Play wedding song'}
        title={isPlaying ? `Pause: ${musicSettings.title}` : `Play: ${musicSettings.title}`}
        className={`group relative inline-flex items-center justify-center p-2 rounded-full transition-all duration-300 border shadow-xs cursor-pointer ${
          isPlaying
            ? 'bg-[#6A1420] text-amber-200 border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-md'
            : 'bg-[#5E121E]/60 hover:bg-[#5E121E] text-[#FAF6F0] hover:text-[#D4AF37] border-[#D4AF37]/50 hover:border-[#D4AF37]'
        }`}
      >
        {isPlaying ? (
          <div className="flex items-center gap-1.5 px-1">
            {/* Animated Equalizer Bars */}
            <div className="flex items-end gap-0.5 h-3.5 w-3 shrink-0">
              <span className="w-0.5 bg-amber-300 animate-pulse h-full rounded-full" />
              <span className="w-0.5 bg-amber-200 animate-pulse h-2/3 rounded-full delay-75" />
              <span className="w-0.5 bg-amber-300 animate-pulse h-5/6 rounded-full delay-150" />
            </div>
            <Pause className="w-3.5 h-3.5 text-amber-200" />
          </div>
        ) : (
          <div className="flex items-center gap-1 px-1">
            <Play className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37] translate-x-0.5" />
          </div>
        )}
      </button>
    </div>
  );
};
