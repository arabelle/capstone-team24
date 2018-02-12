import React from 'react';
import { Link } from 'react-router-dom';
import {Tabs, Tab} from 'material-ui/Tabs';
import { connect } from 'react-redux'; 
import { eventActions } from '../actions';
 
class DisplayEvents extends React.Component {
    componentDidMount() {
        this.props.dispatch(eventActions.getAllEvents());
    }
    
    //TODO
    // handleDeleteEvent(id) {
    //     return (e) => this.props.dispatch(userActions.deleteEvent(id));
    // }
 
    //TODO ADD EDIT STUFF

    render() {
        const { events } = this.props;
        return (
        <Tabs>
            <Tab label="All Events" >
        <div>
         {events.loading && <em>Loading Events...</em>}
                {events.items &&
                    <div className="eventsList">
                    {events.items.map(function(event){
                                return <div className="eventsMinor"><h2>{event.text}</h2>
                                <p>Date published: {event.date}<br/><a href={event.link}>Read about it...</a></p></div>;
                    })}
                    </div>
                }
            </div>
            </Tab>
            <Tab label="Sports">
            <div>
             {events.loading && <em>Loading Events...</em>}
                {events.items &&
                    <div className="eventsList">
                    {events.items.map(function(event){
                        if (event.tags === "Sports")
                                return <div className="eventsMinor"><h2>{event.text}</h2>
                                <p>Date published: {event.date}<br/><a href={event.link}>Read about it...</a></p></div>;
                    })}
                    </div>
                }
            </div>
            </Tab>
            <Tab label="News">
            </Tab>
            <Tab label="Movies">
            <div>
             {events.loading && <em>Loading Events...</em>}
                {events.items &&
                    <div className="eventsList">
                    {events.items.map(function(event){
                        if (event.tags === "Movies")
                                return <div className="eventsMinor"><h2>{event.text}</h2>
                                <p>Date published: {event.date}<br/><a href={event.link}>Read about it...</a></p></div>;
                    })}
                    </div>
                }
            </div>
            </Tab>
            <Tab label="Other">
            <div>
             {events.loading && <em>Loading Events...</em>}
                {events.items &&
                    <div className="eventsList">
                    {events.items.map(function(event){
                            if(event.tags !== "Movies" && event.tags !== "News" && event.tags !== "Sports")
                                return <div className="eventsMinor"><h2>{event.text}</h2>
                                <p>Date published: {event.date}<br/><a href={event.link}>Read about it...</a></p></div>;
                    })}
                    </div>
                }
            </div>
            </Tab>
            </Tabs>
        );
    }
}
 
function mapStateToProps(state) {
    const { events, authentication } = state;
    const { user } = authentication;
    return {
        user,
        events
    };
}
 
const connectedDisplayEvents = connect(mapStateToProps)(DisplayEvents);
export { connectedDisplayEvents as DisplayEvents };