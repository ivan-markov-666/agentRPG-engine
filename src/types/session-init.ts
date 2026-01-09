export interface SessionInit {
  player_name: string;
  player_gender: 'male' | 'female' | 'nonbinary' | 'custom';
  player_gender_custom?: string;
  preferred_language: string;
  debug?: boolean;
  [key: string]: unknown;
}
