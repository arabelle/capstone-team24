import { eventConstants } from '../constants';
import { userService } from '../services';
import { alertActions } from './';
import { history } from '../helpers';
 
export const eventActions = {
    getAllEvents,
};


function getAllEvents() {
    return dispatch => {
        dispatch(request());
 
        userService.getAllEvents()
            .then(
                events => {
                    localStorage.setItem('events', JSON.stringify(events));
                    console.log(JSON.parse(localStorage.getItem('events')));
                    dispatch(success(events));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error))
                }
            );
    };
 
    function request() { return { type: eventConstants.GETALL_REQUEST } }
    function success(events) { return { type: eventConstants.GETALL_SUCCESS, events } }
    function failure(error) { return { type: eventConstants.GETALL_FAILURE, error } }
}