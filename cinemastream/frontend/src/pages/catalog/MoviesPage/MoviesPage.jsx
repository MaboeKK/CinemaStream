import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilm } from 'react-icons/fa';
import CatalogNavbar from '../../../components/catalog/CatalogNavbar';
import MovieCard from '../../../components/catalog/MovieCard';
import SearchBar from '../../../components/catalog/SearchBar';
import GenreFilter from '../../../components/catalog/GenreFilter';
import TrailerModal from '../../../components/catalog/TrailerModal';
import EmptyState from '../../../components/catalog/EmptyState';
import { fetchGenres, fetchMovieDetails, searchMovies, discoverMovies } from '../../../api/tmdb';
import { fetchYoutubeTrailer } from '../../../api/youtube';
import './MoviesPage.css';

const EMPTY_MODAL_CONTENT = { name: '', overview: '', genres: [], actors: [], rawItem: null };

function MoviesPage() {
  const [searchParams] = useSearchParams();
  const [movieList, setMovieList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  const [trailerUrl, setTrailerUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(EMPTY_MODAL_CONTENT);

  useEffect(() => {
    fetchGenres().then(setGenres);
  }, []);

  useEffect(() => {
    setMovieList([]);
    setPage(1);
    loadMovies(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre, searchTerm]);

  const loadMovies = async (targetPage, reset = false) => {
    setLoading(true);
    try {
      const results = searchTerm.trim()
        ? await searchMovies(searchTerm, targetPage)
        : await discoverMovies(selectedGenre, targetPage);
      setMovieList((prev) => (reset ? results : [...prev, ...results]));
    } catch (err) {
      console.error('Failed to load movies', err);
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadMovies(nextPage);
  };

  const openTrailerModal = async (movie) => {
    try {
      const details = await fetchMovieDetails(movie.id);
      const url = await fetchYoutubeTrailer(details.name);

      setTrailerUrl(url);
      setModalContent({ ...details, rawItem: { ...movie, media_type: 'movie' } });
      setModalOpen(true);
    } catch (error) {
      console.error('Failed to load movie details', error);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setTrailerUrl(null);
    setModalContent(EMPTY_MODAL_CONTENT);
  };

  return (
    <div className="catalog-list-page">
      <CatalogNavbar />
      <div className="catalog-list-content">
        <div className="catalog-header">
          <h2 className="catalog-page-title">Movies</h2>
          <p className="catalog-page-subtitle">Browse our full catalog of movies</p>
        </div>

        <div className="catalog-filter-bar">
          <SearchBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            placeholder="Search movies by name..."
          />

          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            id="movie-genre-select"
            label="Genre"
          />
        </div>

        {!loading && movieList.length === 0 ? (
          <EmptyState
            icon={<FaFilm />}
            title="No movies found"
            description="Try a different search term or genre."
            actionLabel={searchTerm || selectedGenre ? 'Clear filters' : undefined}
            onAction={
              searchTerm || selectedGenre
                ? () => {
                    setSearchTerm('');
                    setSelectedGenre('');
                  }
                : undefined
            }
          />
        ) : loading && movieList.length === 0 ? (
          <div className="catalog-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </div>
        ) : (
          <>
            <div className="catalog-grid">
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={() => openTrailerModal(movie)} />
              ))}
            </div>

            <div className="catalog-load-more">
              <button className="btn-primary" onClick={handleLoadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          </>
        )}
      </div>

      <TrailerModal
        isOpen={modalOpen}
        trailerUrl={trailerUrl}
        modalContent={modalContent}
        onClose={closeModal}
      />
    </div>
  );
}

export default MoviesPage;
