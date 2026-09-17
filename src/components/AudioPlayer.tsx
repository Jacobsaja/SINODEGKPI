"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Headphones, RotateCcw, AlertCircle, ExternalLink } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function AudioPlayer({
  src,
  title = "Audio Renungan",
  subtitle = "Dengarkan firman Tuhan",
  className = "",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const streamSrc = src.startsWith("https://cpzplvifayzyihjzecdp.supabase.co/storage/v1/object/public/publications/")
    ? `/api/audio-stream?url=${encodeURIComponent(src)}`
    : src;

  // Watchdog: pastikan loading spinner tidak macet lebih dari 3 detik
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Reload audio saat URL berubah
  useEffect(() => {
    if (audioRef.current) {
      setIsPlaying(false);
      setProgress(0);
      setHasError(false);
      setIsLoading(false);
      audioRef.current.load();
    }
  }, [streamSrc]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying || !audio.paused) {
      audio.pause();
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      setHasError(false);
      audio.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch((err) => {
        console.warn("Audio playback issue:", err);
        setIsPlaying(false);
        setIsLoading(false);
        setHasError(true);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      if (isLoading) {
        setIsLoading(false);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setHasError(false);
      setIsLoading(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsLoading(false);
    setProgress(0);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setProgress(0);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    setPlaybackRate(rates[nextIdx]);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`rounded-2xl border border-primary/25 bg-surface/90 p-5 md:p-6 shadow-sm backdrop-blur-md transition-all ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(14,99,233,0.06) 0%, rgba(248,250,252,0.95) 100%)",
      }}
    >
      <audio
        ref={audioRef}
        src={streamSrc}
        preload="metadata"
        onPlay={() => {
          setIsPlaying(true);
          setIsLoading(false);
          setHasError(false);
        }}
        onPause={() => {
          setIsPlaying(false);
          setIsLoading(false);
        }}
        onPlaying={() => {
          setIsPlaying(true);
          setIsLoading(false);
          setHasError(false);
        }}
        onLoadedData={() => {
          setIsLoading(false);
          setHasError(false);
        }}
        onCanPlay={() => {
          setIsLoading(false);
          setHasError(false);
          if (audioRef.current?.duration) {
            setDuration(audioRef.current.duration);
          }
        }}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={() => {
          setIsLoading(false);
          setIsPlaying(false);
          setHasError(true);
        }}
      />

      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="relative group w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/25 hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
          aria-label={isPlaying ? "Jeda audio" : "Putar audio"}
        >
          {isLoading ? (
            <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isPlaying ? (
            <Pause size={24} fill="currentColor" />
          ) : (
            <Play size={24} className="translate-x-0.5" fill="currentColor" />
          )}
        </button>

        {/* Info & Track */}
        <div className="flex-1 w-full space-y-2.5 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Headphones size={15} className="text-primary shrink-0" />
                <h4 className="text-sm font-bold text-text-primary truncate">{title}</h4>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
            </div>

            {/* Extra Controls (Restart & Speed) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={restartAudio}
                className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                title="Mulai dari awal"
              >
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                onClick={cyclePlaybackRate}
                className="px-2 py-1 rounded-md text-[11px] font-bold border border-border/80 bg-surface/70 text-text-secondary hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
                title="Kecepatan putar"
              >
                {playbackRate}x
              </button>
            </div>
          </div>

          {/* Timeline Range */}
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress}
              onChange={handleProgressChange}
              className="w-full h-1.5 rounded-lg bg-border/50 accent-primary cursor-pointer hover:accent-primary-dark transition-all"
            />
            <div className="flex items-center justify-between text-[11px] font-medium text-text-secondary">
              <span>{formatTime(progress)}</span>
              <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
            </div>
          </div>

          {/* Volume control */}
          <div className="flex items-center justify-end gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="text-text-secondary hover:text-primary transition-colors cursor-pointer"
              title={isMuted ? "Bunyikan" : "Bisukan"}
            >
              {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-16 h-1 accent-primary cursor-pointer"
            />
          </div>
        </div>
      </div>

      {hasError && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-amber-500/10 border border-amber-500/25 px-3 py-2 text-xs text-amber-300">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertCircle size={14} className="shrink-0 text-amber-400" />
            <span className="truncate">Browser belum mendukung pemutaran langsung format file ini.</span>
          </div>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline shrink-0 text-[11px]"
          >
            <span>Buka / Unduh</span>
            <ExternalLink size={12} />
          </a>
        </div>
      )}
    </div>
  );
}
