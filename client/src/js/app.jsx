import React from 'react';
import {render} from 'react-dom';
import {Navbar} from './navbar.jsx';
import styles from '../css/index.css';

export class Header extends React.Component {
  render () {
      return(
      <div>
        <Navbar/>
        <h1 className="bellRings"> Why is the Bell Ringing? </h1>
      </div>
      );
    }
  }
