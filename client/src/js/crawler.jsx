import React from 'react';
import {render} from 'react-dom';

var ws = new WebSocket("ws://aqueous-fjord-48858.herokuapp.com/websocket");

export class CrawlerButton extends React.Component {
  handleClick() {
    ws.send("Run Crawler");
  }

  render() {
    // This syntax ensures `this` is bound within handleClick
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Run Crawler
      </button>
    );
  }
}
