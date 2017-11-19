import React from 'react';
import {render} from 'react-dom';

var event = "Canucks Win";

export class Header extends React.Component {
  
  render () {
      return(
      <div>
        <h1 class="bellRings"> Why is the Bell Ringing? </h1>
        <h2 class="mainEvent"> {event} </h2>
      </div>
      );
    }
  }