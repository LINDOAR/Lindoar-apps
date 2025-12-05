
import React from 'react';
import { motion } from 'framer-motion';
import { Recipe } from '../types';
import { useAppContext } from '../context/AppContext';
import { Heart, BrainCircuit, Smile, Flame, Clock } from 'lucide-react';
import GlassCard from './ui/GlassCard';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { addFavorite, removeFavorite, isFavorite } = useAppContext();
  const favorite = isFavorite(recipe.id);

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFavorite(recipe.id);
    } else {
      addFavorite({ ...recipe, id: recipe.name + Date.now() }); // Ensure unique ID for this context
    }
  };

  return (
    <GlassCard 
        className="w-full max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-start">
        <h2 className="text-3xl md:text-4xl font-serif text-berry-500 mb-4 pr-4">{recipe.name}</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavoriteClick}
          className="p-2 rounded-full bg-white/50"
        >
          <Heart size={28} className={`transition-colors duration-300 ${favorite ? 'text-berry-500 fill-current' : 'text-stone-400'}`} />
        </motion.button>
      </div>

      <div className="flex items-center space-x-4 text-stone-500 mb-6">
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span className="font-semibold">{recipe.stats.prepTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame size={18} />
            <span className="font-semibold">{recipe.stats.calories} kcal</span>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-serif text-stone-700 mb-3">Ingredients</h3>
          <ul className="space-y-2 list-disc list-inside text-stone-600">
            {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-serif text-stone-700 mb-3">Instructions</h3>
          <ol className="space-y-3 list-decimal list-inside text-stone-600">
            {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
      </div>
      
      <div className="bg-berry-100/50 rounded-3xl p-6">
        <h3 className="text-xl font-serif text-berry-500 mb-4">Sofagirl's Scoop</h3>
        <div className="space-y-4 text-stone-700">
            <div className="flex gap-4 items-start">
                <BrainCircuit className="text-peach-500 mt-1 flex-shrink-0" size={20} />
                <p><strong className="font-bold">Hormone Help:</strong> {recipe.benefits.hormone}</p>
            </div>
            <div className="flex gap-4 items-start">
                <Smile className="text-sky-500 mt-1 flex-shrink-0" size={20} />
                <p><strong className="font-bold">Mood Boost:</strong> {recipe.benefits.mood}</p>
            </div>
            <div className="flex gap-4 items-start">
                <Heart className="text-mint-500 mt-1 flex-shrink-0" size={20} />
                <p><strong className="font-bold">Symptom Soother:</strong> {recipe.benefits.symptomRelief}</p>
            </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default RecipeCard;
