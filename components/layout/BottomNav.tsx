
import React from 'react';
import { motion } from 'framer-motion';
import { View } from '../../App';
import { Utensils, CalendarDays, BarChart3, Cookie, Heart } from 'lucide-react';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: 'meal', label: 'Meal', icon: <Utensils size={24} /> },
    { view: 'plan', label: 'Plan', icon: <CalendarDays size={24} /> },
    { view: 'log', label: 'Log', icon: <BarChart3 size={24} /> },
    { view: 'snack', label: 'Snack', icon: <Cookie size={24} /> },
    { view: 'favorites', label: 'Faves', icon: <Heart size={24} /> },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="relative bg-white/80 backdrop-blur-xl shadow-berry-soft rounded-4xl p-2 flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className={`relative flex-1 flex flex-col items-center justify-center p-2 rounded-3xl transition-colors duration-300 z-10 ${
                activeView === item.view ? 'text-white' : 'text-stone-500'
            }`}
          >
             {activeView === item.view && (
                <motion.div
                    layoutId="mobile-nav-bubble"
                    className="absolute inset-0 bg-berry-500 rounded-3xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
            )}
            <div className="relative">{item.icon}</div>
            <span className="relative text-xs font-bold mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
