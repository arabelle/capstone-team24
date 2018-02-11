import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
 
import { userActions } from '../actions';


class AdminPage extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            query: {},
            id: '',
            date: '',
            text: '',
            link: '',
            time: '',
            filter: '',
            dateQuery: new Array(),
            addQuery: new Array(),
            updateQuery: new Array()
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDateSubmit = this.handleDateSubmit.bind(this);
        this.handleAddSubmit = this.handleAddSubmit.bind(this);
        this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);

        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleLinkChange = this.handleLinkChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);

    }

    componentDidMount() {
        this.props.dispatch(userActions.getAll());
    }
 
    handleDeleteUser(id) {
        return (e) => this.props.dispatch(userActions.delete(id));
    }

    ringBell() {
        this.props.dispatch(userActions.ringBell());
    }
 
    render() {
        const { user, users } = this.props;
        return (
            <div className="modal">
                <h1>Hi {user.name}!</h1>
                <p>You're logged in with React!!</p>
                <h3>All registered users:</h3>
                {users.loading && <em>Loading users...</em>}
                {users.items &&
                    <ul>
                        {users.items.map((user) =>
                            <li key={user[0]}>
                                {user[1]}
                                {
                                    user.deleting ? <em> - Deleting...</em>
                                    : user.deleteError ? <span className="error"> - ERROR: {user.deleteError}</span>
                                    : <span> - <a onClick={this.handleDeleteUser(user[0])}>Delete</a></span>
                                }
                            </li>
                        )}
                    </ul>
                }
                <p>
                    <Link to="/">Close</Link>
                </p>
                
                <button onClick={(e) => this.ringBell(e)}>Ring Bell</button>
                
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
 
const connectedAdminPage = connect(mapStateToProps)(AdminPage);
export { connectedAdminPage as AdminPage };