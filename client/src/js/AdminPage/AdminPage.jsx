import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
 
import { userActions } from '../actions';
var url = "http://localhost:5000";

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

    handleSubmit(e) {
        e.preventDefault();
        let current = this;
        const{query} = this.state;
        fetch("http://localhost:5000/admin")
            .then(function(response) {
                return response.json();
            })
            .then(function(data){
                current.setState({query : data});
                console.log(data);
                console.log(data[0].filter);
            });  
    }

    handleDateChange(e){
        this.setState({date: e.target.value});
    }

    handleTextChange(e){
        this.setState({text: e.target.value})
    }

    handleLinkChange(e){
        this.setState({link: e.target.value})
    }

    handleTimeChange(e){
        this.setState({time: e.target.value})
    }

    handleFilterChange(e){
        this.setState({filter: e.target.value})
    }

    //same function for filter
    handleDateSubmit(e) {
        e.preventDefault();
        let current = this;
        const{dateQuery} = this.state;
        const formData = JSON.stringify({date: this.state.date});
        fetch("http://localhost:5000/admin", {
            method: 'post',
            header: 'application/x-www-form-urlencoded',
            body: formData
        })
            .then(function(response) {
                return response.json();
            })
            .then(function(data){
                current.setState({dateQuery : data});
                console.log(data);
                console.log(data[0].filter);
            });  
    }

    handleAddSubmit(e) {
        e.preventDefault();
        const{addQuery} = this.state;
        const formData = JSON.stringify({date: this.state.date, 
            text: this.state.text, link: this.state.link, time: this.state.time, filter: this.state.filter});
        console.log(formData);
        fetch("http://localhost:5000/admin/add", {
            method: 'post',
            header: 'application/x-www-form-urlencoded',
            body: formData
        })
            .then(function(response) {
                return response.json();
            })
            .then(function(data){
                console.log(data);
            });  
    }

    handleUpdateSubmit(e) {
        e.preventDefault();
        const{updateQuery} = this.state;
        const formData = JSON.stringify({id: "1", date: this.state.date, 
            text: this.state.text, link: this.state.link, time: this.state.time, filter: this.state.filter});
        console.log(formData);
        fetch("http://localhost:5000/admin/update", {
            method: 'post',
            header: 'application/x-www-form-urlencoded',
            body: formData
        })
            .then(function(response) {
                return response.json();
            })
            .then(function(data){
                console.log(data);
            });  
    }
 
 
    render() {
        const { user, users } = this.props;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1>Hi {user.firstName}!</h1>
                <p>Youre logged in with React!!</p>
                <h3>All registered users:</h3>
                {users.loading && <em>Loading users...</em>}
                {users.items &&
                    <ul>
                        {users.items.map((user, index) =>
                            <li key={user.id}>
                                {user.firstName + ' ' + user.lastName}
                                {
                                    user.deleting ? <em> - Deleting...</em>
                                    : user.deleteError ? <span className="error"> - ERROR: {user.deleteError}</span>
                                    : <span> - <a onClick={this.handleDeleteUser(user.id)}>Delete</a></span>
                                }
                            </li>
                        )}
                    </ul>
                }
                <p>
                    <Link to="/login">Logout</Link>
                </p>
                <form name="form" onSubmit={this.handleSubmit} method="get">
                        <input type="submit" name="Get All Events" value="Get All Events" onClick ={this.handleSubmit} method = "get"/>    
                </form>
                <form name="getDateEvent" onSubmit={this.handleDateSubmit} method="post">
                        <input type="text" name="date" placeholder="YYYY-MM-DD" onChange={this.handleDateChange}/>
                        <input type="submit" name="date" value="Submit Date"/>
                </form>
                <form name="addEvent" method="post">
                        <label>Date:</label>
                        <input type="text" name="date" onChange={this.handleDateChange}/>
                        <label>Text:</label>
                        <input type="text" name="text" onChange={this.handleTextChange}/>
                        <label>Link:</label>
                        <input type="text" name="link" onChange={this.handleLinkChange}/>
                        <label>Time:</label>
                        <input type="text" name="time" onChange={this.handleTimeChange}/>
                        <label>Filter:</label>
                        <input type="text" name="filter" onChange={this.handleFilterChange}/>
                        <input type="submit" name="addSubmit" value="Submit New Event" onClick = {this.handleAddSubmit}/>
                        <input type="submit" name="updateSubmit" value="Update Event" onClick = {this.handleUpdateSubmit}/>
                </form>
                <h1>{this.props.query}</h1>
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