import { useTheme } from '../context/ThemeContext';

// recharts renders raw SVG, so it needs literal color values rather than
// Tailwind classes. This centralizes the light/dark pair so every chart
// across the app stays visually consistent and switches with the theme.
export default function useChartColors() {
  const { theme } = useTheme();
  return theme === 'dark'
    ? {
        grid: '#2a3a3f',
        text: '#9fb0ac',
        brand: '#3AA98C',
        clay: '#E98A5B',
        tooltipBg: '#171f23',
        palette: ['#3AA98C', '#E98A5B', '#5B8AC4', '#C9A227', '#9B6BC9'],
      }
    : {
        grid: '#e7e5e0',
        text: '#5b6b68',
        brand: '#1F8A70',
        clay: '#DD703C',
        tooltipBg: '#ffffff',
        palette: ['#1F8A70', '#DD703C', '#3E6FA6', '#B08900', '#7C4FAE'],
      };
}
