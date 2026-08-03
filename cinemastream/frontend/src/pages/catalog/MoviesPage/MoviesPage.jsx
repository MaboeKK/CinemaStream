import React from 'react';
import { FaFilm } from 'react-icons/fa';
import CatalogListPage from '../../../components/catalog/CatalogListPage';
import { fetchGenres, fetchMovieDetails, searchMovies, discoverMovies } from '../../../api/tmdb';

function MoviesPage() {
  return (
    <CatalogListPage
      mediaType="movie"
      title="Movies"
      searchPlaceholder="Search movies by name..."
      emptyIcon={<FaFilm />}
      emptyTitle="No movies found"
      genreSelectId="movie-genre-select"
      fetchGenres={fetchGenres}
      searchFn={searchMovies}
      discoverFn={discoverMovies}
      fetchDetails={fetchMovieDetails}
    />
  );
}

export default MoviesPage;
