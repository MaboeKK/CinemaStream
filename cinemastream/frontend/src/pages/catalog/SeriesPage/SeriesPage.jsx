import React, { useEffect, useState } from 'react';
import CatalogNavbar from '../../../components/catalog/CatalogNavbar';
import MovieCard from '../../../components/catalog/MovieCard';
import SearchBar from '../../../components/catalog/SearchBar';
import GenreFilter from '../../../components/catalog/GenreFilter';
import TrailerModal from '../../../components/catalog/TrailerModal';
import { fetchSeriesGenres, fetchSeriesDetails, searchSeries, discoverSeries } from '../../../api/tmdb';
import { fetchYoutubeTrailer } from '../../../api/youtube';
import '../MoviesPage/MoviesPage.css';

const EMPTY_MODAL_CONTENT = { name: '', overview: '', genres: [], actors: [], rawItem: null };

function SeriesPage() {
  const [seriesList, setSeriesList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [trailerUrl, setTrailerUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(EMPTY_MODAL_CONTENT);

  useEffect(() => {
    fetchSeriesGenres().then(setGenres);
  }, []);

  useEffect(() => {
    setSeriesList([]);
    setPage(1);
    loadSeries(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre, searchTerm]);

  const loadSeries = async (targetPage, reset = false) => {
    setLoading(true);
    try {
      const results = searchTerm.trim()
        ? await searchSeries(searchTerm, targetPage)
        : await discoverSeries(selectedGenre, targetPage);
      setSeriesList((prev) => (reset ? results : [...prev, ...results]));
    } catch (err) {
      console.error('Failed to load series', err);
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadSeries(nextPage);
  };

  const openTrailerModal = async (show) => {
    try {
      const details = await fetchSeriesDetails(show.id);
      const url = await fetchYoutubeTrailer(details.name);

      setTrailerUrl(url);
      setModalContent({ ...details, rawItem: { ...show, media_type: 'tv' } });
      setModalOpen(true);
    } catch (error) {
      console.error('Failed to load series details', error);
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
        <div className="catalog-filter-bar">
          <h2 className="catalog-page-title">Series</h2>

          <SearchBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            placeholder="Search series by name..."
          />

          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            id="series-genre-select"
            label="Genre"
          />
        </div>

        <div className="catalog-grid">
          {seriesList.map((show) => (
            <MovieCard key={show.id} movie={show} onClick={() => openTrailerModal(show)} />
          ))}
        </div>

        <div className="catalog-load-more">
          <button onClick={handleLoadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
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

export default SeriesPage;
