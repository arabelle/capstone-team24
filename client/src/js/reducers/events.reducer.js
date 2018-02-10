import { userConstants, eventConstants } from '../constants';

 
export function addEvent(state = {}, action) {
  switch (action.type) {
    case userConstants.ADDEVENT_REQUEST:
      return { addingEvent: true };
    case userConstants.ADDEVENT_SUCCESS:
      return {};
    case userConstants.ADDEVENT_FAILURE:
      return {};
    default:
      return state
  }
}

export function events(state ={}, action){
  switch(action.type){
    case eventConstants.GETALL_REQUEST:
    return {
      loading: true
    };
  case eventConstants.GETALL_SUCCESS:
    return {
      items: action.events
    };
  case eventConstants.GETALL_FAILURE:
    return {
      error: action.error
    };
  default:
    return state
}
}