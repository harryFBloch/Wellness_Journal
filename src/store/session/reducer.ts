import { ActionType } from "../actionTypes";
import { Sessions, SessionTemplate } from "./types";
import { RootAction } from "..";

const initialState: Sessions = {
  current: {...SessionTemplate},
  history: {}
};

export default function auth(state=initialState, action: RootAction): typeof initialState  {
  switch (action.type) {

    case (ActionType.CREATE_SESSION):
      return {...state, current: {...action.session}};

    case (ActionType.CREATE_JOURNAL):
      return {...state, current: {...action.current}}
    
    case (ActionType.START_SESSION):
      return {...state, current: {...state.current, sessionStarted: true}}

    default:
      return state;
  }
}