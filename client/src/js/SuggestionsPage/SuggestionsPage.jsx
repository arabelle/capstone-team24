import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
//import { EventsList, MainEvent } from './events.jsx';
import { userActions } from '../actions';
 
class SuggestionsPage extends React.Component {
    componentDidMount() {
        this.props.dispatch(userActions.displaySuggestions());
    }
 
    render() {
        const { events } = this.props;
        console.log(events.items[0]);
        return (
            <div>
                <h1> Why the Bell Rings </h1> 
                <div className="eventsMain" id="events">
                    <img src="https://www.billboard.com/files/styles/article_main_image/public/media/philadelphia-eagles-super-bowl-champions-trophy-2018-billboard-1548.jpg"/>
                    <h2>The 2018 Super Bowl Champions are the Philidelphia Eagles</h2>
                    <a href="https://www.nfl.com/super-bowl">Read More</a>
                </div>
                {events.loading && <em>Loading Events...</em>}
                {events.items &&
                    <div className="eventsList">
                        {events.items.map(function(event){
                          return <div className="eventsMinor"><h2>{event[1]}</h2>
                          <p>Date published: {event[0]}<br/><a href={event[3]}>Read about it...</a></p></div>;
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
 
const connectedSuggestionsPage = connect(mapStateToProps)(SuggestionsPage);
export { connectedSuggestionsPage as SuggestionsPage };