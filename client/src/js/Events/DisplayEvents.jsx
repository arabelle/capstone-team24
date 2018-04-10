import React from 'react';
import { Link } from 'react-router-dom';
import {Tabs, Tab} from 'material-ui/Tabs';
import { connect } from 'react-redux'; 
import { eventActions, userActions } from '../actions';
 
const styles = theme => ({
    tabsBar: {
        backgroundColor: "#333",
        overflow: hidden,
        opacity: 0.8
      },
  });

class DisplayEvents extends React.Component {
    
    componentDidMount() {
        this.props.dispatch(eventActions.getAllEvents());
    }
    
    handleDeleteEvent(id) {
         return (e) => this.props.dispatch(userActions.deleteEvent(id));
    }
 
    //TODO ADD EDIT STUFF

    //TODO Change this entire function
    render() {
        const { events, user } = this.props;
        var that = this;
        return (
        <Tabs tabItemContainerStyle={{backgroundColor: "black"}}>
            <Tab className="tabsBar" label="All Events" >
        <div>
         {events.loading && <em>Loading Events...</em>}
                {events.items &&
                    <div className="circle-container">
                        {events.items.map(function(event){
                            if(event.tags !== "Entertainment" && event.tags !== "News" && event.tags !== "Sports" && event.tags !== "Movies"){
                                return <div className={"eventsMinor"}><h2>{event.text}</h2>
                                <p>Date published: {event.date}<br/><a href={event.link}>Read about it...</a></p></div>;
                            }
                            else{
                                return <div className={"eventsMinor"+event.tags}><h2>{event.text}</h2>
                                <p>Date published: {event.date}<br/><a href={event.link}>Read about it...</a></p></div>;
                            }
                    })}
                    </div>
                }
            </div>
            </Tab>
            <Tab label="Sports">
            <div>
             {events.loading && <em>Loading Events...</em>}
                {events.items &&
                    <div className="circle-container">
                    {events.items.map(function(event){
                        if (event.tags === "Sports" &&  user !== undefined && user.admin)
                                return <div className="eventsMinor"><h2>{event.text}</h2>
                                <p>Date published: {event.date}<br/><a href={event.link}>Read about it...</a><br/><a onClick={that.handleDeleteEvent(event.id)}>Delete</a></p></div>;
                        else if (event.tags === "Sports")
                                return <div className="eventsMinor"><h2>{event.text}</h2>
                                <p>Date published: {event.date}<br/><a href={event.link}>Read about it...</a></p></div>;
                    })}
                    </div>
                }
            </div>
            </Tab>
            <Tab className="tabsBar" label="News">
            <div>
             {events.loading && <em>Loading Events...</em>}
                {events.items &&
                    <div className="circle-container">
                    {events.items.map(function(event){
                        if (event.tags === "News")
                                return <div className={"eventsMinor"+event.tags}><h2>{event.text}</h2>
                                <p>Date published: {event.date}<br/><a href={event.link}>Read about it...</a></p></div>;
                    })}
                    </div>
                }
            </div>
            </Tab>
            <Tab className="tabsBar" label="Entertainment">
            <div>
             {events.loading && <em>Loading Events...</em>}
                {events.items &&
                    <div className="circle-container">
                    {events.items.map(function(event){
                        if (event.tags === "Movies" && user !== undefined && user.admin)
                                return <div className="eventsMinor"><h2>{event.text}</h2>
                                <p>Date published: {event.date}<br/><a href={event.link}>Read about it...</a><br/><a onClick={that.handleDeleteEvent(event.id)}>Delete</a></p></div>;
                        else if (event.tags === "Movies")
                                return <div className="eventsMinor"><h2>{event.text}</h2>
                                <p>Date published: {event.date}<br/><a href={event.link}>Read about it...</a></p></div>;
                    })}
                    </div>
                }
            </div>
            </Tab>
            <Tab className="tabsBar"label="Other">
            <div>
             {events.loading && <em>Loading Events...</em>}
                {events.items &&
                    <div className="circle-container">
                    {events.items.map(function(event){
                            if(event.tags !== "Movies" && event.tags !== "News" && event.tags !== "Sports" &&  user !== undefined && user.admin)
                                return <div className="eventsMinor"><h2>{event.text}</h2>
                                <p>Date published: {event.date}<br/><a href={event.link}>Read about it...</a><br/><a onClick={that.handleDeleteEvent(event.id)}>Delete</a></p></div>;
                            else if (event.tags !== "Movies" && event.tags !== "News" && event.tags !== "Sports")
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