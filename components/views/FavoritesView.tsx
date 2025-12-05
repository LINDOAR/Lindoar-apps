
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import RecipeCard from '../RecipeCard';
import { Recipe } from '../../types';
import GlassCard from '../ui/GlassCard';
import { HeartCrack, Utensils } from 'lucide-react';

const FavoritesView: React.FC = () => {
  const { favorites } = useAppContext();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-4xl text-center text-berry-500 mb-8">Your Favorite Bites</h1>
      
      {favorites.length === 0 ? (
        <GlassCard className="text-center">
            <HeartCrack className="mx-auto text-stone-400 mb-4" size={48} />
            <h2 className="font-serif text-2xl text-stone-700 mb-2">Your recipe box is empty!</h2>
            <p className="text-stone-500">Head over to the Meal Gen to find and save some delicious recipes.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setSelectedRecipe(recipe)}
              className="cursor-pointer"
            >
              <GlassCard className="h-full flex flex-col justify-between hover:shadow-berry-soft transition-shadow duration-300">
                <div>
                  <h3 className="font-serif text-2xl text-berry-500 mb-2">{recipe.name}</h3>
                  <p className="text-sm text-stone-500 line-clamp-3">{recipe.benefits.symptomRelief}</p>
                </div>
                <div className="flex justify-end items-center mt-4 pt-4 border-t border-stone-200">
                    <button className="flex items-center gap-2 text-sm font-semibold text-berry-500">
                        View Recipe <Utensils size={16} />
                    </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRecipe(null)}
          >
            <div className="w-full max-w-2xl max-h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
                <RecipeCard recipe={selectedRecipe} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FavoritesView;
