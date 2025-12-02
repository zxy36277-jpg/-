export type Language = 'en' | 'zh';

export interface ScriptScore {
  relevance: number;
  creativity: number;
  feedback: string;
}

export interface ScriptSegment {
  id: number;
  duration: string;
  sceneContent: string;
  imagePrompt: string;
  videoPrompt: string;
}

export enum AppStep {
  INPUT_IDEA = 'INPUT_IDEA',
  GENERATING_SCRIPT = 'GENERATING_SCRIPT',
  REVIEW_SCRIPT = 'REVIEW_SCRIPT',
  SCORE_PREVIEW = 'SCORE_PREVIEW',
  ANALYZING = 'ANALYZING',
  FINAL_OUTPUT = 'FINAL_OUTPUT',
}

export interface AppState {
  step: AppStep;
  language: Language;
  userIdea: string;
  currentScript: string;
  score: ScriptScore | null;
  segments: ScriptSegment[];
  error: string | null;
}