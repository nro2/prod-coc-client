import React, {Component} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from "./Home"
import AddComponent from "./AddComponent";
import GetComponent from "./GetComponent";
import CommitteeComponent from "./CommitteeComponent";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ""
    };
  }


  render(){
    return(
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/Home">Home</Link>
            </li>
            <li>
              <Link to="/Add">Add Staff</Link>
            </li>
            <li>
              <Link to="/Get">Get Staff</Link>
            </li>
            <li>
              <Link to="/Committees">Committees</Link>
            </li>
          </ul>
          <Switch>
            <Route path="/Home">
                <Home />
            </Route>
            <Route path="/Add">
                <AddComponent/>
            </Route>
            <Route path="/Get">
                <GetComponent/>
            </Route>
            <Route path="/Committees">
                <CommitteeComponent/>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
