import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../actions';
 
class AddEvents extends React.Component {
    constructor(props) {
        super(props);
 
        this.state = {
            event: {
                text: '',
                link: '',
                time: '',
                date: '',
                tags: '',

            },
            submitted: false
        };
 
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
 
    handleChange(e) {
        const { name, value } = e.target;
        const { event } = this.state;
        this.setState({
            event: {
                ...event,
                [name]: value
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();
 
        this.setState({ submitted: true });
        const { event } = this.state;
        const { dispatch } = this.props;
        if (event.date && event.time && event.text && event.link) {
            console.log(event);
            dispatch(userActions.addEvent(event));
        }
    }
 
    render() {
        const { addingEvent  } = this.props;
        const { event, submitted } = this.state;
        return (
            <div className="modal">
                <Link to="/" className="exit-btn">X</Link>
                <h2>Add Event</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !event.text ? ' has-error' : '')}>
                        <label htmlFor="eventText">Enter Text</label>
                        <input type="text" className="form-control" name="text" value={event.text} onChange={this.handleChange} />
                        {submitted && !event.text &&
                            <div className="help-block">Text is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !event.link ? ' has-error' : '')}>
                        <label htmlFor="eventLink">Enter URL</label>
                        <input type="url" className="form-control" name="link" value={event.link} onChange={this.handleChange} />
                        {submitted && !event.link &&
                            <div className="help-block">Text is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !event.eventname ? ' has-error' : '')}>
                        <label htmlFor="eventDate">Date</label>
                        <input type="date" className="form-control" name="date" value={event.date} onChange={this.handleChange} />
                        {submitted && !event.date &&
                            <div className="help-block">Date is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !event.time ? ' has-error' : '')}>
                        <label htmlFor="eventTime">Time</label>
                        <input type="time" className="form-control" name="time" value={event.time} onChange={this.handleChange} />
                        {submitted && !event.time &&
                            <div className="help-block">Time is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !event.tags ? ' has-error' : '')}>
                        <label htmlFor="eventTags">Enter Tags</label>
                        <input type="text" className="form-control" name="tags" value={event.tags} onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                    <div className="btn-Container">
                        <button className="btn btn-primary">Add</button>
                    </div>
                        {addingEvent &&
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                        <Link to="/" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            </div>
        );
    }
}
 
function mapStateToProps(state) {
    const { addingEvent } = state.addEvent;
    return {
        addingEvent
    };
}

const connectedAddEvents= connect(mapStateToProps)(AddEvents);
export { connectedAddEvents as AddEvents };