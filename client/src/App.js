import React, { Component } from 'react';
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      buffer: '',
      userMessage: 'init',
      pocGetResult: 'none',
    };
    this.managesubmit = this.manageSubmit.bind(this);
    this.performSubmit = this.performSubmit.bind(this);
  }
  handleSubmit() {
    this.setState({ inputText: '', userMessage: this.state.buffer });
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.manageSubmit}>
          <h1>Submit/Get</h1>
          <p>
            <input
            type="text"
            placeholder="First Name"
            name="name"
            value={this.state.inputText}
            onChange={this.performSubmit}
             />
          </p>
          <p>
            <button
            value="Submit"
            onClick={() => this.handleSubmit()}>Submit
            </button>
          </p>
        </form>
        <p>
          {this.createGetButton()}
          <h2>Get Result:</h2>
          {this.state.pocGetResult}
        </p>
      </React.Fragment>
    );
  }
  manageSubmit(event){
    event.preventDefault();
  }
  createGetButton(){
    return(
      <button value="GET" onClick={() => this.updateState()}>
      GET
      </button>
    );
  }

  performSubmit(data){
    this.setState({ buffer: data.target.value, inputText: data.target.value})
  }

  updateState(){
    return(
      <React.Fragment>
      {this.setState({ pocGetResult: this.state.userMessage})}
      </React.Fragment>
    );
  }
}

export default App;
