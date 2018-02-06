import React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';
import styles from '../../css/index.css';
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
        var {loggedIn} = this.props;
        return (
            <div className="topnav" id="myTopnav">
                <a href="#home">Home</a>
                <a href="#events">Events</a>
                <a href="#contact">What Others Are Saying</a>
                <a href="#about">About</a>
                {!loggedIn&& 
                    <Link to="/login">Login </Link>
                }
                {loggedIn && <a href="#suggestions">Suggestions</a>}
                {loggedIn && <a href="#settings">Settings</a>}
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