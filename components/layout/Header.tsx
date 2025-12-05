
import React from 'react';
import { motion } from 'framer-motion';
import { View } from '../../App';
import { Utensils, CalendarDays, BarChart3, Cookie, Heart } from 'lucide-react';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
  { view: 'meal', label: 'Meal Gen', icon: <Utensils size={20} /> },
  { view: 'plan', label: 'Plan Day', icon: <CalendarDays size={20} /> },
  { view: 'log', label: 'Vibe Log', icon: <BarChart3 size={20} /> },
  { view: 'snack', label: 'Snack Board', icon: <Cookie size={20} /> },
  { view: 'favorites', label: 'Favorites', icon: <Heart size={20} /> },
];

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  return (
    <header className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2">
            <span role="img" aria-label="avocado" className="text-3xl">🥑</span>
            <h1 className="text-3xl font-serif text-berry-500">BellyBites</h1>
          </div>
          <nav className="flex items-center space-x-2 bg-stone-100 p-2 rounded-full">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`relative px-4 py-2 font-semibold text-sm rounded-full transition-colors duration-300 ${
                  activeView === item.view ? 'text-white' : 'text-stone-600 hover:text-berry-500'
                }`}
              >
                {activeView === item.view && (
                  <motion.div
                    layoutId="desktop-nav-underline"
                    className="absolute inset-0 bg-berry-500 rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
