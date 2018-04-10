import React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';
import styles from '../../css/index.scss';
import { connect } from 'react-redux';
import { userActions } from '../actions';

class Navbar extends React.Component {

    constructor(props) {
        super(props);
     }

     onItemClick(){
        this.props.dispatch(userActions.logout());
     }

    render() {
        var {loggedIn,user} = this.props;
        return (
            <div className="topnav" id="myTopnav">
                {loggedIn && <Link to="/admin">Home</Link>}
                {!loggedIn && <Link to="/">Home</Link>}
                <Link to="/">Events</Link>
                {!loggedIn&& 
                    <Link to="/login">Login </Link>
                }
                {loggedIn && user.admin && <Link to="/suggestions">Suggestions</Link>}
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
    const { loggedIn, user } = state.authentication;
    return {
        loggedIn,
        user
    };
}

const connectedNavBar = connect(mapStateToProps)(Navbar);
export { connectedNavBar as Navbar };