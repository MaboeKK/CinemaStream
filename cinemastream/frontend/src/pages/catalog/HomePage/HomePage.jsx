import React, { useState } from 'react';
import CatalogNavbar from '../../../components/catalog/CatalogNavbar';
import Banner from '../../../components/catalog/Banner';
import MovieRow from '../../../components/catalog/MovieRow';
import TrailerModal from '../../../components/catalog/TrailerModal';
import {
  fetchPopularMovies,
  fetchPopularSeries,
  fetchMovieDetails,
  fetchSeriesDetails,
} from '../../../api/tmdb';
import { fetchYoutubeTrailer } from '../../../api/youtube';
import './HomePage.css';

const EMPTY_MODAL_CONTENT = { name: '', overview: '', genres: [], actors: [], rawItem: null };

function HomePage() {
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(EMPTY_MODAL_CONTENT);

  const openTrailerModal = async (item) => {
    try {
      const url = await fetchYoutubeTrailer(item.title || item.name);
      const isMovie = item.media_type === 'movie' || Boolean(item.title);
      const details = isMovie ? await fetchMovieDetails(item.id) : await fetchSeriesDetails(item.id);

      if (url && details) {
        setTrailerUrl(url);
        setModalContent({ ...details, rawItem: item });
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching trailer or details:', error);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setTrailerUrl(null);
    setModalContent(EMPTY_MODAL_CONTENT);
  };

  return (
    <div className="catalog-home-container">
      <CatalogNavbar />
      <Banner onPlayTrailer={openTrailerModal} />

      <MovieRow title="Trending Movies" fetchFunction={fetchPopularMovies} onMovieClick={openTrailerModal} />
      <MovieRow title="Trending Series" fetchFunction={fetchPopularSeries} onMovieClick={openTrailerModal} />

      <TrailerModal
        isOpen={modalOpen}
        trailerUrl={trailerUrl}
        modalContent={modalContent}
        onClose={closeModal}
      />
    </div>
  );
}

export default HomePage;
