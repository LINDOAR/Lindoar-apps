
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recipe } from '../../types';
import { generateRecipe } from '../../services/geminiService';
import { MEAL_TYPES, SYMPTOMS, DIETARY_RESTRICTIONS } from '../../constants';
import RecipeCard from '../RecipeCard';
import Pill from '../ui/Pill';
import Button from '../ui/Button';
import { ChefHat } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const MealGeneratorView: React.FC = () => {
  const [ingredient, setIngredient] = useState('');
  const [mealType, setMealType] = useState('Dinner');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(
      list.includes(item)
        ? list.filter((i) => i !== item)
        : [...list, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecipe(null);
    try {
      const result = await generateRecipe(ingredient, mealType, selectedSymptoms, selectedRestrictions);
      setRecipe({ ...result, id: result.name + Date.now() }); // Add a temporary unique ID
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <GlassCard className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl text-center text-berry-500 mb-2">Feed Your Mood</h1>
        <p className="text-center text-stone-600 mb-8">Tell me what you've got and how you're feeling. I'll whip up something delicious and supportive.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="ingredient" className="block text-lg font-semibold text-stone-700 mb-2">Main Ingredient (optional)</label>
            <input
              id="ingredient"
              type="text"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              placeholder="e.g., Salmon, or leave blank for a surprise!"
              className="w-full px-4 py-3 bg-white/50 border-2 border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-berry-500 transition-shadow"
            />
          </div>
          
          <div className="space-y-3">
             <h3 className="text-lg font-semibold text-stone-700">Meal Type</h3>
             <div className="flex flex-wrap gap-2">
                {MEAL_TYPES.map(type => (
                    <Pill key={type} text={type} selected={mealType === type} onClick={() => setMealType(type)} color="peach"/>
                ))}
            </div>
          </div>

          <div className="space-y-3">
             <h3 className="text-lg font-semibold text-stone-700">How's your vibe? (Symptoms)</h3>
             <div className="flex flex-wrap gap-2">
                {SYMPTOMS.map(symptom => (
                    <Pill key={symptom} text={symptom} selected={selectedSymptoms.includes(symptom)} onClick={() => handleToggle(symptom, selectedSymptoms, setSelectedSymptoms)} color="sky"/>
                ))}
            </div>
          </div>

          <div className="space-y-3">
             <h3 className="text-lg font-semibold text-stone-700">Any dietary needs?</h3>
             <div className="flex flex-wrap gap-2">
                {DIETARY_RESTRICTIONS.map(restriction => (
                    <Pill key={restriction} text={restriction} selected={selectedRestrictions.includes(restriction)} onClick={() => handleToggle(restriction, selectedRestrictions, setSelectedRestrictions)} color="mint"/>
                ))}
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Button type="submit" disabled={loading} icon={<ChefHat/>}>
              {loading ? 'Thinking...' : 'Feed My Mood'}
            </Button>
          </div>
        </form>
      </GlassCard>

      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center font-semibold text-stone-600 flex items-center justify-center gap-2"
          >
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-berry-500"></div>
            Sofagirl is cooking...
          </motion.div>
        )}
        {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-xl">{error}</p>}
        {recipe && <RecipeCard recipe={recipe} />}
      </AnimatePresence>
    </div>
  );
};

export default MealGeneratorView;
