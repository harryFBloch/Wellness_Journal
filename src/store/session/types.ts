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
  dateCompleted: number;
  sessionStarted: boolean;
  sessionFinished: boolean;
  id: number;
}

export type History = {[id: number]: Session};

export interface Sessions {
  current: Session
  history: History;
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
  dateCompleted: Date.now(),
  sessionStarted: false,
  sessionFinished: false,
  id: -1,
}

export type SessionAction = 
  { type: ActionType.CREATE_SESSION, session: Session} |
  { type: ActionType.CREATE_JOURNAL, current: Session} |
  { type: ActionType.START_SESSION } | 
  { type: ActionType.FINISH_SESSION } |
  { type: ActionType.GET_SESSIONS, history: History } |
  { type: ActionType.CREATE_MOOD, current: Session}
  