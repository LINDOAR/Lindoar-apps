
import { ScheduleEvent } from '../types';

export const formatTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60) % 24;
  const m = Math.round(minutes % 60);
  const hours = h % 12 === 0 ? 12 : h % 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${String(hours).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
};

export const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};


export const recalculateSchedule = (events: ScheduleEvent[], newWakeUpTime: number): ScheduleEvent[] => {
  const sortedEvents = [...events].sort((a, b) => a.startTime - b.startTime);
  const wakeUpEventIndex = sortedEvents.findIndex(e => e.id === 'wake-up');

  if (wakeUpEventIndex === -1) return events;

  const newEvents = [...sortedEvents];
  newEvents[wakeUpEventIndex] = { ...newEvents[wakeUpEventIndex], startTime: newWakeUpTime };

  for (let i = wakeUpEventIndex + 1; i < newEvents.length; i++) {
    if (!newEvents[i].isFixed) {
      const prevEvent = newEvents[i - 1];
      const prevEventEndTime = prevEvent.startTime + prevEvent.duration;
      newEvents[i] = { ...newEvents[i], startTime: prevEventEndTime };
    }
  }

  return newEvents;
};
