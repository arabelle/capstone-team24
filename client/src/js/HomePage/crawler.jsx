import React from 'react';
import {render} from 'react-dom';

export class CrawlerButton extends React.Component {
  handleClick() {
    fetch('http://localhost:5000/crawler', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pressed: 'yes'
      })
    })
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
