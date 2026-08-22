import React, { useState, useRef, useEffect } from "react";
import { useSong } from "../hooks/useSong";
import "./Player.scss";

const Player = () => {
  const { song, loading } = useSong();
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isSpeedDropdownOpen, setIsSpeedDropdownOpen] = useState(false);

  // Auto-load and auto-play when song URL changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.volume = isMuted ? 0 : volume;

      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.log("Autoplay was prevented, waiting for user interaction:", err);
          setIsPlaying(false);
        });
      }
    }
  }, [song?.url]);

  // Sync playback speed updates to the audio node
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Sync volume updates to the audio node
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  if (!song) {
    return (
      <div className="player-card">
        <div style={{ color: "#9ca3af", fontSize: "0.9rem", textAlign: "center", width: "100%" }}>
          No active song. Detect expression to load.
        </div>
      </div>
    );
  }

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Playback error:", err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    const newTime = Math.min(duration, audioRef.current.currentTime + 5);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, audioRef.current.currentTime - 5);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    setIsSpeedDropdownOpen(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const moodClass = `mood-${(song.mood || "happy").toLowerCase()}`;

  return (
    <div className={`player-card ${moodClass}`}>
      <audio
        ref={audioRef}
        src={song.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      {/* Left Column: Poster & Info */}
      <div className="player-left">
        <div className={`poster-wrapper ${isPlaying ? "playing" : ""}`}>
          <img src={song.posterUrl} alt={song.title} />
        </div>
        <div className="song-meta">
          <div className="song-title">{song.title}</div>
          <span className={`mood-badge ${(song.mood || "happy").toLowerCase()}`}>
            {(song.mood || "happy")}
          </span>
        </div>
      </div>

      {/* Middle Column: Timeline Progress */}
      <div className="player-middle">
        <span className="time-txt">{formatTime(currentTime)}</span>
        <div className="progress-bar-wrapper" onClick={handleProgressClick}>
          <div
            className="progress-filled"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          >
            <div className="progress-thumb" />
          </div>
        </div>
        <span className="time-txt">{formatTime(duration)}</span>
      </div>

      {/* Speed Control Button */}
      <div className="speed-control-wrapper">
        <button
          className="speed-btn"
          onClick={() => setIsSpeedDropdownOpen(!isSpeedDropdownOpen)}
          title="Playback Speed"
        >
          {playbackSpeed}x
        </button>

        {isSpeedDropdownOpen && (
          <div className="speed-dropdown">
            {[0.5, 1.0, 1.25, 1.5, 2.0].map((speed) => (
              <button
                key={speed}
                className={playbackSpeed === speed ? "active" : ""}
                onClick={() => changeSpeed(speed)}
              >
                {speed}x
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right-Middle Column: Controls (Skip, Play, Skip) */}
      <div className="player-controls">
        <button className="btn-skip" onClick={skipBackward} title="Rewind 5s">
          <svg viewBox="0 0 24 24">
            <path d="M12 5c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8h-2c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6v4l5-5-5-5z" />
          </svg>
          <span>5s</span>
        </button>

        <button className="btn-play-pause" onClick={togglePlayPause} title={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button className="btn-skip" onClick={skipForward} title="Forward 5s">
          <span>5s</span>
          <svg viewBox="0 0 24 24">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
          </svg>
        </button>
      </div>

      {/* Right Column: Volume */}
      <div className="player-right">
        <div className="volume-icon" onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
          {isMuted || volume === 0 ? (
            <svg viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (isMuted) setIsMuted(false);
          }}
          className="volume-slider"
          title="Volume"
        />
      </div>
    </div>
  );
};

export default Player;