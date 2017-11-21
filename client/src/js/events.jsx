import React from 'react';
import {render} from 'react-dom';
import styles from '../css/index.css';

var eventsList = events;
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
var decoded = entities.decode(events);
decoded = JSON.parse(decoded.replace(/\'/g, ""));

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
            <div>
            {decoded.map(function(event){
              return <div><h2>{event[1]}</h2>
              <p>Date published: {event[0]}<br/><a href={event[3]}>Read about it...</a></p></div>;
            })}
            </div>
        )
    }
}
