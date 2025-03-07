import React from "react";
import animeList from "../../data/data";
import { useNavigate } from "react-router-dom";

const Home = () => {
  return (
    <div className="anihub-home">
      <div className="container">
        <div className="anihub-anime-wrapper">
          {animeList.map((anime) => {
            return <AnimeCard data={anime} key={anime._id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;

const AnimeCard = (props) => {
  const { data } = props;
  const navigate = useNavigate();

  const onNavigate = () => {
    navigate(`anime?animeId=${data._id}&ep=1`);
  };

  return (
    <div onClick={onNavigate} className="anihub-anime-card">
      <img src={data.image} alt={data.anime} />
      <div className="anihub-anime-card-content">
        <h1>{data.anime}</h1>
        <p>{data.description}</p>
      </div>
    </div>
  );
};
