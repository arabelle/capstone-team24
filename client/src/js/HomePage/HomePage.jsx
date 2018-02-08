import React from 'react';
import { render } from 'react-dom';
import {CrawlerButton} from './crawler.jsx';
import {Navbar} from './navbar.jsx';
import styles from '../../css/index.css';
import { connect } from 'react-redux';
import { userActions } from '../actions';
import { AdminPage } from '../AdminPage';

//Add EventList below for this to work with Tornado, remove it for npm start
class HomePage extends React.Component {
    
    constructor(props) {
        super(props);
        this.props.dispatch(userActions.logout());
     }
         
    render(){
        var {loggedIn} = this.props;
        return(<div className="homePage">
            <Header />
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
    const { loggedIn } = state.authentication;
    return {
        loggedIn
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };