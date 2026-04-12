// LocalStorage service for persisting app state
export const storageService = {
  // Favorites
  getFavorites: () => {
    try {
      const data = localStorage.getItem('chineseDigits_favorites');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading favorites from localStorage:', error);
      return [];
    }
  },

  setFavorites: (favorites) => {
    try {
      localStorage.setItem('chineseDigits_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  },

  // Learning progress
  getProgress: () => {
    try {
      const data = localStorage.getItem('chineseDigits_progress');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading progress from localStorage:', error);
      return {};
    }
  },

  setProgress: (progress) => {
    try {
      localStorage.setItem('chineseDigits_progress', JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
    }
  },

  // General key-value storage
  get: (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};
