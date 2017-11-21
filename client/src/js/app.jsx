import React from 'react';
import {render} from 'react-dom';

const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
var decoded = entities.decode(events);

export class Header extends React.Component {
  render () {
      return(
      <div>
        <h1 className="bellRings"> Why is the Bell Ringing? </h1>
        <h2 className="mainEvent"> {decoded} </h2>
      </div>
      );
    }
  }
