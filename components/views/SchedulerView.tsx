
import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { ScheduleEvent } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { formatTime, recalculateSchedule, timeToMinutes, minutesToTime } from '../../utils/schedulerUtils';
import { CATEGORY_COLORS } from '../../constants';
import { Lock, Unlock, GripVertical, Clock, Moon } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const initialEvents: ScheduleEvent[] = [
  { id: 'wake-up', title: 'Wake Up & Shine', category: 'routine', startTime: 420, duration: 30, isFixed: false },
  { id: 'breakfast', title: 'Nourishing Breakfast', category: 'meal', startTime: 450, duration: 45, isFixed: false },
  { id: 'movement', title: 'Gentle Movement', category: 'movement', startTime: 495, duration: 30, isFixed: false },
  { id: 'deep-work', title: 'Deep Work Block', category: 'work', startTime: 525, duration: 120, isFixed: false },
  { id: 'lunch', title: 'Mindful Lunch', category: 'meal', startTime: 645, duration: 60, isFixed: false },
  { id: 'rest', title: 'Creative Rest', category: 'rest', startTime: 705, duration: 45, isFixed: false },
  { id: 'afternoon-snack', title: 'Energizing Snack', category: 'meal', startTime: 900, duration: 15, isFixed: false },
  { id: 'dinner', title: 'Delicious Dinner', category: 'meal', startTime: 1080, duration: 60, isFixed: false },
  { id: 'wind-down', title: 'Wind Down Ritual', category: 'routine', startTime: 1260, duration: 60, isFixed: false },
];

const SchedulerView: React.FC = () => {
  const [events, setEvents] = useLocalStorage<ScheduleEvent[]>('bellybites_schedule', initialEvents);
  const [wakeUpTime, setWakeUpTime] = useState(minutesToTime(events.find(e => e.id === 'wake-up')?.startTime || 420));
  const [fasting, setFasting] = useState(false);
  
  useEffect(() => {
    const newMinutes = timeToMinutes(wakeUpTime);
    const updatedEvents = recalculateSchedule(events, newMinutes);
    setEvents(updatedEvents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wakeUpTime]);

  const handleReorder = (newOrder: ScheduleEvent[]) => {
    const newWakeUp = newOrder.find(e => e.id === 'wake-up');
    if (newWakeUp) {
      setEvents(recalculateSchedule(newOrder, newWakeUp.startTime));
    }
  };

  const toggleFixed = (id: string) => {
    setEvents(events.map(e => e.id === id ? { ...e, isFixed: !e.isFixed } : e));
  };
  
  const fastingWindowStart = timeToMinutes(wakeUpTime) + 12 * 60;

  return (
    <GlassCard className="max-w-3xl mx-auto">
      <h1 className="font-serif text-4xl text-center text-berry-500 mb-2">Plan Your Flow</h1>
      <p className="text-center text-stone-600 mb-8">Adjust your wake-up time, and watch your day magically rearrange itself. Drag to reorder your priorities.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-stone-100/50 rounded-3xl">
        <div className="space-y-2">
            <label htmlFor="wake-up-time" className="flex items-center gap-2 font-semibold text-stone-700">
                <Clock size={18} /> Wake Up Time
            </label>
            <input
                id="wake-up-time"
                type="time"
                value={wakeUpTime}
                onChange={e => setWakeUpTime(e.target.value)}
                className="w-full px-4 py-2 bg-white border-2 border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-berry-500"
            />
        </div>
        <div className="flex items-center justify-center">
            <button onClick={() => setFasting(!fasting)} className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border-2 border-stone-200 font-semibold text-stone-700">
                <Moon size={18} /> Intermittent Fasting
                <div className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${fasting ? 'bg-mint' : 'bg-stone-300'}`}>
                    <motion.div layout className={`w-5 h-5 bg-white rounded-full`} style={{marginLeft: fasting ? 'auto' : '0'}}/>
                </div>
            </button>
        </div>
      </div>
      
      <Reorder.Group axis="y" values={events} onReorder={handleReorder} className="space-y-3">
        {events.map(event => (
          <Reorder.Item key={event.id} value={event} dragListener={event.id !== 'wake-up'}>
            <div className="flex items-center gap-3">
              {event.id !== 'wake-up' && (
                <div className="text-stone-400 cursor-grab active:cursor-grabbing">
                  <GripVertical size={20} />
                </div>
              )}
               {event.id === 'wake-up' && (
                <div className="w-5"></div>
              )}
              <div className={`flex-1 flex items-center justify-between p-4 rounded-2xl border-2 ${CATEGORY_COLORS[event.category]}`}>
                  <div className="flex flex-col">
                      <span className="font-bold">{event.title}</span>
                      <span className="text-sm">{formatTime(event.startTime)} - {formatTime(event.startTime + event.duration)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {fasting && (event.startTime >= fastingWindowStart || event.category === 'meal') && (
                        <div className={`w-3 h-3 rounded-full ${event.startTime < fastingWindowStart ? 'bg-mint' : 'bg-peach'}`} title={event.startTime < fastingWindowStart ? 'Eating Window' : 'Fasting Window'} />
                    )}
                    {event.id !== 'wake-up' && (
                      <button onClick={() => toggleFixed(event.id)} className="p-2 rounded-full hover:bg-white/50">
                        {event.isFixed ? <Lock size={18}/> : <Unlock size={18}/>}
                      </button>
                    )}
                  </div>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </GlassCard>
  );
};

export default SchedulerView;
