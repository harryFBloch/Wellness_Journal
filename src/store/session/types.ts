import { ActionType } from '../actionTypes';

export type Mood = {
  anxiety: number;
  stress: number;
  happiness: number;
}

export interface Session {
  beforeMood: Mood;
  afterMood: Mood;
  beforeJournal: string;
  afterJournal: string;
  sessionTime: number;
  dateCompleted: string;
  sessionStarted: boolean;
  sessionFinished: boolean;
}

export interface Sessions {
  current: Session
  history: {[id: number]: Session};
}

export const MoodTemplate: Mood = {
  anxiety: 0,
  stress: 0,
  happiness: 0
}

export const SessionTemplate: Session = {
  beforeMood: {...MoodTemplate},
  afterMood: {...MoodTemplate},
  beforeJournal: '',
  afterJournal: '',
  sessionTime: 0,
  dateCompleted: '',
  sessionStarted: false,
  sessionFinished: false,
}

export type SessionAction = 
  { type: ActionType.CREATE_SESSION, session: Session} |
  { type: ActionType.CREATE_JOURNAL, current: Session} |
  { type: ActionType.START_SESSION }
  