import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
}

// Функция для определения системной темы
const getSystemTheme = (): boolean => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Функция для получения сохраненной темы из localStorage
const getSavedTheme = (): ThemeMode => {
  const saved = localStorage.getItem('theme-mode');
  if (saved && ['system', 'light', 'dark'].includes(saved)) {
    return saved as ThemeMode;
  }
  return 'system';
};

// Функция для вычисления итогового значения темы
const calculateIsDark = (mode: ThemeMode): boolean => {
  switch (mode) {
    case 'light':
      return false;
    case 'dark':
      return true;
    case 'system':
    default:
      return getSystemTheme();
  }
};

const initialMode = getSavedTheme();

const initialState: ThemeState = {
  mode: initialMode,
  isDark: calculateIsDark(initialMode),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.isDark = calculateIsDark(action.payload);
      
      // Сохраняем в localStorage
      localStorage.setItem('theme-mode', action.payload);
    },
    updateSystemTheme: (state) => {
      if (state.mode === 'system') {
        state.isDark = getSystemTheme();
      }
    },
  },
});

export const { setThemeMode, updateSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;
