import React, { useState } from 'react';
import CatalogNavbar from '../../../components/catalog/CatalogNavbar';
import MovieCard from '../../../components/catalog/MovieCard';
import TrailerModal from '../../../components/catalog/TrailerModal';
import { useMyList } from '../../../hooks/useMyList';
import { fetchMovieDetails, fetchSeriesDetails } from '../../../api/tmdb';
import { fetchYoutubeTrailer } from '../../../api/youtube';
import '../MoviesPage/MoviesPage.css';

const EMPTY_MODAL_CONTENT = { name: '', overview: '', genres: [], actors: [], rawItem: null };

function MyListPage() {
  const { list } = useMyList();
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(EMPTY_MODAL_CONTENT);

  const openTrailerModal = async (item) => {
    try {
      const isMovie = item.media_type === 'movie';
      const details = isMovie ? await fetchMovieDetails(item.id) : await fetchSeriesDetails(item.id);
      const url = await fetchYoutubeTrailer(details.name);

      setTrailerUrl(url);
      setModalContent({ ...details, rawItem: item });
      setModalOpen(true);
    } catch (error) {
      console.error('Failed to load details', error);
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
        <h2 className="catalog-page-title">My List</h2>

        {list.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>
            Nothing saved yet — click the + icon on any title to add it here.
          </p>
        ) : (
          <div className="catalog-grid">
            {list.map((item) => (
              <MovieCard key={item.id} movie={item} onClick={() => openTrailerModal(item)} />
            ))}
          </div>
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

export default MyListPage;
