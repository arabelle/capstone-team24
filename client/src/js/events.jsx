import React from 'react';
import {render} from 'react-dom';
import styles from '../css/index.css';

var eventsList = events;

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
        <h2>{eventsList}</h2>
        );
    }
}