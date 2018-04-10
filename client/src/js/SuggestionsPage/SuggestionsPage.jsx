import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../actions';
import { CrawlerButton } from '../HomePage/crawler';
 
class SuggestionsPage extends React.Component {
    componentDidMount() {
        this.props.dispatch(userActions.displaySuggestions());
    }
 
    render() {
        const { events } = this.props;
        return (
            <div>
                <CrawlerButton />
                <div className="eventsMain" id="events">
                    <img src="https://i.cbc.ca/1.4610264.1523164340!/cpImage/httpImage/image.jpg_gen/derivatives/16x9_1180/henrik-daniel-sedin-040718.jpg?imwidth=720"/>
                    <h2>Sedin twins wrap up impressive careers in Edmonton</h2>
                    <a href="http://www.cbc.ca/sports/hockey/nhl/vancouver-canucks-edmonton-oilers-recap-1.4609811">Read More</a>
                </div>
                {events.loading && <em>Loading Events...</em>}
                {events.items &&
                    <div className="eventsList">
                        {events.items.map(function(event){
                          return <div className="eventMinor"><h2>{event[1]}</h2>
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