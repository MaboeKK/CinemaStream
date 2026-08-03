import { createTheme } from '@mui/material/styles';

// Mirrors the CSS custom properties in index.css so MUI components (Paper,
// DataGrid) pick up the same palette/type scale natively instead of via the
// !important global class-name overrides the admin .scss files used before.
const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f1620', // --color-bg
      paper: '#202838', // --color-surface-raised (elevated surface)
    },
    primary: {
      // Solid reference tone from the official sunset gradient
      // (linear-gradient(90deg, #FF8A3D, #F453A6, #8B5CF6)) -- MUI's
      // palette.primary.main can't hold a gradient directly, so this is the
      // gradient's midpoint, same as --color-accent.
      main: '#f453a6',
      dark: '#d43d8d', // --color-accent-hover
    },
    text: {
      primary: '#f5f5f5', // --color-text
      secondary: 'rgba(245, 245, 245, 0.64)', // --color-text-muted
    },
    divider: '#2e3648', // --color-border
    action: {
      hover: '#283044', // --color-hover
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: [0, 4, 8, 16, 24, 32, 48, 64], // matches --space-1..--space-7
  typography: {
    fontFamily: 'Helvetica, Arial, sans-serif', // --font-family
    h1: { fontSize: 36 }, // --font-size-h1
    h2: { fontSize: 28 }, // --font-size-h2
    h3: { fontSize: 22 }, // --font-size-h3
    body1: { fontSize: 16 }, // --font-size-body
    caption: { fontSize: 14 }, // --font-size-caption
  },
});

export default muiTheme;
