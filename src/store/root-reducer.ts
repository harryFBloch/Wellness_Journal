import { combineReducers } from 'redux';
import flags from './flags/reducer';
import auth from './auth/reducer';
import sessions from './session/reducer'

const rootReducer = combineReducers({
  flags,
  auth,
  sessions,
});

export default rootReducer;