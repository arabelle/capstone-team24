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
                {!loggedIn&& 
                    <Link to="/login">Login </Link>
                }
                {loggedIn && <Link to="/suggestions">Suggestions</Link>}
                {loggedIn && <Link to="/settings"><FontIcon className="material-icons" color="#f2f2f2" hoverColor="black">settings</FontIcon></Link>}
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