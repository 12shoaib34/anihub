import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import animeList from "../../data/data";
import apiUrls from "../../services/constants";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { VideoPlayer } from "../../app-ui"; // Importing the video player component
import { MdOutlineMic, MdOutlineSubtitles } from "react-icons/md";

const Anime = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const animeId = Number(params.get("animeId"));
  const ep = Number(params.get("ep"));
  const cat = params.get("cat") || "dub";

  const [videoUrl, setVideoUrl] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(ep || 1);

  const anime = animeList.find((anime) => anime._id === animeId);
  const totalEpisodes = anime ? anime.totalEpisodes : 1;

  useEffect(() => {
    if (ep) {
      let epBtn = document.getElementById(`episode-${ep}`);
      epBtn.scrollIntoView({ behavior: "smooth" });
      setSelectedEpisode(ep);
      fetchEpisode(ep, cat);
    }
  }, [ep, cat]);

  const fetchEpisode = async (episode, cat) => {
    try {
      setLoading(true);
      setError(null);

      const url = `${apiUrls.animeSourceUrl}${anime.slug.replace("EPISODE", episode)}.json?cat=${cat}`;
      const { data } = await axios.get(url);

      if (data?.success && data?.data?.sources?.length > 0) {
        setVideoUrl(data.data.sources[0].url);
        setTracks(data.data.tracks);
      } else {
        setError("Video not available");
      }
    } catch (error) {
      setError("Error fetching video");
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/anime?animeId=${animeId}&ep=${e.target.value}&cat=${cat}`);
    }
  };

  const onCatChange = (cat) => {
    navigate(`/anime?animeId=${animeId}&ep=${selectedEpisode}&cat=${cat}`);
  };

  const onChangeEpisode = (episode) => {
    navigate(`/anime?animeId=${animeId}&ep=${episode}&cat=${cat}`);
  };

  return (
    <div className="anihub-anime-screen container">
      <div className="anime-ep-list">
        <div className="anime-ep-list-header">
          <input onKeyDown={onSearch} type="number" inputMode="numeric" placeholder="Search episode" />
        </div>
        <div className="anime-ep-list-btns">
          {[...Array(totalEpisodes)].map((_, index) => (
            <button
              id={`episode-${index + 1}`}
              key={index}
              className={`episode-btn ${index + 1 === selectedEpisode ? "active" : ""} ${anime?.filers?.includes(index + 1) ? "filer" : ""}`}
              onClick={() => onChangeEpisode(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="anime-player">
        <div className="anime-header">
          <h1>{anime?.anime}</h1>
          <div className="anime-header-controls">
            <button onClick={() => onCatChange("sub")}>
              <MdOutlineSubtitles />
              Sub
            </button>
            <button onClick={() => onCatChange("dub")}>
              <MdOutlineMic />
              Dub
            </button>
          </div>
        </div>
        {loading && (
          <div className="anihub-video-loader">
            <AiOutlineLoading3Quarters />
          </div>
        )}
        {error && <p className="error">{error}</p>}
        <VideoPlayer videoUrl={videoUrl} tracks={tracks} nextEpisode={selectedEpisode + 1} animeId={animeId} />

        <p>{anime?.description}</p>
      </div>
    </div>
  );
};

export default Anime;
