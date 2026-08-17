import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminNavbar from '../../../components/admin/AdminNavbar';
import adminApi from '../../../api/adminApi';
import { searchMovies, searchSeries } from '../../../api/tmdb';
import { useAuth } from '../../../context/AuthContext';
import './ContentPage.scss';

function ContentPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState('movie');
  const [results, setResults] = useState([]);
  const [overrides, setOverrides] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOverrides = useCallback(() => {
    adminApi
      .getContentOverrides()
      .then(setOverrides)
      .catch((err) => console.error('Failed to load content overrides', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadOverrides();
  }, [loadOverrides]);

  const runSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const items = mediaType === 'movie' ? await searchMovies(query) : await searchSeries(query);
      setResults(items.slice(0, 8));
    } catch (err) {
      console.error('TMDB search failed', err);
      toast.error('Search failed.');
    }
  };

  const applyOverride = async (item, status) => {
    try {
      await adminApi.upsertContentOverride({
        tmdbId: item.id,
        mediaType,
        title: item.title || item.name,
        status,
      });
      toast.success(status === 'featured' ? 'Title featured.' : 'Title blocked.');
      loadOverrides();
    } catch (err) {
      toast.error(err.message || 'Failed to save override');
    }
  };

  const removeOverride = async (id) => {
    try {
      await adminApi.removeContentOverride(id);
      toast.success('Override removed.');
      loadOverrides();
    } catch (err) {
      toast.error(err.message || 'Failed to remove override');
    }
  };

  return (
    <div className="admin-content">
      <AdminSidebar />
      <div className="admin-contentContainer">
        <AdminNavbar />

        {isSuperAdmin && (
          <form className="content-form" onSubmit={runSearch}>
            <TextField
              size="small"
              label="Title"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ minWidth: 260 }}
            />
            <Select size="small" value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
              <MenuItem value="movie">Movie</MenuItem>
              <MenuItem value="tv">TV Show</MenuItem>
            </Select>
            <Button type="submit" variant="contained">
              Search TMDB
            </Button>
          </form>
        )}

        {results.length > 0 && (
          <div className="content-results">
            {results.map((item) => (
              <div className="content-result-row" key={item.id}>
                {item.poster_path && (
                  <img src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} alt={item.title || item.name} />
                )}
                <span style={{ flex: 1 }}>
                  {item.title || item.name} ({(item.release_date || item.first_air_date || '').slice(0, 4)})
                </span>
                <Button size="small" onClick={() => applyOverride(item, 'featured')}>
                  Feature
                </Button>
                <Button size="small" color="error" onClick={() => applyOverride(item, 'blocked')}>
                  Block
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="overrides-table">
          <h3>Current overrides</h3>
          {loading ? (
            <span>Loading…</span>
          ) : overrides.length === 0 ? (
            <span>No content overrides yet.</span>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  {isSuperAdmin && <th />}
                </tr>
              </thead>
              <tbody>
                {overrides.map((o) => (
                  <tr key={o.id}>
                    <td>{o.title}</td>
                    <td>{o.media_type}</td>
                    <td>{o.status}</td>
                    {isSuperAdmin && (
                      <td>
                        <Button size="small" onClick={() => removeOverride(o.id)}>
                          Remove
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContentPage;
