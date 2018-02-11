import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { EventsList, MainEvent } from './events.jsx';
import { userActions } from '../actions';
 
class SuggestionsPage extends React.Component {
    componentDidMount() {
        this.props.dispatch(userActions.displaySuggestions());
    }
 
    render() {
        const { user, users } = this.props;
        return (
            <div>
                <MainEvent />
                <EventsList />
            </div>
        );
    }
}
 
function mapStateToProps(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users
    };
}
 
const connectedSuggestionsPage = connect(mapStateToProps)(SuggestionsPage);
export { connectedSuggestionsPage as SuggestionsPage };