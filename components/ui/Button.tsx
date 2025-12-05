
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, icon, variant = 'primary', ...props }) => {
  const baseClasses = "flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-transform duration-200 focus:outline-none focus:ring-4";
  const variantClasses = variant === 'primary' 
    ? "bg-berry-500 text-white hover:bg-berry-600 focus:ring-berry-200 shadow-berry-soft"
    : "bg-white text-berry-500 border-2 border-berry-200 hover:bg-berry-100 focus:ring-berry-100";
    
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variantClasses}`}
      {...props}
    >
      {icon}
      {children}
    </motion.button>
  );
};

export default Button;
