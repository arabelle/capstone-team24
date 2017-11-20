import React from 'react';
import {render} from 'react-dom';

var events = "";

export class Header extends React.Component {
  function set_events(val) {
    events = val;
  }
  render () {
      return(
      <div>
        <h1 class="bellRings"> Why is the Bell Ringing? </h1>
        <h2 class="mainEvent"> {events} </h2>
      </div>
      );
    }
  }

module.exports = Header;
