import React, { useEffect, useMemo, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import CatalogNavbar from '../../../components/catalog/CatalogNavbar';
import Hero from '../../../components/catalog/Hero';
import GenreChips from '../../../components/catalog/GenreChips';
import TypeTabs from '../../../components/catalog/TypeTabs';
import MovieRow from '../../../components/catalog/MovieRow';
import MovieCard from '../../../components/catalog/MovieCard';
import TrailerModal from '../../../components/catalog/TrailerModal';
import EmptyState from '../../../components/catalog/EmptyState';
import Footer from '../../../components/catalog/Footer';
import {
  fetchTrending,
  fetchTopRatedMovies,
  fetchNewReleaseMovies,
  discoverMovies,
  fetchMovieDetails,
  fetchSeriesDetails,
  fetchTitlesByGenre,
} from '../../../api/tmdb';
import { fetchYoutubeTrailer } from '../../../api/youtube';
import '../MoviesPage/MoviesPage.css';
import './HomePage.css';

const EMPTY_MODAL_CONTENT = { name: '', overview: '', genres: [], actors: [], rawItem: null };
const EMPTY_FILTERED = { movies: [], series: [] };

const fetchRecommended = () => discoverMovies();

function HomePage() {
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(EMPTY_MODAL_CONTENT);

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [typeTab, setTypeTab] = useState('all');
  const [filtered, setFiltered] = useState(EMPTY_FILTERED);
  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    if (!selectedGenre) {
      setFiltered(EMPTY_FILTERED);
      return;
    }
    setTypeTab('all');
    setFilterLoading(true);
    fetchTitlesByGenre({
      movieGenreId: selectedGenre.movieGenreId,
      seriesGenreId: selectedGenre.seriesGenreId,
    })
      .then(setFiltered)
      .catch((err) => {
        console.error('Failed to load filtered titles', err);
        setFiltered(EMPTY_FILTERED);
      })
      .finally(() => setFilterLoading(false));
  }, [selectedGenre]);

  const counts = useMemo(
    () => ({
      all: filtered.movies.length + filtered.series.length,
      movie: filtered.movies.length,
      tv: filtered.series.length,
    }),
    [filtered]
  );

  const displayItems = useMemo(() => {
    if (typeTab === 'movie') return filtered.movies;
    if (typeTab === 'tv') return filtered.series;
    return [...filtered.movies, ...filtered.series].sort(
      (a, b) => (b.popularity || 0) - (a.popularity || 0)
    );
  }, [typeTab, filtered]);

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
      <GenreChips selected={selectedGenre} onSelect={setSelectedGenre} />

      {selectedGenre ? (
        <div className="catalog-home-filtered">
          <h2 className="catalog-page-title catalog-home-filtered-title">{selectedGenre.name}</h2>
          <TypeTabs activeTab={typeTab} onChange={setTypeTab} counts={counts} />

          {filterLoading ? (
            <div className="catalog-grid catalog-home-filtered-grid">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton skeleton-card" />
              ))}
            </div>
          ) : displayItems.length === 0 ? (
            <EmptyState
              icon={<FaFilter />}
              title="No titles match this genre"
              description="Try a different genre or clear the filter to see everything."
              actionLabel="Clear Filter"
              onAction={() => setSelectedGenre(null)}
            />
          ) : (
            <div className="catalog-grid catalog-home-filtered-grid">
              {displayItems.map((item) => (
                <MovieCard
                  key={`${item.media_type}-${item.id}`}
                  movie={item}
                  onClick={() => openTrailerModal(item)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="catalog-home-rows">
          <MovieRow
            title="Trending Now"
            fetchFunction={fetchTrending}
            onMovieClick={openTrailerModal}
            accent
          />
          <MovieRow title="Top Rated" fetchFunction={fetchTopRatedMovies} onMovieClick={openTrailerModal} />
          <MovieRow title="New Releases" fetchFunction={fetchNewReleaseMovies} onMovieClick={openTrailerModal} />
          <MovieRow title="Recommended For You" fetchFunction={fetchRecommended} onMovieClick={openTrailerModal} />
        </div>
      )}

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
