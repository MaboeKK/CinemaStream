import React, { useState } from 'react';
import './Home.css';
import Navbar from '../../Components/NavBar/Navbar';
import Banner from '../../Components/Banner/Banner';
import Row from '../../Components/MovieRows/Row';
import TrailerModal from '../../Components/Modal/TrailerModal';
import { fetchTrending, fetchPopularMovies, fetchPopularSeries, fetchMovieDetails, fetchSeriesDetails } from '../../api/tmdb';
import { fetchYoutubeTrailer } from '../../api/youtube';

function Home() {
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});  // <-- added state for details

  const openTrailerModal = async (movie) => {
    try {
      const url = await fetchYoutubeTrailer(movie.title || movie.name);

      // Fetch detailed info based on media type
      let details = {};
      if (movie.media_type === 'movie' || movie.title) {
        details = await fetchMovieDetails(movie.id);
      } else if (movie.media_type === 'tv' || movie.name) {
        details = await fetchSeriesDetails(movie.id);
      }

      if (url && details) {
        setTrailerUrl(url);
        setModalContent(details);
        setModalOpen(true);
      } else {
        alert('Trailer or details not found!');
      }
    } catch (error) {
      console.error('Error fetching trailer or details:', error);
      alert('Failed to load trailer or details.');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setTrailerUrl(null);
    setModalContent({});
  };

  return (
    <div className="home-container">
      <Navbar />
      <Banner onPlayTrailer={openTrailerModal} />

      <Row title="Trending Movies" fetchFunction={fetchTrending} onMovieClick={openTrailerModal} />
     
      <Row title="Popular Series" fetchFunction={fetchPopularSeries} onMovieClick={openTrailerModal} />

      <TrailerModal 
        isOpen={modalOpen} 
        trailerUrl={trailerUrl} 
        modalContent={modalContent} 
        onClose={closeModal} 
      />
    </div>
  );
}

export default Home;
