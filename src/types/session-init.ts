export interface SessionInit {
  player_name?: string;
  preferred_language: string;
  debug?: boolean;
  [key: string]: unknown;
}
