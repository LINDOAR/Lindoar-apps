
import React, { useState } from 'react';
import MealGeneratorView from './components/views/MealGeneratorView';
import SchedulerView from './components/views/SchedulerView';
import VibeLogView from './components/views/VibeLogView';
import SnackBoardView from './components/views/SnackBoardView';
import FavoritesView from './components/views/FavoritesView';
import ChatBot from './components/ChatBot';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import { AppProvider } from './context/AppContext';

export type View = 'meal' | 'plan' | 'log' | 'snack' | 'favorites';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('meal');

  const renderView = () => {
    switch (activeView) {
      case 'meal':
        return <MealGeneratorView />;
      case 'plan':
        return <SchedulerView />;
      case 'log':
        return <VibeLogView />;
      case 'snack':
        return <SnackBoardView />;
      case 'favorites':
        return <FavoritesView />;
      default:
        return <MealGeneratorView />;
    }
  };

  return (
    <AppProvider>
      <div className="font-sans text-stone-700 bg-cream min-h-screen">
        <Header activeView={activeView} setActiveView={setActiveView} />
        <main className="pb-24 lg:pb-8 pt-20 lg:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderView()}
        </main>
        <BottomNav activeView={activeView} setActiveView={setActiveView} />
        <ChatBot />
      </div>
    </AppProvider>
  );
};

export default App;
