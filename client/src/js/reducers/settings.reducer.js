import { userConstants } from '../constants';
 
export function changeSettings(state = {}, action) {
  switch (action.type) {
    case userConstants.SETTINGS_REQUEST:
        return {
            changing: true
        };
    case userConstants.SETTINGS_SUCCESS:
        return {
            changing: false
        };
    case userConstants.SETTINGS_FAILURE:
        return {

        };
    default:
      return state
  }
}