import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import { MdPlayArrow, MdPause, MdVolumeOff, MdVolumeUp, MdFullscreen, MdReplay10, MdForward10, MdFullscreenExit } from "react-icons/md";
import { AiOutlineLoading } from "react-icons/ai";

const VideoPlayer = ({ videoUrl, tracks = [], nextEpisode, animeId }) => {
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const handleRef = useRef(null);
  const hideCursorTimeout = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState({});
  const [handleDragging, setHandleDragging] = useState(false);
  const [_, setHideControlsTimeout] = useState(5000);
  const [isBuffering, setIsBuffering] = useState(false);
  const [setting, setSetting] = useState({
    isMuted: false,
    isPlaying: true,
    volume: 0.1,
    playbackRate: 1,
    fullscreen: false,
  });

  const captions = tracks?.filter((track) => track.kind === "captions");

  // keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "ArrowRight") {
        onForward();
      } else if (e.code === "ArrowLeft") {
        onRewind();
      } else if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        setSetting({ ...setting, volume: Math.min(setting.volume + 0.1, 1) });
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        setSetting({ ...setting, volume: Math.max(setting.volume - 0.1, 0) });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [progress.playedSeconds, setting.isPlaying]);

  // hide cursor
  useEffect(() => {
    if (!setting.fullscreen) return;

    document.addEventListener("mousemove", resetCursorTimer);

    return () => {
      document.removeEventListener("mousemove", resetCursorTimer);
      if (hideCursorTimeout.current) clearTimeout(hideCursorTimeout.current);
    };
  }, [setting.fullscreen]);

  // hide controls
  useEffect(() => {
    if (!showControls) return;

    let timer = setInterval(() => {
      setHideControlsTimeout((prev) => {
        if (prev <= 1000) {
          clearInterval(timer);
          setShowControls(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showControls]);

  // hide cursor
  const resetCursorTimer = () => {
    document.body.style.cursor = "auto";

    if (hideCursorTimeout.current) clearTimeout(hideCursorTimeout.current);

    hideCursorTimeout.current = setTimeout(() => {
      document.body.style.cursor = "none";
    }, 5000);
  };

  // go to next episode
  const onComplete = () => {
    if (nextEpisode) {
      navigate(`/anime?animeId=${animeId}&ep=${nextEpisode}`);
    }
  };

  // player controls
  const togglePlay = () => {
    setSetting({ ...setting, isPlaying: !setting.isPlaying });
  };

  // player controls mute
  const toggleMute = () => {
    setSetting({ ...setting, isMuted: !setting.isMuted });
  };

  // player controls volume
  const handleVolumeChange = (e) => {
    setSetting({ ...setting, volume: e.target.value });
  };

  // player controls fullscreen
  const toggleFullscreen = () => {
    const videoContainer = document.querySelector(".anihub-video-container"); // Select the wrapper div

    if (videoContainer) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoContainer.requestFullscreen().catch((err) => {
          console.error("Error attempting fullscreen:", err);
        });
      }

      setSetting((prev) => ({ ...prev, fullscreen: !prev.fullscreen }));
    }
  };

  const onProgressUpdate = useCallback((e) => {
    if (handleDragging) return;
    setProgress(e);
  }, []);

  // player controls buffer
  const onBuffer = (e) => {
    setIsBuffering(true);
  };

  const onBufferEnd = (e) => {
    setIsBuffering(false);
  };

  // player controls progress
  const onDragProgressHandle = (e) => {
    e.preventDefault();
    setHandleDragging(true);

    const progressBar = e.currentTarget.parentElement; // Get progress bar container
    const rect = progressBar.getBoundingClientRect();
    let percentage;

    const onMouseMove = (e) => {
      percentage = (e.clientX - rect.left) / rect.width;
      percentage = Math.max(0, Math.min(1, percentage));
      if (handleRef?.current) {
        handleRef.current.style.left = `${percentage * 100}%`;
      }
    };

    const onMouseUp = () => {
      if (playerRef.current) {
        playerRef.current.seekTo(percentage);
      }
      setHandleDragging(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  // player controls progress
  const onClickProgressbar = (e) => {
    if (handleDragging) return;
    if (playerRef.current) {
      const percentage = e.nativeEvent.offsetX / e.currentTarget.offsetWidth;
      setProgress({ played: percentage });
      playerRef.current.seekTo(percentage);
    }
  };

  // player controls seek forward
  const onForward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(progress.playedSeconds + 10, "seconds");
    }
  };

  // player controls seek rewind
  const onRewind = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(Math.max(progress.playedSeconds - 10, 0), "seconds");
    }
  };

  // player controls show controls
  const onShowControls = () => {
    setShowControls(true);
    setHideControlsTimeout(5000);
  };

  // player controls hide controls
  const onHideControls = () => {
    setShowControls(false);
  };

  return (
    <div onMouseLeave={onHideControls} onMouseMove={onShowControls} id="anihub-video-container" className={`anihub-video-container`}>
      <div className="anihub-video-player">
        {isBuffering && (
          <div onClick={togglePlay} className="anihub-buffer-loading">
            <AiOutlineLoading size={100} />
          </div>
        )}
        <div onDoubleClick={toggleFullscreen} onClick={togglePlay}>
          <ReactPlayer
            width="100%"
            height="100%"
            controls={false}
            url={videoUrl}
            ref={playerRef}
            playing={setting.isPlaying}
            muted={setting.isMuted}
            volume={setting.volume}
            onProgress={onProgressUpdate}
            onEnded={onComplete}
            onBuffer={onBuffer}
            onBufferEnd={onBufferEnd}
            config={{
              file: {
                attributes: { crossOrigin: "anonymous" },
                tracks: captions.map((caption, index) => ({
                  kind: "subtitles",
                  src: caption.file,
                  srcLang: caption.label,
                  label: caption.label || "English",
                  default: index === 0,
                })),
              },
            }}
          />
        </div>
        <div style={{ display: showControls ? "block" : "none" }} className="anihub-video-controller">
          <div className="anihub-progress-bar-wrapper">
            <div onMouseUp={onClickProgressbar} className="anihub-progress-bar">
              <span ref={handleRef} onMouseDown={onDragProgressHandle} style={{ left: `${progress.played * 100}%` }} className="anihub-progress-handle" />
              <span style={{ width: `${progress.loaded * 100}%` }} className="anihub-progress-loaded" />
              <span style={{ width: `${progress.played * 100}%` }} className="anihub-progress-played" />
            </div>
          </div>
          <div className="anihub-video-controller-buttons">
            <div className="anihub-audio-slider">
              <button onClick={togglePlay}>{setting.isPlaying ? <MdPause /> : <MdPlayArrow />}</button>
              <button onClick={toggleMute}>{setting.isMuted ? <MdVolumeOff /> : <MdVolumeUp />}</button>
              <input type="range" min="0" max="1" step="0.01" value={setting.volume} onChange={handleVolumeChange} /> <span>{Math.round(setting.volume * 100)}%</span>
            </div>
            <div className="anihub-video-controller-controls">
              <button onClick={onRewind}>
                <MdReplay10 />
              </button>
              <button onClick={onForward}>
                <MdForward10 />
              </button>
              <button onClick={toggleFullscreen}>{setting.fullscreen ? <MdFullscreenExit /> : <MdFullscreen />}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
