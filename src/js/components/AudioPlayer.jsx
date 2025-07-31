import React, { useState, useEffect, useRef } from "react";
import {
  FaPlay,
  FaPause,
  FaArrowRight,
  FaArrowLeft,
  FaVolumeUp,
} from "react-icons/fa";

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);

  useEffect(() => {
    fetch("https://playground.4geeks.com/sound/songs")
      .then((res) => res.json())
      .then((data) => setPlaylist(data.songs))
      .catch((err) => console.error(err));
  }, []);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const playNext = () =>
    setCurrentTrackIndex((i) => (i + 1 < playlist.length ? i + 1 : 0));
  const playPrevious = () =>
    setCurrentTrackIndex((i) => (i - 1 >= 0 ? i - 1 : playlist.length - 1));

  return (
    <div className="audio-player">
      <button
        className="toggle-playlist"
        onClick={() => setShowPlaylist((prev) => !prev)}
      >
        {showPlaylist ? "Hide Playlist" : "Show Playlist"}
      </button>

      {showPlaylist && (
        <div className="playlist">
          {playlist.map((song, idx) => (
            <div
              key={song.id}
              className={`song-item ${
                idx === currentTrackIndex ? "active" : ""
              }`}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(true);
              }}
            >
              {song.name}
            </div>
          ))}
        </div>
      )}

      <audio ref={audioRef} />

      <div className="controls">
        <button onClick={playPrevious}>
          <FaArrowLeft />
        </button>
        <button onClick={togglePlayPause}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={playNext}>
          <FaArrowRight />
        </button>
      </div>

      <div className="volume-control">
        <FaVolumeUp />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          defaultValue="1"
          onChange={(e) => {
            if (audioRef.current) audioRef.current.volume = e.target.value;
          }}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
