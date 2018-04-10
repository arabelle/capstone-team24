import React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';
import styles from '../../css/index.scss';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react'
import { userActions } from '../actions';

class Navbar extends React.Component {

    constructor(props) {
        super(props);
     }

     onItemClick(){
        this.props.dispatch(userActions.logout());
     }
     render () {
        var {loggedIn,user} = this.props;
          return(
              <Menu inverted fixed="top" fluid>
                   <Menu.Item name="The Bellkin"/>
                    <Menu.Menu position='right'>
                    <Menu.Item>
                    {loggedIn && <Link to="/admin">Home</Link>}
                   {!loggedIn && <Link to="/">Home</Link>}
                   </Menu.Item>
                   <Menu.Item>
                   <Link to="/">Events</Link>
                   </Menu.Item>
                   {!loggedIn&& 
                   <Menu.Item>                   
                       <Link to="/login">Login </Link>
                   </Menu.Item>                       
                   }
                   {loggedIn && user.admin && <Menu.Item> <Link to="/suggestions">Suggestions</Link> </Menu.Item>}
                   {loggedIn && <Menu.Item><Link to="/settings">Settings</Link></Menu.Item>}
                   {
                       loggedIn &&
                       <Menu.Item><Link to="/" onClick={this.onItemClick}>Logout</Link></Menu.Item>
                   }
                    </Menu.Menu>
              </Menu>
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