import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaArrowRight, FaArrowLeft } from "react-icons/fa";

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

  useEffect(() => {
    const audio = audioRef.current;
    const relative = playlist[currentTrackIndex]?.url;
    if (!audio || !relative) return;

    const fullUrl = "https://playground.4geeks.com" + relative;
    audio.src = fullUrl;
    audio.load();
  }, [currentTrackIndex, playlist]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("Play blocked or unsupported:", err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

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

      <audio ref={audioRef}  onEnded={playNext}>
        {playlist[currentTrackIndex]?.url && (
          <source
            src={playlist[currentTrackIndex].url}
            type="audio/mp3"
          />
        )}
      
      </audio>

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
        🔊
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
