import { ThunkResult, ThunkDispatchType } from "../types";
import firebase from '../../config/FirebaseConfig';
import 'firebase/database';
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

export const addMood = (mood: Mood): ThunkResult<Promise<void>> =>
async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
  const current = {...getState().sessions.current}
  if (current.sessionStarted){
    current.afterMood = mood;
  } else {
    current.beforeMood = mood;
  }
  dispatch({ type: ActionType.CREATE_MOOD, current: current})
}

export const startSession = (): ThunkResult<Promise<void>> =>
  async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<void> => {
    dispatch({ type: ActionType.START_SESSION })
}

export const finishSession = (): ThunkResult<Promise<number>> =>
  async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<number> => {
    dispatch({ type: ActionType.FINISH_SESSION })
    const newSession = {...getState().sessions.history[Object.keys(getState().sessions.history).length - 1]}
    return firebase.database().ref(`/users/${getState().auth.uid}/sessions/${newSession.id}/`).set(newSession)
    .then(() => {
      return Promise.resolve(newSession.id);
    })
    .catch((error) => Promise.reject())
}

export const getSessionHistory = (): ThunkResult<Promise<boolean>> =>
  async ( dispatch: ThunkDispatchType, getState: () => RootState ): Promise<boolean> => {
    return firebase.database().ref(`/users/${getState().auth.uid}/sessions/`).once('value')
    .then((snapshot) => {
      dispatch({ type: ActionType.GET_SESSIONS, history: snapshot.val() })
      if (snapshot.val()) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    }) 
    .catch(() => Promise.reject(false))
}

export const getRandomQuote = (): Promise<{quote: string, author: string}> => {
  return firebase.database().ref(`/quotes/${Math.floor(Math.random() * 29)}`).once('value')
  .then((snapshot) => {
    const data = snapshot.val().split('%')
    return Promise.resolve({quote: data[0], author: data[1]})
  })
  .catch(() => Promise.reject({quote: '', auth: ''}))
}

export const getRandomPrompt = (): Promise<string> => {
  return firebase.database().ref(`/prompts/${Math.floor(Math.random() * 29)}`).once('value')
  .then((snapshot) => Promise.resolve(snapshot.val()))
}

// const getRandomInt = (max: number): number => {
//   return Math.floor(Math.random() * Math.floor(max));
// }

// export const createRandomMood = (low: boolean): Mood => {
//   const highNumber = low ? 5 : 10
//   return {anxiety: getRandomInt(highNumber), stress: getRandomInt(highNumber), happiness: getRandomInt(highNumber)}
// }


// export const createDummyData = (): void => {
//   const dummyHistory = {} as History
//   for(let i = 0; i < 20; i++){
//     const session = {...SessionTemplate}
//     session.beforeMood = createRandomMood(true)
//     session.afterMood = createRandomMood(false)
//     session.beforeJournal = "Lorem elipsom Lorem elipsom Lorem elipsom Lorem elipsom Lorem elipsom"
//     session.afterJournal = "Lorem elipsom Lorem elipsom Lorem elipsom Lorem elipsom Lorem elipsom"
//     session.id = i
//     session.dateCompleted = new Date().setDate(new Date().getDate() - i)
//     dummyHistory[i] = session;
//   }
//   firebase.database().ref(`/users/mFnKWe8laNgmgjLU9GN8WbXcZnJ3/sessions/`).set(dummyHistory)
//   .then(() => {
//     console.log('set')
//   })
// }