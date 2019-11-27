import React, {Component} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import HomeComponent from "./components/HomeComponent"
import AddComponent from "./components/AddComponent";
import GetComponent from "./components/GetComponent";
import CommitteeComponent from "./components/CommitteeComponent";

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
              <Link to="/Add">Add Faculty</Link>
            </li>
            <li>
              <Link to="/Get">Get Faculty</Link>
            </li>
            <li>
              <Link to="/Committees">Committees</Link>
            </li>
          </ul>
          <Switch>
            <Route path="/Home">
                <HomeComponent />
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
