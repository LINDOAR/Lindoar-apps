
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSnackBoard, generateImage } from '../../services/geminiService';
import { SNACK_VIBES, SYMPTOMS, DIETARY_RESTRICTIONS } from '../../constants';
import Pill from '../ui/Pill';
import Button from '../ui/Button';
import { Sparkles, Check } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface SnackBoardResult {
  title: string;
  description: string;
  components: string[];
  imagePrompt: string;
}

const SnackBoardView: React.FC = () => {
  const [vibe, setVibe] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [board, setBoard] = useState<SnackBoardResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vibe) {
      setError("Please pick a vibe for your snack plate!");
      return;
    }
    setLoadingText(true);
    setLoadingImage(false);
    setError(null);
    setBoard(null);
    setImageUrl(null);
    
    try {
      const result = await generateSnackBoard(vibe, selectedSymptoms, selectedRestrictions);
      setBoard(result);
      setLoadingText(false);
      setLoadingImage(true);
      const generatedImgUrl = await generateImage(result.imagePrompt);
      setImageUrl(generatedImgUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingText(false);
      setLoadingImage(false);
    }
  };

  return (
    <div className="space-y-8">
      <GlassCard className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl text-center text-berry-500 mb-2">Adult Snack Plates</h1>
        <p className="text-center text-stone-600 mb-8">Because you deserve more than just leftover crackers. Pick a vibe, I'll handle the rest.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
             <h3 className="text-lg font-semibold text-stone-700">What's the Vibe?</h3>
             <div className="flex flex-wrap gap-2">
                {SNACK_VIBES.map(v => (
                    <Pill key={v} text={v} selected={vibe === v} onClick={() => setVibe(v)} color="peach"/>
                ))}
            </div>
          </div>
          <div className="space-y-3">
             <h3 className="text-lg font-semibold text-stone-700">Any symptoms to soothe? (optional)</h3>
             <div className="flex flex-wrap gap-2">
                {SYMPTOMS.map(symptom => <Pill key={symptom} text={symptom} selected={selectedSymptoms.includes(symptom)} onClick={() => handleToggle(symptom, selectedSymptoms, setSelectedSymptoms)} color="sky"/>)}
            </div>
          </div>
          <div className="space-y-3">
             <h3 className="text-lg font-semibold text-stone-700">Dietary needs? (optional)</h3>
             <div className="flex flex-wrap gap-2">
                {DIETARY_RESTRICTIONS.map(restriction => <Pill key={restriction} text={restriction} selected={selectedRestrictions.includes(restriction)} onClick={() => handleToggle(restriction, selectedRestrictions, setSelectedRestrictions)} color="mint"/>)}
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Button type="submit" disabled={loadingText || loadingImage} icon={<Sparkles/>}>
              {loadingText ? 'Dreaming it up...' : loadingImage ? 'Making it pretty...' : 'Create My Snack Plate'}
            </Button>
          </div>
        </form>
      </GlassCard>

      <AnimatePresence>
        {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-xl">{error}</p>}
        {board && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-serif text-3xl text-berry-500 mb-3">{board.title}</h2>
                <p className="text-stone-600 mb-4">{board.description}</p>
                <ul className="space-y-2">
                  {board.components.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check size={18} className="text-mint flex-shrink-0"/>
                      <span className="text-stone-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="aspect-square bg-stone-100 rounded-3xl flex items-center justify-center overflow-hidden">
                <AnimatePresence>
                  {loadingImage ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2 text-stone-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-peach-500"></div>
                      <span>Painting a picture...</span>
                    </motion.div>
                  ) : imageUrl ? (
                    <motion.img 
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      src={imageUrl} alt={board.title} className="w-full h-full object-cover" />
                  ) : (
                    <p className="text-stone-500">Image failed to load.</p>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SnackBoardView;
