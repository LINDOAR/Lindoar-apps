
export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  stats: {
    calories: number;
    prepTime: string;
  };
  benefits: {
    hormone: string;
    mood: string;
    symptomRelief: string;
  };
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  energyLevel: number; // 1-10
  sleepQuality: number; // 1-5
  waterIntake: number;
  symptoms: string[];
  notes?: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  category: 'routine' | 'meal' | 'work' | 'movement' | 'rest';
  startTime: number; // minutes from midnight
  duration: number; // minutes
  isFixed: boolean;
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}
