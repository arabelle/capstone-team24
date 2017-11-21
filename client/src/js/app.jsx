import React from 'react';
import {render} from 'react-dom';
import {Navbar} from './navbar.jsx';
import styles from '../css/index.css';

export class Header extends React.Component {
  render () {
      return(
      <div className="header" id="home">
        <Navbar/>
        <h1 className="bellRings">The Bell-kin</h1>
      </div>
      );
    }
  }
