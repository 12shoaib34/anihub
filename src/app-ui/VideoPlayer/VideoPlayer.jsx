import React, { useRef } from "react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";

const VideoPlayer = ({ videoUrl, tracks = [], nextEpisode, animeId }) => {
  const navigate = useNavigate();
  const playerRef = useRef(null);

  const onComplete = () => {
    if (nextEpisode) {
      navigate(`/anime?animeId=${animeId}&ep=${nextEpisode}`);
    }
  };

  console.log(
    "Processed Tracks:",
    tracks.map((track) => ({
      kind: track.kind,
      src: track.file,
      srcLang: "en",
      label: track.label || "Subtitle",
      default: track.default || false,
    }))
  );

  return (
    <div id="anihub-video-container" className="anihub-video-container">
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        controls
        playing={true}
        width="100%"
        height="100%"
        onEnded={onComplete}
        config={{
          file: {
            attributes: {
              crossOrigin: "anonymous",
            },
            tracks: tracks
              .filter((track) => track.kind === "captions")
              .map((track) => ({
                kind: track.kind,
                src: track.file,
                srcLang: "en",
                label: track.label || "Subtitle",
                default: track.default || true,
              })),
          },
        }}
      />
    </div>
  );
};

export default VideoPlayer;
