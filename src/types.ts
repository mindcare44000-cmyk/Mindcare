export interface UserProfile {
  name: string;
  email: string;
  isRegistered: boolean;
  isOnboarded: boolean;
  premium: boolean;
  streak: number;
  badges: string[];
  notificationsEnabled: boolean;
  gdprAccepted: boolean;
}

export interface OnboardingAnswers {
  name: string;
  goal: string;
  moral: string;
  stressReaction: string;
  meditates: string;
  sleepQuality: string;
  reminderTime: string;
  peaceDisturber: string;
  mindyAgreement: string;
}

export interface CheckInRecord {
  id: string;
  date: string; // YYYY-MM-DD
  mood: number; // 1 to 5 (1: Très mauvaise, 5: Excellente)
  pressure: string; // "Faible" | "Modérée" | "Élevée"
  energy: string; // "Vide" | "Modérée" | "Pleine"
  notes: string; // Free text
  aiSummary?: string; // AI generated text
}

export interface ChatMessage {
  id: string;
  sender: "user" | "mindy" | "system";
  text: string;
  timestamp: string;
}

export interface Exercise {
  id: string;
  title: string;
  duration: string;
  description: string;
  category: "Respiration" | "Visualisation" | "Ancrage" | "Corps" | "Écriture";
  difficulty: "Facile" | "Intermédiaire" | "Avancé";
  path: string;
}
