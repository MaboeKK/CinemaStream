import { createTheme } from '@mui/material/styles';

// Mirrors the CSS custom properties in index.css so MUI components (Paper,
// DataGrid) pick up the same palette/type scale natively instead of via the
// !important global class-name overrides the admin .scss files used before.
const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#090909', // --color-bg
      paper: '#1f1f1f', // --color-surface-raised (elevated surface)
    },
    primary: {
      main: '#e50914', // --color-accent
      dark: '#f40612', // --color-accent-hover is lighter, kept for reference only
    },
    text: {
      primary: '#f5f5f5', // --color-text
      secondary: '#b3b3b3', // --color-text-muted
    },
    divider: '#2a2a2a', // --color-border
    action: {
      hover: '#252525', // --color-hover
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: [0, 4, 8, 16, 24, 32, 48, 64], // matches --space-1..--space-7
  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    h1: { fontSize: 36 }, // --font-size-h1
    h2: { fontSize: 28 }, // --font-size-h2
    h3: { fontSize: 22 }, // --font-size-h3
    body1: { fontSize: 16 }, // --font-size-body
    caption: { fontSize: 14 }, // --font-size-caption
  },
});

export default muiTheme;
