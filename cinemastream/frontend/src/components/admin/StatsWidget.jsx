import React from 'react';
import { Link } from 'react-router-dom';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import './StatsWidget.scss';

// "watchtime" is intentionally omitted -- it wasn't wired to a route or a
// real endpoint in the original either.
const WIDGET_DATA = {
  users: {
    title: 'USERS',
    value: 'See all the users that have registered',
    link: 'See all users',
    linkTo: '/admin/users',
    icon: (
      <PersonOutlineOutlinedIcon
        className="icon"
        style={{ color: 'var(--color-accent)', backgroundColor: 'rgba(244, 83, 166, 0.15)' }}
      />
    ),
  },
  genres: {
    title: 'TOP GENRES',
    value: ['Action', 'Drama', 'Thriller', 'Comedy', 'Sci-Fi'].join(', '),
    link: 'Explore genres',
    linkTo: '/admin/stats',
    icon: (
      <MovieOutlinedIcon
        className="icon"
        style={{ backgroundColor: 'rgba(244, 83, 166, 0.15)', color: 'var(--color-accent)' }}
      />
    ),
  },
};

const StatsWidget = ({ type }) => {
  const data = WIDGET_DATA[type] || { title: 'UNKNOWN', value: 'N/A', link: 'N/A', linkTo: '/', icon: null };

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{data.value}</span>
        <Link to={data.linkTo} className="link">
          {data.link}
        </Link>
      </div>
      <div className="right">{data.icon}</div>
    </div>
  );
};

export default StatsWidget;
