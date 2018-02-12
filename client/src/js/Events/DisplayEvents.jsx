import React from 'react';
import { Link } from 'react-router-dom';
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
        return (<div>
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