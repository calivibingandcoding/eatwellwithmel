export interface User {
  id: string;
  email: string;
  role: 'clinician' | 'patient';
  name: string;
  createdAt: Date;
}

export interface Patient extends User {
  role: 'patient';
  clinicianId: string;
  accessCode: string;
  age?: number;
  sex?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  notes?: string;
}

export interface Clinician extends User {
  role: 'clinician';
  patients: string[];
}

export interface FoodEntry {
  id: string;
  userId: string;
  foodItem: string;
  brandName?: string;
  portion: string;
  timestamp: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  customFood?: boolean;
}

export interface DrinkEntry {
  id: string;
  userId: string;
  drinkItem: string;
  brandName?: string;
  amount: string;
  timestamp: Date;
  customDrink?: boolean;
}

export interface SupplementEntry {
  id: string;
  userId: string;
  supplementName: string;
  dose: string;
  timestamp: Date;
}

export interface ExerciseEntry {
  id: string;
  userId: string;
  activityType: string;
  duration: number;
  timestamp: Date;
}

export interface WellnessEntry {
  id: string;
  userId: string;
  type: 'sleep' | 'stress' | 'energy' | 'mood';
  rating: number; // 1-10 scale
  duration?: number;
  timestamp: Date;
  notes?: string;
}

export interface SymptomEntry {
  id: string;
  userId: string;
  symptomType: 'pain' | 'bloating' | 'gas' | 'urgency' | 'fatigue' | 'other';
  severity: number; // 1-10 scale
  duration?: number;
  timestamp: Date;
  customSymptom?: string;
}

export interface BowelMovementEntry {
  id: string;
  userId: string;
  bristolType: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  timestamp: Date;
  notes?: string;
}

export interface CustomLibraryItem {
  id: string;
  userId: string;
  type: 'food' | 'drink' | 'supplement' | 'exercise';
  name: string;
  isFavorite: boolean;
  createdAt: Date;
}

export interface TriggerCorrelation {
  item: string;
  itemType: 'food' | 'drink';
  symptom: string;
  correlationPercentage: number;
  occurrences: number;
  totalExposures: number;
  averageSeverity?: number;
}

export interface Report {
  id: string;
  userId: string;
  type: 'triggers' | 'trends' | 'summary';
  dateRange: {
    start: Date;
    end: Date;
  };
  data: any;
  generatedAt: Date;
}

export const BristolStoolChart = {
  1: 'Separate hard lumps (very constipated)',
  2: 'Lumpy and sausage-like (slightly constipated)',
  3: 'Sausage shape with cracks on surface (normal)',
  4: 'Smooth, soft sausage or snake (normal)',
  5: 'Soft blobs with clear-cut edges (lacking fiber)',
  6: 'Mushy consistency with ragged edges (mild diarrhea)',
  7: 'Liquid consistency with no solid pieces (severe diarrhea)'
} as const;

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithCode: (accessCode: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  timestamp: Date;
  type: 'food' | 'drink' | 'supplement' | 'exercise' | 'wellness' | 'symptom' | 'bowel_movement';
  data: FoodEntry | DrinkEntry | SupplementEntry | ExerciseEntry | WellnessEntry | SymptomEntry | BowelMovementEntry;
}