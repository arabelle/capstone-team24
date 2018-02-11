import { userConstants } from '../constants';
import { userService } from '../services';
import { alertActions } from './';
import { history } from '../helpers';

let events = JSON.parse(localStorage.getItem('events')) || [];
 
export const userActions = {
    login,
    logout,
    changeSettings,
    displaySuggestions,
    register,
    addEvent,
    getAll,
    ringBell,
    delete: _delete
};

function addEvent(event){
    return dispatch => {
        dispatch(request(event));
 
        userService.addEvent(event)
            .then(
                event => {
                    events.push(event);
                    localStorage.setItem('events', JSON.stringify(events));
                    dispatch(success(event));
                    history.push('/');
                    dispatch(alertActions.success('Add Event successful'));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };
 
    function request(event) { return { type: userConstants.ADDEVENT_REQUEST, event } }
    function success(event) { return { type: userConstants.ADDEVENT_SUCCESS, event } }
    function failure(error) { return { type: userConstants.ADDEVENT_FAILURE, error } }
}

function changeSettings(user){
    return dispatch => {
        dispatch(request(user));
 
        userService.changeSettings(user)
            .then(
                user => {
                    localStorage.setItem('user', JSON.stringify(user));
                    dispatch(success(user));
                    history.push('/');
                    dispatch(alertActions.success('Settings changed'));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };
 
    function request(user) { return { type: userConstants.SETTINGS_REQUEST, user } }
    function success(user) { return { type: userConstants.SETTINGS_SUCCESS, user } }
    function failure(error) { return { type: userConstants.SETTINGS_FAILURE, error } }
}
 
function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));
 
        userService.login(username, password)
            .then(
                user => {
                    localStorage.setItem('user', JSON.stringify(user));
                    dispatch(success(user));
                    history.push('/admin');
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };
 
    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}
 
function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function displaySuggestions() {
    userService.displaySuggestions();
    return { type: userConstants.SUGGESTIONS };
}
 
function register(user) {
    return dispatch => {
        dispatch(request(user));
 
        userService.register(user)
            .then(
                user => {
                    dispatch(success());
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };
 
    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}
 
function getAll() {
    return dispatch => {
        dispatch(request());
 
        userService.getAll()
            .then(
                users => {
                    dispatch(success(users));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error))
                }
            );
    };
 
    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}
 
function ringBell() {
    return dispatch => {
        dispatch(request());
 
        userService.ringBell()
            .then(
                res => {
                    dispatch(success());
                    history.push('/admin');
                    dispatch(alertActions.success('Ring bell was successful'));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error))
                }
            );
    };
 
    function request() { return { type: userConstants.BELL_REQUEST } }
    function success(res) { return { type: userConstants.BELL_SUCCESS, res } }
    function failure(error) { return { type: userConstants.BELL_FAILURE, error } }
}

/*function getById(userid){
    return dispatch => {
        dispatch(request(userid));
 
        userService.getById(userid)
            .then(
                user => {
                    localStorage.setItem('user', JSON.stringify(user));
                    dispatch(success(user));
                    history.push('/settings');
                    dispatch(alertActions.success('Got user'));

                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };
 
    function request(userid) { return { type: userConstants.SETTINGS_REQUEST, user } }
    function success(userid) { return { type: userConstants.SETTINGS_SUCCESS, user } }
    function failure(error) { return { type: userConstants.SETTINGS_FAILURE, error } }
}*/

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));
 
        userService.delete(id)
            .then(
                user => {
                    dispatch(success(id));
                },
                error => {
                    dispatch(failure(id, error));
                }
            );
    };
 
    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}