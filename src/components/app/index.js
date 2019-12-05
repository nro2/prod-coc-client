import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from 'react-router-dom';
import './app.css';

import AddFacultyComponent from '../add-faculty';
import CommitteesComponent from '../committees';
import GetFacultyComponent from '../get-faculty';
import HomeComponent from '../home';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };
  }

  render() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/add-faculty">Add Faculty</Link>
            </li>
            <li>
              <Link to="/get-faculty">Get Faculty</Link>
            </li>
            <li>
              <Link to="/committees">Committees</Link>
            </li>
          </ul>
          <Switch>
            <Route path="/home">
              <HomeComponent />
            </Route>
            <Route path="/add-faculty">
              <AddFacultyComponent />
            </Route>
            <Route path="/get-faculty">
              <GetFacultyComponent />
            </Route>
            <Route path="/committees">
              <CommitteesComponent />
            </Route>
          </Switch>
          <Redirect to="/home" />
        </div>
      </Router>
    );
  }
}

export default App;
