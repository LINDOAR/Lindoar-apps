
import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Recipe, DailyLog } from '../types';

interface AppContextType {
  favorites: Recipe[];
  setFavorites: React.Dispatch<React.SetStateAction<Recipe[]>>;
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  logs: DailyLog[];
  setLogs: React.Dispatch<React.SetStateAction<DailyLog[]>>;
  addLog: (log: DailyLog) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('bellybites_favorites', []);
  const [logs, setLogs] = useLocalStorage<DailyLog[]>('bellybites_logs', []);

  const addFavorite = (recipe: Recipe) => {
    setFavorites((prev) => [...prev, recipe]);
  };

  const removeFavorite = (recipeId: string) => {
    setFavorites((prev) => prev.filter((r) => r.id !== recipeId));
  };

  const isFavorite = (recipeId: string) => {
    return favorites.some((r) => r.id === recipeId);
  };
  
  const addLog = (log: DailyLog) => {
    setLogs(prev => [log, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const value = {
    favorites,
    setFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    logs,
    setLogs,
    addLog,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
