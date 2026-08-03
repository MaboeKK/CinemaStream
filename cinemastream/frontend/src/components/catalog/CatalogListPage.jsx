import React, { useState } from 'react';
import CatalogNavbar from './CatalogNavbar';
import MovieCard from './MovieCard';
import SearchBar from './SearchBar';
import GenreFilter from './GenreFilter';
import TrailerModal from './TrailerModal';
import EmptyState from './EmptyState';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useCatalogList } from '../../hooks/useCatalogList';
import { fetchYoutubeTrailer } from '../../api/youtube';
import '../../pages/catalog/MoviesPage/MoviesPage.css';

const EMPTY_MODAL_CONTENT = { name: '', overview: '', genres: [], actors: [], rawItem: null };

// Shared page shell behind MoviesPage and SeriesPage: paged/searchable/
// genre-filtered grid + trailer modal, parametrized by which TMDB
// functions and labels apply to the given media type.
function CatalogListPage({
  mediaType, // 'movie' | 'tv'
  title,
  searchPlaceholder,
  emptyIcon,
  emptyTitle,
  genreSelectId,
  fetchGenres,
  searchFn,
  discoverFn,
  fetchDetails,
}) {
  const {
    list,
    genres,
    selectedGenre,
    setSelectedGenre,
    searchTerm,
    setSearchTerm,
    loading,
    hasMore,
    loadMore,
  } = useCatalogList({ fetchGenres, searchFn, discoverFn });

  const [trailerUrl, setTrailerUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(EMPTY_MODAL_CONTENT);

  const sentinelRef = useInfiniteScroll({ onLoadMore: loadMore, hasMore });

  const openTrailerModal = async (item) => {
    try {
      const details = await fetchDetails(item.id);
      const url = await fetchYoutubeTrailer(details.name);

      setTrailerUrl(url);
      setModalContent({ ...details, rawItem: { ...item, media_type: mediaType } });
      setModalOpen(true);
    } catch (error) {
      console.error(`Failed to load ${mediaType} details`, error);
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
          <h2 className="catalog-page-title">{title}</h2>

          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} placeholder={searchPlaceholder} />

          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            id={genreSelectId}
            label="Genre"
          />
        </div>

        {!loading && list.length === 0 ? (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
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
        ) : loading && list.length === 0 ? (
          <div className="catalog-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </div>
        ) : (
          <>
            <div className="catalog-grid">
              {list.map((item) => (
                <MovieCard key={item.id} movie={item} onClick={() => openTrailerModal(item)} />
              ))}
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={`more-${i}`} className="skeleton skeleton-card" />
                ))}
            </div>

            {hasMore && <div ref={sentinelRef} className="catalog-scroll-sentinel" />}
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

export default CatalogListPage;
