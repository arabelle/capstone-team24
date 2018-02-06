import React from 'react';
import { render } from 'react-dom';
import { EventsList, MainEvent } from './events.jsx';
import {CrawlerButton} from './crawler.jsx';
import {Navbar} from './navbar.jsx';
import styles from '../../css/index.css';
import { connect } from 'react-redux';
import { userActions } from '../actions';

//Add EventList below for this to work with Tornado, remove it for npm start
class HomePage extends React.Component {
    
    constructor(props) {
        super(props);
 
        // reset login status
        this.props.dispatch(userActions.logout());
    }
    
    render(){
        var {loggedIn} = this.props;
        
        if(!loggedIn){
        return(<div>
            <Header />
            <CrawlerButton />
            <MainEvent />
        </div>);
        }
        return(<div></div>)
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