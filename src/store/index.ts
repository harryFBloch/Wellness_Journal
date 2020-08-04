import { StateType } from 'typesafe-actions';
import rootReducer from './root-reducer';
import * as flagActions from './flags/actions';
import { FlagsAction } from './flags/types';
import * as authActions from './auth/actions';
import { AuthAction } from './auth/types';
import * as sessionActions from './session/actions';
import { SessionAction } from './session/types';


export { default } from './store';
export { default as rootReducer } from './root-reducer';

export const actions = {
  flags: flagActions,
  auth: authActions,
  sessions: sessionActions,
};

export * from './types';
export * from './flags/types';
export * from './auth/types';
export * from './session/types';

export type RootAction = FlagsAction | AuthAction | SessionAction; 
export type RootState = StateType<typeof rootReducer>;