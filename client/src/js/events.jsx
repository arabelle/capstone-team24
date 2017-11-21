import React from 'react';
import {render} from 'react-dom';
import styles from '../css/index.css';
import LogoImg from '../images/logo.jpg';

var eventsList = events;
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
var decoded = entities.decode(events);

export class MainEvent extends React.Component{
    render(){
        return (
        <div className="eventsMain">
        <img src="http://www.vancitybuzz.com/wp-content/uploads/2016/02/stamkos-canucks1.jpg"/>
        <h2>Canucks Win</h2>
        </div>
        );
    }
}

export class EventsList extends React.Component{
    render(){
        return (
        <h2>{decoded}</h2>
        );
    }
}