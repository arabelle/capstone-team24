import React from 'react';
import ReactDOM from 'react-dom';

import { render } from 'react-dom';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
 
import { store } from './helpers';
import { App } from './app.jsx';
 
// setup fake backend
//import { configureFakeBackend } from './helpers';
//configureFakeBackend();
 
ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider>
        <App />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('app')
);