import React from 'react';
import {render} from 'react-dom';
import styles from '../css/index.css';

var eventsList = events;

export class Events extends React.Component{
    
    
    render(){
        return (
        <h2>{eventsList}</h2>
        );
    }
}