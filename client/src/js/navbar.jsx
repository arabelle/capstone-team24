import React from 'react';
import { render } from 'react-dom';
import styles from '../css/index.css';

export class Navbar extends React.Component {
    render() {
        return (
            <div className="topnav" id="myTopnav">
                <a href="#home">Home</a>
                <a href="#events">Events</a>
                <a href="#contact">What Others Are Saying</a>
                <a href="#about">About</a>
            </div>
        );
    }
}