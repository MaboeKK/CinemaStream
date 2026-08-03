import React from 'react';
import { FaTv } from 'react-icons/fa';
import CatalogListPage from '../../../components/catalog/CatalogListPage';
import { fetchSeriesGenres, fetchSeriesDetails, searchSeries, discoverSeries } from '../../../api/tmdb';

function SeriesPage() {
  return (
    <CatalogListPage
      mediaType="tv"
      title="Series"
      searchPlaceholder="Search series by name..."
      emptyIcon={<FaTv />}
      emptyTitle="No series found"
      genreSelectId="series-genre-select"
      fetchGenres={fetchSeriesGenres}
      searchFn={searchSeries}
      discoverFn={discoverSeries}
      fetchDetails={fetchSeriesDetails}
    />
  );
}

export default SeriesPage;
