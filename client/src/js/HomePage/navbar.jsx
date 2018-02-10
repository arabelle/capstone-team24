import React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';
import styles from '../../css/index.css';
import { connect } from 'react-redux';
import { userActions } from '../actions';
import FontIcon from 'material-ui/FontIcon';

class Navbar extends React.Component {

    constructor(props) {
        super(props);
     }

     onItemClick(){
        this.props.dispatch(userActions.logout());
     }

    render() {
        var {loggedIn} = this.props;
        return (
            <div className="topnav" id="myTopnav">
                <Link to="/">Home</Link>
                <Link to="/events">Events</Link>
                {!loggedIn&& 
                    <Link to="/login">Login </Link>
                }
                {loggedIn && <Link to="/suggestions">Suggestions</Link>}
                {loggedIn && <Link to="/settings">Settings</Link>}
                {
                    loggedIn &&
                    <Link to="/" onClick={this.onItemClick}>Logout</Link>
                }
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { loggedIn } = state.authentication;
    return {
        loggedIn
    };
}

const connectedNavBar = connect(mapStateToProps)(Navbar);
export { connectedNavBar as Navbar };