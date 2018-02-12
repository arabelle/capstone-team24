// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];

let events = JSON.parse(localStorage.getItem('events')) || [];
     
export function configureFakeBackend() {
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(() => {
 
                // authenticate
                if (url.endsWith('/loginapi') && opts.method === 'POST') {
                    // get parameters from post request
                    let params = JSON.parse(opts.body);
 
                    // find if any user matches login credentials
                    let filteredUsers = users.filter(user => {
                        return user.username === params.username && user.password === params.password;
                    });
 
                    if (filteredUsers.length) {
                        // if login details are valid return user details and fake jwt token
                        let user = filteredUsers[0];
                        let responseJson = {
                            id: user.id,
                            username: user.username,
                            name: user.name,
                            phone: user.phone,
                            token: 'fake-jwt-token'
                        };
                        resolve({ ok: true, json: () => responseJson });
                    } else {
                        // else return error
                        reject('Username or password is incorrect');
                    }
 
                    return;
                }
 
                // get users
                if (url.endsWith('/users') && opts.method === 'GET') {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        resolve({ ok: true, json: () => users });
                    } else {
                        // return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }
 
                    return;
                }
 
                // get user by id
                if (url.match(/\/users\/\d+$/) && opts.method === 'GET') {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        let urlParts = url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        let matchedUsers = users.filter(user => { return user.id === id; });
                        let user = matchedUsers.length ? matchedUsers[0] : null;
 
                        // respond 200 OK with user
                        resolve({ ok: true, json: () => user});
                    } else {
                        // return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }
 
                    return;
                }
 
                // register user
                if (url.endsWith('/registerapi') && opts.method === 'POST') {
                    // get new user object from post body
                    let newUser = JSON.parse(opts.body);
 
                    // validation
                    let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                    if (duplicateUser) {
                        reject('Username "' + newUser.username + '" is already taken');
                        return;
                    }
 
                    // save new user
                    newUser.id = Math.max(...users.map(user => user.id)) + 1;
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));
 
                    // respond 200 OK
                    resolve({ ok: true, json: () => ({}) });
 
                    return;
                }

                 // get events
                if (url.endsWith('/eventsapi') && opts.method === 'GET') {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        resolve({ ok: true, json: () => events });
                    } else {
                        // return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }
 
                    return;
                }

                 
                // add event
                if (url.endsWith('/eventsapi') && opts.method === 'POST') {
                    // get new user object from post body
                    let newEvent = JSON.parse(opts.body);
 
                    // validation
                    let duplicateEvent = users.filter(event => { return (event.text === newEvent.text && event.link === newEvent.link) ; }).length;
                    if (duplicateEvent) {
                        reject('Event text: "' + newEvent.text + '"and URL are already used');
                        return;
                    }
 
                    // save new user
                    newEvent.id = Math.max(...events.map(event => event.id)) + 1 || 0;
                    events.push(newEvent);
                    localStorage.setItem('events', JSON.stringify(events));
 
                    // respond 200 OK
                    resolve({ ok: true, json: () => ({}) });
 
                    return;
                }

                // change settings
                if (url.endsWith('/users/settings') && opts.method === 'POST') {
                    // get new user object from post body
                    let changeUser = JSON.parse(opts.body);
 
                    // validation
                    let duplicateUser = users.filter(user => { return user.username === changeUser.username; });
                    if (!duplicateUser.length) {
                        reject('Username "' + changeUser.username + '" can\'t be altered');
                        return;
                    }
 
                    // update user
                    if(changeUser.settings.name)
                        duplicateUser[0].name = changeUser.name;
                    if(changeUser.settings.phone)
                        duplicateUser[0].phone = changeUser.phone;
                    if(changeUser.settings.frequency)
                        duplicateUser[0].frequency = changeUser.frequency;
                    if(changeUser.settings.password)
                        duplicateUser[0].password = changeUser.password;
                    localStorage.setItem('users', JSON.stringify(users));
                    // respond 200 OK
                    resolve({ ok: true, json: () => ({}) });
 
                    return;
                }
 
                // delete user
                if (url.match(/\/users\/\d+$/) && opts.method === 'DELETE') {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        let urlParts = url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        for (let i = 0; i < users.length; i++) {
                            let user = users[i];
                            if (user.id === id) {
                                // delete user
                                users.splice(i, 1);
                                localStorage.setItem('users', JSON.stringify(users));
                                break;
                            }
                        }
 
                        // respond 200 OK
                        resolve({ ok: true, json: () => ({}) });
                    } else {
                        // return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }
 
                    return;
                }
 
                // pass through any requests not handled above
                realFetch(url, opts).then(response => resolve(response));
 
            }, 500);
        });
    }
}