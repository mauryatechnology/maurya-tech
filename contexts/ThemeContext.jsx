'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { themes, defaultTheme } from '@/data/themes';

const STORAGE_KEY = 'maurya-theme';

const ThemeContext = createContext(undefined);

/**
 * Runs before first paint (see ThemeScript below) so the saved theme is on
 * <html> by the time the page renders. Without it the CSS default (light)
 * paints first and then flips to the stored theme, which reads as a flash.
 */
const DARK_THEMES = themes.filter((t) => t.id.includes('dark')).map((t) => t.id);

export const themeInitScript = `
(function(){
  var d=document.documentElement,
      valid=${JSON.stringify(themes.map((t) => t.id))},
      dark=${JSON.stringify(DARK_THEMES)},
      t=${JSON.stringify(defaultTheme)};
  try{
    var s=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
    if(valid.indexOf(s)>-1)t=s;
  }catch(e){}
  d.setAttribute('data-theme',t);
  d.classList.toggle('dark',dark.indexOf(t)>-1);
})();
`;

/** Render inside <head>, before any stylesheet-dependent content. */
export const ThemeScript = () => (
  <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
);

// Reads the theme the blocking script already committed to <html>. Runs only on
// the client, so the server render keeps the default and hydration stays stable.
const readAppliedTheme = () => {
  if (typeof document === 'undefined') return defaultTheme;
  const applied = document.documentElement.getAttribute('data-theme');
  return themes.some((t) => t.id === applied) ? applied : defaultTheme;
};

export const ThemeProvider = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [currentThemeId, setCurrentThemeId] = useState(defaultTheme);

  useEffect(() => {
    // One state update on mount: adopt whatever the pre-paint script applied and
    // flag that theme-dependent UI is now safe to render.
    queueMicrotask(() => {
      const applied = readAppliedTheme();
      setCurrentThemeId(applied);
      setMounted(true);
    });
  }, []);

  const setTheme = useCallback((themeId) => {
    if (!themes.some((t) => t.id === themeId)) return;
    setCurrentThemeId(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    document.documentElement.classList.toggle('dark', themeId.includes('dark'));
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
    } catch {
      // Private mode / storage disabled - the theme still applies for this visit.
    }
  }, []);

  const value = useMemo(() => {
    const currentTheme = themes.find((t) => t.id === currentThemeId) || themes[0];
    return { currentTheme, setTheme, themes, mounted };
  }, [currentThemeId, setTheme, mounted]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
