import React from 'react';
import { render } from 'react-dom';
import { EventsList, MainEvent } from './events.jsx';
import {CrawlerButton} from './crawler.jsx';
import {Navbar} from './navbar.jsx';
import styles from '../../css/index.css';

//Add EventList below for this to work with Tornado, remove it for npm start
export class HomePage extends React.Component {
    render(){
        return(<div>
            <Header />
            <CrawlerButton />
            <MainEvent />
        </div>);
    };
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
