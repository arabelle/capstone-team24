import React from 'react';
import {render} from 'react-dom';
import styles from '../css/index.css';

var event = "Canucks Win";

export class Header extends React.Component {
  
  render () {
      return(
      <div>
        <h1 id="event"> Why is the Bell Ringing? </h1>
        <h2 class="mainEvent"> {event} </h2>
      </div>
      );
    }
  }