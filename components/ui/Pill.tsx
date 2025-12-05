
import React from 'react';

interface PillProps {
  text: string;
  color?: 'berry' | 'mint' | 'peach' | 'sky' | 'stone';
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const colorClasses = {
  berry: {
    base: 'border-berry-200 text-berry-500',
    selected: 'bg-berry-500 text-white border-berry-500',
    hover: 'hover:bg-berry-100'
  },
  mint: {
    base: 'border-mint-300 text-mint-600',
    selected: 'bg-mint-500 text-white border-mint-500',
    hover: 'hover:bg-mint-100'
  },
  peach: {
    base: 'border-peach-300 text-peach-600',
    selected: 'bg-peach-500 text-white border-peach-500',
    hover: 'hover:bg-peach-100'
  },
  sky: {
    base: 'border-sky-300 text-sky-600',
    selected: 'bg-sky-500 text-white border-sky-500',
    hover: 'hover:bg-sky-100'
  },
  stone: {
    base: 'border-stone-300 text-stone-600',
    selected: 'bg-stone-500 text-white border-stone-500',
    hover: 'hover:bg-stone-100'
  }
};

const Pill: React.FC<PillProps> = ({ text, color = 'stone', selected = false, onClick, className = '' }) => {
  const styles = colorClasses[color] || colorClasses.stone;
  
  const baseClasses = "cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all duration-200";
  const stateClasses = selected ? styles.selected : `${styles.base} ${styles.hover}`;

  return (
    <button onClick={onClick} className={`${baseClasses} ${stateClasses} ${className}`}>
      {text}
    </button>
  );
};

export default Pill;
