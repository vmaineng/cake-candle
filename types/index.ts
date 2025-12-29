export interface Accomplishment { 
    id: string;
    text: string;
    category: AccomplishmentCategory;
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
    height: number;
    color: string;
    position: { x: number; y: number; };
    flameIntensity: number;
    isLit: boolean;
    decorations: string[];
    createdAt: Date;
  }