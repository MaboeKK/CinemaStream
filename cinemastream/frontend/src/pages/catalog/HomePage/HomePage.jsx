import React, { useState } from 'react';
import CatalogNavbar from '../../../components/catalog/CatalogNavbar';
import Hero from '../../../components/catalog/Hero';
import MovieRow from '../../../components/catalog/MovieRow';
import TrailerModal from '../../../components/catalog/TrailerModal';
import Footer from '../../../components/catalog/Footer';
import {
  fetchTrendingMovies,
  fetchTrendingSeries,
  fetchTopRatedMovies,
  fetchNewReleaseMovies,
  discoverMovies,
  fetchMovieDetails,
  fetchSeriesDetails,
} from '../../../api/tmdb';
import { fetchYoutubeTrailer } from '../../../api/youtube';
import './HomePage.css';

const EMPTY_MODAL_CONTENT = { name: '', overview: '', genres: [], actors: [], rawItem: null };

const fetchRecommended = () => discoverMovies();
const trendingTabs = [
  { label: 'Movies', fetchFunction: fetchTrendingMovies },
  { label: 'Series', fetchFunction: fetchTrendingSeries },
];

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
      <Hero onPlayTrailer={openTrailerModal} />

      <div className="catalog-home-rows">
        <MovieRow title="Trending Now" tabs={trendingTabs} onMovieClick={openTrailerModal} accent />
        <MovieRow title="Top Rated" fetchFunction={fetchTopRatedMovies} onMovieClick={openTrailerModal} />
        <MovieRow title="New Releases" fetchFunction={fetchNewReleaseMovies} onMovieClick={openTrailerModal} />
        <MovieRow title="Recommended For You" fetchFunction={fetchRecommended} onMovieClick={openTrailerModal} />
      </div>

      <Footer />

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
