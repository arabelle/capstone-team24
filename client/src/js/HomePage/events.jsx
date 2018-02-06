import React from 'react';
import {render} from 'react-dom';
import styles from '../../css/index.css';

var eventsList = events;
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

//Uncomment below for Tornado, comment out for npm
//var decoded = entities.decode(events);
//decoded = JSON.parse(decoded.replace(/\'/g, ""));

export class MainEvent extends React.Component{
    render(){
        return (
        <div>
            <h1> Why the Bell Rings </h1> 
        <div className="eventsMain" id="events">
        <img src="http://www.vancitybuzz.com/wp-content/uploads/2016/02/stamkos-canucks1.jpg"/>
        <h2>Canucks Win</h2>
        </div>
        </div>
        );
    }
}

export class EventsList extends React.Component{
    render(){
        return (
            <div className="eventsList">
            {decoded.map(function(event){
              return <div className="eventsMinor"><h2>{event[1]}</h2>
              <p>Date published: {event[0]}<br/><a href={event[3]}>Read about it...</a></p></div>;
            })}
            </div>
        )
    }
}
