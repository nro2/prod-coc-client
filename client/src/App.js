import React, {Component} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";

import Home from "./Home"
import AddComponent from "./AddComponent";
import GetComponent from "./GetComponent";

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
          </Switch>
        </div>
      </Router>
    );
  }

  /*render() {
    return (
        <div className="App">
          <div className="header">
            <form onSubmit={this.addItem}>
              <p>POST response: {this.state.text2}</p>
              <input ref = {(a) => this._firstName = a}
                     placeholder="First Name">
              </input>
              <input ref = {(a) => this._lastName = a}
                     placeholder="Last Name">
              </input>
              <input ref = {(a) => this._phoneNum = a}
                     placeholder="Phone Number">
              </input>
              <button type="submit">Post</button>
            </form>
            <form onSubmit={this.getItem}>
              <p>Last Name from GET: {this.state.text}</p>
              <input ref = {(a) => this._aName =a}
                         placeholder="Enter first name">
              </input>

              <button type="submit">Get</button>
            </form>
            </div>
        </div>
    );
  }*/
}

export default App;
