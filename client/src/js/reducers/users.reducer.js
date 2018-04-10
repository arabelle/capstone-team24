import { userConstants, eventConstants } from '../constants';
 
export function users(state = {}, action) {
  switch (action.type) {
    case userConstants.SUGGESTIONS:{
      return state
    };
    case userConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case userConstants.GETALL_SUCCESS:
      return {
        items: action.users
      };
    case userConstants.GETALL_FAILURE:
      return {
        error: action.error
      };
    case userConstants.DELETE_REQUEST:
      // add 'deleting:true' property to user being deleted
      return {
        ...state,
        items: state.items.map(user =>
          user.id === action.id
            ? { ...user, deleting: true }
            : user
        )
      };
    case userConstants.DELETE_SUCCESS:
      // remove deleted user from state
      return {
        items: state.items.filter(user => user.id !== action.id)
      };
    case userConstants.DELETE_FAILURE:
      // remove 'deleting:true' property and add 'deleteError:[error]' property to user
      return {
        ...state,
        items: state.items.map(user => {
          if (user.id === action.id) {
            // make copy of user without 'deleting:true' property
            const { deleting, ...userCopy } = user;
            // return copy of user with 'deleteError:[error]' property
            return { ...userCopy, deleteError: action.error };
          }
 
          return user;
        })
      };
      case userConstants.DELETEEVENT_REQUEST:
      // add 'deleting:true' property to user being deleted
      return {
        ...state,
        items: state.items.map(event =>
          event.id === action.id
            ? { ...event, deleting: true }
            : event
        )
      };
    case userConstants.DELETEEVENT_SUCCESS:
      // remove deleted user from state
      return {
        items: state.items.filter(event => event.id !== action.id)
      };
    case userConstants.DELETEEVENT_FAILURE:
      // remove 'deleting:true' property and add 'deleteError:[error]' property to user
      return {
        ...state,
        items: state.items.map(event => {
          if (event.id === action.id) {
            // make copy of user without 'deleting:true' property
            const { deleting, ...eventCopy } = event;
            // return copy of user with 'deleteError:[error]' property
            return { ...eventCopy, deleteError: action.error };
          }
 
          return event;
        })
      };
    default:
      return state
  }
}