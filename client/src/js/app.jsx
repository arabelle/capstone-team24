import React from 'react';
import {render} from 'react-dom';

export class Header extends React.Component {
  render () {
      return(
      <div>
        <h1 className="bellRings"> Why is the Bell Ringing? </h1>
        <h2 className="mainEvent"> {events} </h2>
      </div>
      );
    }
  }