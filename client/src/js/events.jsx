import React from 'react';
import {render} from 'react-dom';
import styles from '../css/index.css';

var eventsList = events;
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
var decoded = entities.decode(events);

export class MainEvent extends React.Component{
    render(){
        return (
        <h2>Canucks Win</h2>
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