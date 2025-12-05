
import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    initial?: object;
    animate?: object;
    transition?: object;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...motionProps }) => {
    return (
        <motion.div
            className={`bg-white/80 backdrop-blur-lg rounded-4xl shadow-lg p-6 md:p-8 ${className}`}
            {...motionProps}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
