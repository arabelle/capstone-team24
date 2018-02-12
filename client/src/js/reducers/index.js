import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import { alert } from './alerts.reducer';
import { addEvent, events } from './events.reducer';
import { changeSettings } from './settings.reducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  changeSettings,
  addEvent,
  events,
  users,
  alert
});

export default rootReducer;