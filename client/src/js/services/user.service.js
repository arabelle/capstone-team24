import { authHeader } from '../helpers';
 
export const userService = {
    login,
    logout,
    register,
    changeSettings,
    getAll,
    getById,
    update,
    delete: _delete
};

function changeSettings(user){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch('/users/settings', requestOptions).then(handleResponse);

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
            return response.json(); //TODO
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
 
    return fetch('/users/', requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
 
    return fetch('/users/' + _id, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };
 
    fetch('/registerapi', requestOptions).then(handleResponse); // TODO check handleResponse
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(user)
    };
 
    return fetch('/users/' + user.id, requestOptions).then(handleResponse);
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