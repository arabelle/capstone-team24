import { authHeader , authHeaderJson} from '../helpers';
 
export const userService = {
    login,
    logout,
    register,
    changeSettings,
    getAll,
    getById,
    ringBell,
    delete: _delete
};

function changeSettings(user){
    const requestOptions = {
        method: 'PUT',
        headers: authHeaderJson(),
        body: JSON.stringify(user)
    };

    return fetch('/users/' + user.id, requestOptions).then(handleResponse);

}
 
function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };
 
    return fetch('/loginapi', requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }
            return response.json(); 
        })
}
 
function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch('/users', requestOptions).then(handleResponse);
}

function getById(userid) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
 
    return fetch('/users/' + userid, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };
 
    return fetch('/registerapi', requestOptions).then(handleResponse);
}

function ringBell() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    }

    return fetch('/bell', requestOptions).then(handleResponse);
}
 
// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };
 
    return fetch('/users/' + id, requestOptions).then(handleResponse);
}
 
function handleResponse(response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}