export type Theme = 'light' | 'dark';

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function getTheme(): Theme {
  return (document.documentElement.getAttribute('data-theme') as Theme) || 'dark';
} 