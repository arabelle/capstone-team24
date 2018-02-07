import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
 
import { history } from './helpers';
import { alertActions } from './actions';
import { RouteLogin } from './components';
import { HomePage } from './HomePage';
import { AdminPage } from './AdminPage';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { SettingsPage } from './SettingsPage';
 
class App extends React.Component {
    constructor(props) {
        super(props);
 
        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }
 
    render() {
        const { alert } = this.props;
        return (
            <div className="jumbotron">
                <div className="container">
                    <div className="col-sm-8 col-sm-offset-2">
                        {alert.message &&
                            <div className={`alert ${alert.type}`}></div>
                        }
                        <Router history={history}>
                            <div>
                                <Route path="/" component={HomePage} />
                                <RouteLogin exact path="/settings" component={SettingsPage}/>
                                <RouteLogin exact path="/suggestions" component={HomePage}/>
                                <RouteLogin path="/admin" component = {AdminPage} />
                                <Route path="/login" component={LoginPage} />
                                <Route path="/register" component={RegisterPage} />
                            </div>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}
 
function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}
 
const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App };