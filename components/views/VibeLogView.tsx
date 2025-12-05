
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyLog } from '../../types';
import { SYMPTOMS } from '../../constants';
import { useAppContext } from '../../context/AppContext';
import Pill from '../ui/Pill';
import Button from '../ui/Button';
import { Droplets, BedDouble, Zap, Plus, Minus, BookOpen } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const getFeedback = (log: Omit<DailyLog, 'date'>): string => {
    if (log.symptoms.includes('Hot Flashes') && log.waterIntake < 8) return "Hot flash alert: hydrate like a queen to stay cool!";
    if (log.energyLevel <= 3) return "Energy is low, gentle soul. Be kind to yourself today. Maybe a cozy nap is in order?";
    if (log.sleepQuality <= 2) return "A rough night's sleep can throw things off. Prioritize rest and calming activities today.";
    if (log.waterIntake >= 10) return "Look at you, hydration champion! Your body thanks you.";
    return "You're doing great. Listening to your body is a superpower!";
};

const VibeLogView: React.FC = () => {
    const { logs, addLog } = useAppContext();
    const [energy, setEnergy] = useState(5);
    const [sleep, setSleep] = useState(3);
    const [water, setWater] = useState(0);
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(false);

    const handleToggleSymptom = (symptom: string) => {
        setSymptoms(prev => prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]);
    };

    const handleSubmit = () => {
        const today = new Date().toISOString().split('T')[0];
        const newLog: DailyLog = {
            date: today,
            energyLevel: energy,
            sleepQuality: sleep,
            waterIntake: water,
            symptoms: symptoms
        };
        addLog(newLog);
        setFeedback(getFeedback(newLog));
        
        // Reset form
        setEnergy(5);
        setSleep(3);
        setWater(0);
        setSymptoms([]);
        
        setTimeout(() => setFeedback(null), 5000);
    };

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <GlassCard>
                <h1 className="font-serif text-4xl text-center text-berry-500 mb-2">Today's Vibe Check</h1>
                <p className="text-center text-stone-600 mb-8">How are you, really? A quick check-in can make all the difference.</p>

                <div className="space-y-6">
                    {/* Energy */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 font-semibold text-stone-700 text-lg"><Zap size={20} className="text-peach-500"/> Energy Level: {energy}/10</label>
                        <input type="range" min="1" max="10" value={energy} onChange={e => setEnergy(parseInt(e.target.value))} className="w-full h-2 bg-peach-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-peach-500" />
                    </div>

                    {/* Sleep */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 font-semibold text-stone-700 text-lg"><BedDouble size={20} className="text-sky-500"/> Sleep Quality: {sleep}/5</label>
                        <input type="range" min="1" max="5" value={sleep} onChange={e => setSleep(parseInt(e.target.value))} className="w-full h-2 bg-sky-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-sky-500" />
                    </div>

                    {/* Water */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 font-semibold text-stone-700 text-lg"><Droplets size={20} className="text-sky-500"/> Water Intake (glasses)</label>
                        <div className="flex items-center justify-center gap-4">
                            <button onClick={() => setWater(w => Math.max(0, w - 1))} className="p-2 bg-stone-200 rounded-full"><Minus size={20}/></button>
                            <span className="text-3xl font-bold w-12 text-center">{water}</span>
                            <button onClick={() => setWater(w => w + 1)} className="p-2 bg-stone-200 rounded-full"><Plus size={20}/></button>
                        </div>
                    </div>
                    
                    {/* Symptoms */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-stone-700">Any symptoms visiting today?</h3>
                        <div className="flex flex-wrap gap-2">
                            {SYMPTOMS.map(symptom => <Pill key={symptom} text={symptom} selected={symptoms.includes(symptom)} onClick={() => handleToggleSymptom(symptom)} color="berry" />)}
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex justify-center">
                    <Button onClick={handleSubmit}>Log It, Girl</Button>
                </div>

                <AnimatePresence>
                    {feedback && (
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="mt-6 text-center text-berry-600 bg-berry-100 p-3 rounded-xl font-semibold"
                        >{feedback}</motion.p>
                    )}
                </AnimatePresence>
            </GlassCard>

            <div className="text-center">
                 <Button onClick={() => setShowHistory(!showHistory)} variant="secondary" icon={<BookOpen />}>
                    {showHistory ? "Hide Past Logs" : "Peek at Past Logs"}
                 </Button>
            </div>
           
            <AnimatePresence>
            {showHistory && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <GlassCard>
                        <h2 className="font-serif text-3xl text-center text-berry-500 mb-6">Your Vibe History</h2>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {logs.length > 0 ? logs.map(log => (
                                <div key={log.date} className="bg-stone-100/50 p-4 rounded-2xl">
                                    <p className="font-bold text-stone-800">{new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-600 mt-2">
                                        <span>Energy: {log.energyLevel}/10</span>
                                        <span>Sleep: {log.sleepQuality}/5</span>
                                        <span>Water: {log.waterIntake} glasses</span>
                                    </div>
                                    {log.symptoms.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {log.symptoms.map(s => <span key={s} className="text-xs bg-berry-100 text-berry-800 px-2 py-1 rounded-full">{s}</span>)}
                                        </div>
                                    )}
                                </div>
                            )) : <p className="text-center text-stone-500">No logs yet. Start tracking to see your history!</p>}
                        </div>
                    </GlassCard>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

export default VibeLogView;
