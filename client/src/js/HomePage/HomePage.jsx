import React from 'react';
import { render } from 'react-dom';
import {CrawlerButton} from './crawler.jsx';
import {Navbar} from './navbar.jsx';
import styles from '../../css/index.css';
import { connect } from 'react-redux';
import { userActions } from '../actions';
import { AdminPage } from '../AdminPage';
import { Link } from 'react-router-dom';

//Add EventList below for this to work with Tornado, remove it for npm start
class HomePage extends React.Component {
    
    constructor(props) {
        super(props);
        this.props.dispatch(userActions.logout());
     }
         
    render(){
        var {loggedIn, user} = this.props;
        return(<div className="homePage">
            <Header />
            {loggedIn && user.admin && <Link className="right-corder-container" to='/addEvent'>
            <button className="right-corder-container-button">
                <span className="short-text">+</span>
            </button>
            </Link>}
        </div>);
    }
}

class Header extends React.Component {
  render () {
      return(
      <div className="header" id="home">
        <Navbar/>
        <h1 className="bellRings">The Bell-kin</h1>
      </div>
      );
    }
  }

function mapStateToProps(state) {
    const { loggedIn, user } = state.authentication;
    return {
        loggedIn, user
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };