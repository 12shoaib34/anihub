import React from "react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";

const VideoPlayer = ({ videoUrl, tracks, nextEpisode, animeId }) => {
  const navigate = useNavigate();

  const onComplete = () => {
    if (nextEpisode) {
      navigate(`/anime?animeId=${animeId}&ep=${nextEpisode}`);
    }
  };

  return (
    <div id="anihub-video-container" className="anihub-video-container">
      <ReactPlayer
        url={videoUrl}
        controls
        playing={true} // Enables autoplay
        width="100%"
        height="100%"
        onEnded={onComplete}
      />
    </div>
  );
};

export default VideoPlayer;
