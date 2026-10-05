import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Play, Pause } from 'lucide-react';

export const WeddingAudio: React.FC = () => {
  const { data, setIsAudioPlaying } = useWedding();
  const [isPlaying, setIsPlaying] = useState(true);
  const userManuallyPausedRef = useRef(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const youtubeIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Synthesized fallback notes if neither audio file nor youtube is available
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<number | null>(null);

  const musicSettings = data.music || {
    title: 'Ullam Paadum',
    subtitle: '2 States',
    audioUrl: 'https://www.youtube.com/watch?v=MbLpZXIZZOg',
    startTime: 0,
    endTime: 0,
  };

  const startTime = Math.max(0, musicSettings.startTime || 0);
  const endTime = musicSettings.endTime && musicSettings.endTime > startTime ? musicSettings.endTime : 0;

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
  const stopSynthesizer = useCallback(() => {
    if (synthTimerRef.current) {
      clearTimeout(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  }, []);

  // Graceful Shehnai synthesized melody sequence
  const startSynthesizer = useCallback(() => {
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
  }, []);

  const handlePlay = useCallback(() => {
    userManuallyPausedRef.current = false;
    setIsPlaying(true);
    setIsAudioPlaying(true);

    if (youtubeId && youtubeIframeRef.current?.contentWindow) {
      try {
        if (startTime > 0) {
          youtubeIframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'seekTo', args: [startTime, true] }),
            '*'
          );
        }
        youtubeIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*'
        );
      } catch (err) {
        console.warn('Error sending playVideo to YouTube iframe:', err);
      }
    } else if (isDirectAudio && audioRef.current) {
      if (
        audioRef.current.currentTime < startTime ||
        (endTime > startTime && audioRef.current.currentTime >= endTime)
      ) {
        audioRef.current.currentTime = startTime;
      }
      audioRef.current.play().catch(() => {
        startSynthesizer();
      });
    } else {
      startSynthesizer();
    }
  }, [youtubeId, isDirectAudio, startTime, endTime, setIsAudioPlaying, startSynthesizer]);

  const handlePause = useCallback(() => {
    userManuallyPausedRef.current = true;
    setIsPlaying(false);
    setIsAudioPlaying(false);

    if (youtubeId && youtubeIframeRef.current?.contentWindow) {
      try {
        youtubeIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
          '*'
        );
      } catch {}
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    stopSynthesizer();
  }, [youtubeId, setIsAudioPlaying, stopSynthesizer]);

  const toggleMusic = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  // Autoplay immediately on website load with staggered triggers as the iframe initializes
  useEffect(() => {
    let unmounted = false;

    const triggerPlay = () => {
      if (!unmounted && !userManuallyPausedRef.current) {
        handlePlay();
      }
    };

    // Staggered triggers to catch the iframe at the earliest moment it becomes ready
    const delays = [150, 400, 800, 1400, 2200, 3200, 4500];
    const timers = delays.map((ms) => setTimeout(triggerPlay, ms));

    // Also trigger on any window focus, visibilitychange or first interaction as instant fallback
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        triggerPlay();
      }
    };
    const onFirstUserAction = () => {
      if (!userManuallyPausedRef.current) {
        handlePlay();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', triggerPlay);
    window.addEventListener('pointerdown', onFirstUserAction, { passive: true });
    window.addEventListener('touchstart', onFirstUserAction, { passive: true });
    window.addEventListener('scroll', onFirstUserAction, { passive: true });

    return () => {
      unmounted = true;
      timers.forEach(clearTimeout);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', triggerPlay);
      window.removeEventListener('pointerdown', onFirstUserAction);
      window.removeEventListener('touchstart', onFirstUserAction);
      window.removeEventListener('scroll', onFirstUserAction);
    };
  }, [handlePlay]);

  // Sync with global custom events
  useEffect(() => {
    const onPlayEvent = () => handlePlay();
    const onPauseEvent = () => handlePause();

    window.addEventListener('wedding_play_music', onPlayEvent);
    window.addEventListener('wedding_pause_music', onPauseEvent);

    return () => {
      window.removeEventListener('wedding_play_music', onPlayEvent);
      window.removeEventListener('wedding_pause_music', onPauseEvent);
    };
  }, [handlePlay, handlePause]);

  // Listen to messages from YouTube iframe to stay in sync with player state
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      if (typeof event.data === 'string') {
        try {
          const parsed = JSON.parse(event.data);

          // If YouTube announces it is ready or loaded, immediately command play
          if (parsed.event === 'onReady' || parsed.event === 'initialDelivery') {
            if (!userManuallyPausedRef.current) {
              handlePlay();
            }
          }

          if (parsed.event === 'infoDelivery' && parsed.info) {
            if (parsed.info.playerState === 1) {
              setIsPlaying(true);
              setIsAudioPlaying(true);
            } else if (parsed.info.playerState === 2) {
              setIsPlaying(false);
              setIsAudioPlaying(false);
            } else if (parsed.info.playerState === 0) {
              // Video ended -> loop back to startTime!
              if (youtubeIframeRef.current?.contentWindow) {
                youtubeIframeRef.current.contentWindow.postMessage(
                  JSON.stringify({ event: 'command', func: 'seekTo', args: [startTime, true] }),
                  '*'
                );
                youtubeIframeRef.current.contentWindow.postMessage(
                  JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
                  '*'
                );
              }
            }
          }
        } catch {
          // Ignore non-json messages
        }
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [startTime, handlePlay, setIsAudioPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSynthesizer();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stopSynthesizer]);

  // Construct YouTube URL with start and end times for trimming + immediate autoplay
  const ytEmbedSrc = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&playsinline=1&controls=0&fs=0&loop=1&playlist=${youtubeId}${
        startTime > 0 ? `&start=${Math.floor(startTime)}` : ''
      }${endTime > startTime ? `&end=${Math.floor(endTime)}` : ''}`
    : '';

  return (
    <div className="relative inline-flex items-center">
      {/* 
        YouTube Audio Player Container:
        Using 240x240 size positioned just offscreen with 0.001 opacity.
        Crucial: Browsers (Chrome/Safari) throttle or freeze iframes with 1x1 or 0x0 dimensions,
        which stops autoplay. Giving it valid dimensions ensures immediate playback on link opening.
      */}
      {youtubeId && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            bottom: '-280px',
            right: '-280px',
            width: '240px',
            height: '240px',
            opacity: 0.001,
            pointerEvents: 'none',
            zIndex: -9999,
            overflow: 'hidden',
          }}
        >
          <iframe
            ref={youtubeIframeRef}
            key={`yt-${youtubeId}-${startTime}-${endTime}`}
            title="Wedding Music Player"
            src={ytEmbedSrc}
            width="240"
            height="240"
            allow="autoplay *; encrypted-media *; fullscreen *"
            onLoad={() => {
              if (!userManuallyPausedRef.current) {
                handlePlay();
              }
            }}
          />
        </div>
      )}

      {/* Hidden HTML5 Audio Element for Direct URLs with Cut/Trim loop support */}
      {isDirectAudio && (
        <audio
          ref={audioRef}
          autoPlay
          src={musicSettings.audioUrl}
          onPlay={() => {
            setIsPlaying(true);
            setIsAudioPlaying(true);
          }}
          onPause={() => {
            setIsPlaying(false);
            setIsAudioPlaying(false);
          }}
          onLoadedMetadata={(e) => {
            if (startTime > 0) {
              e.currentTarget.currentTime = startTime;
            }
          }}
          onTimeUpdate={(e) => {
            const audio = e.currentTarget;
            if (endTime > startTime && audio.currentTime >= endTime) {
              audio.currentTime = startTime;
              audio.play().catch(() => {});
            }
          }}
          onEnded={(e) => {
            e.currentTarget.currentTime = startTime;
            e.currentTarget.play().catch(() => {});
          }}
        />
      )}

      {/* Minimalist Aesthetic Play/Pause Button in Header */}
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
