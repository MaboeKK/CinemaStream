import React, { useState } from 'react';
import './Home.css';
import Navbar from '../../Components/NavBar/Navbar';
import Banner from '../../Components/Banner/Banner';
import Row from '../../Components/MovieRows/Row';
import TrailerModal from '../../Components/Modal/TrailerModal';
import { fetchTrending } from '../../api/tmdb';
import { fetchPopularMovies } from '../../api/tmdb';
import { fetchPopularSeries } from '../../api/tmdb';
import { fetchYoutubeTrailer } from '../../api/youtube';

function Home() {
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openTrailerModal = async (movie) => {
    const url = await fetchYoutubeTrailer(movie.title || movie.name);
    if (url) {
      setTrailerUrl(url);
      setModalOpen(true);
    } else {
      alert('Trailer not found!');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setTrailerUrl(null);
  };

  return (
    <div className="home-container">
      <Navbar />
     <Banner onPlayTrailer={openTrailerModal} />

      <Row title="Trending Now" fetchFunction={fetchTrending} onMovieClick={openTrailerModal} />
      <Row title="Popular Movies" fetchFunction={fetchPopularMovies} onMovieClick={openTrailerModal} />
      <Row title="Popular Series" fetchFunction={fetchPopularSeries} onMovieClick={openTrailerModal} />

      <TrailerModal isOpen={modalOpen} trailerUrl={trailerUrl} onClose={closeModal} />
    </div>
  );
}
export default Home;