import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from 'react-router-dom';
import './app.css';

import AddFaculty from '../add-faculty';
import Committees from '../committees';
import GetFaculty from '../get-faculty';
import Home from '../home';

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
              <Home />
            </Route>
            <Route path="/add-faculty">
              <AddFaculty />
            </Route>
            <Route path="/get-faculty">
              <GetFaculty />
            </Route>
            <Route path="/committees">
              <Committees />
            </Route>
          </Switch>
          <Redirect to="/home" />
        </div>
      </Router>
    );
  }
}

export default App;
