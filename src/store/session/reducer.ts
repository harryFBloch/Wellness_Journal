import { ActionType } from "../actionTypes";
import { Sessions, SessionTemplate } from "./types";
import { RootAction } from "..";

const initialState: Sessions = {
  current: {...SessionTemplate},
  history: {}
};

export default function auth(state=initialState, action: RootAction): typeof initialState  {
  switch (action.type) {

    case (ActionType.GET_SESSIONS):
      return{...state, history: {...action.history}}

    case (ActionType.CREATE_SESSION):
      const current = {...action.session}
      current.id = Object.keys(state.history).length;
      return {...state, current: current};

    case (ActionType.CREATE_JOURNAL):
      return {...state, current: {...action.current}}
    
    case (ActionType.START_SESSION):
      return {...state, current: {...state.current, sessionStarted: true}}

    case (ActionType.FINISH_SESSION):
      const session = {...state.current};
      session.sessionFinished = true;
      session.dateCompleted = Date.now();
      return {history: {...state.history, [session.id]: session}, current: {...SessionTemplate}}
    
      case (ActionType.CREATE_MOOD):
        return {...state, current: action.current}

    default:
      return state;
  }
}