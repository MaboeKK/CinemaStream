import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import {
  FaArrowLeft,
  FaChromecast,
  FaSearch,
  FaPlay,
  FaPlus,
  FaCheck,
  FaListUl,
  FaChevronDown,
  FaSortAmountDown,
  FaSortAmountUp,
  FaDownload,
  FaEllipsisH,
  FaStar,
} from 'react-icons/fa';
import { fetchSeriesDetails, fetchSeasonEpisodes, fetchSimilarSeries } from '../../../api/tmdb';
import { fetchYoutubeTrailer } from '../../../api/youtube';
import { useMyList } from '../../../hooks/useMyList';
import './SeriesDetailPage.css';

const TABS = [
  { key: 'episodes', label: 'Episodes' },
  { key: 'details', label: 'Details' },
  { key: 'trailers', label: 'Trailers & More' },
  { key: 'similar', label: 'Similar' },
];

function getVideoId(url) {
  const match = url?.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
}

// Landing screen for "Watch Content" on a series -- picks a season/episode
// before handing off to the actual player (/watch/tv/:id/:season/:episode),
// since vidking needs a specific episode and this app has no other place
// to choose one.
function SeriesDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggle } = useMyList();

  const [series, setSeries] = useState(null);
  const [activeTab, setActiveTab] = useState('episodes');

  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonMenuOpen, setSeasonMenuOpen] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [episodeQuery, setEpisodeQuery] = useState('');
  const [sortDesc, setSortDesc] = useState(false);

  const [trailerUrl, setTrailerUrl] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [playingTrailer, setPlayingTrailer] = useState(false);

  const [similar, setSimilar] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchSeriesDetails(id)
      .then((data) => {
        if (cancelled) return;
        setSeries(data);
        setSelectedSeason(data.seasons[0]?.season_number ?? 1);
      })
      .catch((error) => console.error('Failed to load series details', error));
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (selectedSeason == null) return undefined;
    let cancelled = false;
    setEpisodesLoading(true);
    fetchSeasonEpisodes(id, selectedSeason)
      .then((data) => {
        if (!cancelled) setEpisodes(data);
      })
      .catch((error) => {
        console.error('Failed to load season episodes', error);
        if (!cancelled) setEpisodes([]);
      })
      .finally(() => {
        if (!cancelled) setEpisodesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, selectedSeason]);

  useEffect(() => {
    if (activeTab !== 'similar' || similar !== null) return;
    fetchSimilarSeries(id)
      .then((items) => setSimilar(items.slice(0, 10)))
      .catch((error) => {
        console.error('Failed to load similar series', error);
        setSimilar([]);
      });
  }, [activeTab, id, similar]);

  if (!series) {
    return (
      <div className="series-detail-page">
        <div className="series-detail-loading skeleton" />
      </div>
    );
  }

  const year = series.release_date?.slice(0, 4);
  const seasonCount = series.seasons.length;
  const saved = isSaved(series.id);
  const videoId = getVideoId(trailerUrl);

  const handlePlay = () => navigate(`/watch/tv/${id}/${selectedSeason ?? 1}/1`);
  const handlePlayEpisode = (episode) => navigate(`/watch/tv/${id}/${selectedSeason}/${episode.episode_number}`);
  const handleToggleMyList = () => toggle({ ...series, media_type: 'tv' });

  const handleShowTrailers = async () => {
    setActiveTab('trailers');
    if (trailerUrl || trailerLoading) return;
    setTrailerLoading(true);
    try {
      const url = await fetchYoutubeTrailer(series.name);
      setTrailerUrl(url);
    } catch (error) {
      console.error('Failed to load trailer', error);
    } finally {
      setTrailerLoading(false);
    }
  };

  const visibleEpisodes = episodes
    .filter((ep) => ep.name?.toLowerCase().includes(episodeQuery.toLowerCase()))
    .sort((a, b) => (sortDesc ? b.episode_number - a.episode_number : a.episode_number - b.episode_number));

  return (
    <div className="series-detail-page">
      <div
        className="series-detail-hero"
        style={series.backdrop_path ? { backgroundImage: `url(https://image.tmdb.org/t/p/original${series.backdrop_path})` } : undefined}
      >
        <div className="series-detail-hero-scrim" />
        <div className="series-detail-hero-topbar">
          <button className="series-detail-icon-btn" onClick={() => navigate(-1)} aria-label="Back">
            <FaArrowLeft />
          </button>
          <div className="series-detail-hero-topbar-right">
            <button className="series-detail-icon-btn" aria-label="Cast">
              <FaChromecast />
            </button>
            <button className="series-detail-icon-btn" aria-label="Search">
              <FaSearch />
            </button>
          </div>
        </div>

        <div className="series-detail-hero-content">
          <h1>{series.name}</h1>
          <p className="series-detail-meta">
            {year && <span>{year}</span>}
            {year && <span className="series-detail-meta-dot">&middot;</span>}
            <span>
              {seasonCount} Season{seasonCount === 1 ? '' : 's'}
            </span>
            {series.genres.length > 0 && (
              <>
                <span className="series-detail-meta-dot">&middot;</span>
                <span>{series.genres.map((g) => g.name).join(', ')}</span>
              </>
            )}
          </p>
          <p className="series-detail-overview">{series.overview}</p>

          <div className="series-detail-actions">
            <button className="series-detail-play-btn" onClick={handlePlay}>
              <FaPlay /> Play
            </button>
            <button
              className={`series-detail-icon-btn round${saved ? ' active' : ''}`}
              onClick={handleToggleMyList}
              aria-label={saved ? 'Remove from My List' : 'Add to My List'}
            >
              {saved ? <FaCheck /> : <FaPlus />}
            </button>
            <button className="series-detail-pill-btn" onClick={() => setActiveTab('episodes')}>
              <FaListUl /> Episodes
            </button>
          </div>
        </div>
      </div>

      <div className="series-detail-body">
        <div className="series-detail-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`series-detail-tab${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => (tab.key === 'trailers' ? handleShowTrailers() : setActiveTab(tab.key))}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'episodes' && (
          <div className="series-detail-episodes">
            <div className="series-detail-episodes-toolbar">
              <div className="series-detail-season-select">
                <button className="series-detail-season-btn" onClick={() => setSeasonMenuOpen((v) => !v)}>
                  Season {selectedSeason} <FaChevronDown />
                </button>
                {seasonMenuOpen && (
                  <div className="series-detail-season-menu">
                    {series.seasons.map((s) => (
                      <button
                        key={s.season_number}
                        className={`series-detail-season-option${s.season_number === selectedSeason ? ' active' : ''}`}
                        onClick={() => {
                          setSelectedSeason(s.season_number);
                          setSeasonMenuOpen(false);
                        }}
                      >
                        {s.name || `Season ${s.season_number}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="series-detail-episode-search">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search episode..."
                  value={episodeQuery}
                  onChange={(e) => setEpisodeQuery(e.target.value)}
                />
              </div>

              <button
                className="series-detail-icon-btn round"
                onClick={() => setSortDesc((v) => !v)}
                aria-label={sortDesc ? 'Sort ascending' : 'Sort descending'}
              >
                {sortDesc ? <FaSortAmountUp /> : <FaSortAmountDown />}
              </button>
            </div>

            {episodesLoading ? (
              <div className="series-detail-episode-list">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton series-detail-episode-skeleton" />
                ))}
              </div>
            ) : visibleEpisodes.length === 0 ? (
              <p className="series-detail-empty">No episodes found.</p>
            ) : (
              <div className="series-detail-episode-list">
                {visibleEpisodes.map((ep) => (
                  <div key={ep.id} className="series-detail-episode-row">
                    <button
                      className="series-detail-episode-thumb"
                      onClick={() => handlePlayEpisode(ep)}
                      aria-label={`Play ${ep.name}`}
                    >
                      {ep.still_path && (
                        <img src={`https://image.tmdb.org/t/p/w300${ep.still_path}`} alt={ep.name} />
                      )}
                      <span className="series-detail-episode-play">
                        <FaPlay />
                      </span>
                    </button>
                    <div className="series-detail-episode-info">
                      <span className="series-detail-episode-number">{ep.episode_number}</span>
                      <div className="series-detail-episode-text">
                        <h3>{ep.name}</h3>
                        {ep.runtime && <p className="series-detail-episode-runtime">{ep.runtime} min</p>}
                        <p className="series-detail-episode-overview">{ep.overview}</p>
                      </div>
                      <div className="series-detail-episode-row-actions">
                        <button className="series-detail-icon-btn" aria-label="Download">
                          <FaDownload />
                        </button>
                        <button className="series-detail-icon-btn" aria-label="More">
                          <FaEllipsisH />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="series-detail-details">
            {series.genres.length > 0 && (
              <div className="series-detail-genre-tags">
                {series.genres.map((genre) => (
                  <span key={genre.id} className="series-detail-genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
            {series.vote_average > 0 && (
              <p className="series-detail-rating">
                <FaStar /> {series.vote_average.toFixed(1)}
              </p>
            )}
            {series.actors.length > 0 && (
              <>
                <h4>Cast</h4>
                <div className="series-detail-cast-list">
                  {series.actors.map((actor) => (
                    <div key={actor.cast_id ?? actor.id} className="series-detail-cast-item">
                      {actor.profile_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                          alt={actor.name}
                        />
                      )}
                      <span className="series-detail-cast-name">{actor.name}</span>
                      <span className="series-detail-cast-character">{actor.character}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'trailers' && (
          <div className="series-detail-trailers">
            {trailerLoading ? (
              <div className="skeleton series-detail-trailer-skeleton" />
            ) : !videoId ? (
              <p className="series-detail-empty">No trailer found.</p>
            ) : !playingTrailer ? (
              <button className="series-detail-trailer-card" onClick={() => setPlayingTrailer(true)}>
                {series.backdrop_path && (
                  <img src={`https://image.tmdb.org/t/p/w780${series.backdrop_path}`} alt="" />
                )}
                <span className="series-detail-trailer-play">
                  <FaPlay />
                </span>
              </button>
            ) : (
              <div className="series-detail-trailer-player">
                <YouTube
                  videoId={videoId}
                  className="series-detail-trailer-iframe-wrap"
                  iframeClassName="series-detail-trailer-iframe"
                  opts={{ playerVars: { autoplay: 1 } }}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'similar' && (
          <div className="series-detail-similar">
            {similar === null ? (
              <div className="series-detail-similar-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton series-detail-similar-skeleton" />
                ))}
              </div>
            ) : similar.length === 0 ? (
              <p className="series-detail-empty">Nothing similar found.</p>
            ) : (
              <div className="series-detail-similar-grid">
                {similar.map((item) => (
                  <button
                    key={item.id}
                    className="series-detail-similar-card"
                    onClick={() => navigate(`/watch/tv/${item.id}`)}
                  >
                    {item.poster_path && (
                      <img src={`https://image.tmdb.org/t/p/w300${item.poster_path}`} alt={item.name} />
                    )}
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SeriesDetailPage;
