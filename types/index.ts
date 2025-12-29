// types/index.ts
export interface Accomplishment {
  id: string;
  text: string;
  category: AccomplishmentCategory;
  date: Date;
  importance: 1 | 2 | 3 | 4 | 5; // 1=easy win, 5=major achievement
  mood: 'proud' | 'excited' | 'relieved' | 'happy' | 'accomplished';
  tags: string[];
}

export type AccomplishmentCategory = 
  | 'career'
  | 'education' 
  | 'fitness'
  | 'personal'
  | 'creative'
  | 'financial'
  | 'relationship'
  | 'travel'
  | 'health'
  | 'other';

export interface CakeCandle {
  id: string;
  accomplishmentId: string;
  height: number; // Based on importance (30-80px)
  color: string; // Hex color
  position: { x: number; y: number };
  flameIntensity: number; // 0-100
  isLit: boolean;
  decorations: string[]; // stars, sparkles, etc.
  createdAt: Date;
}