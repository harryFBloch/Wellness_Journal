import { ThunkResult, ThunkDispatchType } from "../types";
import { ActionType } from "../actionTypes";
import { RootState } from "..";
import { Mood } from "./types";


export const createSession = (mood: Mood, sessionTime: number): ThunkResult<Promise<void>> =>
  async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
    const current = {...getState().sessions.current}
    current.beforeMood = mood;
    current.sessionTime = sessionTime;
    dispatch({ type: ActionType.CREATE_SESSION, session: current})
}

export const addJournal = (journal: string): ThunkResult<Promise<void>> =>
  async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
    const current = {...getState().sessions.current}
    if (current.sessionStarted){
      current.afterJournal = journal;
    } else {
      current.beforeJournal = journal;
    }
    dispatch({ type: ActionType.CREATE_JOURNAL, current: current})
}

export const startSession = (): ThunkResult<Promise<void>> =>
  async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
    dispatch({ type: ActionType.START_SESSION })
}
