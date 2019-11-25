import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      buffer: '',
      userMessage: 'init',
      pocGetResult: '',
    };
    this.manageSubmit = this.manageSubmit.bind(this);
    this.performSubmit = this.performSubmit.bind(this);
  }
  handleSubmit() {
    this.setState({ inputText: '', userMessage: this.state.buffer });
  }

  manageSubmit(event) {
    event.preventDefault();
  }
  createGetButton() {
    const updateState = () => {
      return (
        <React.Fragment>
          {this.setState({ pocGetResult: this.state.userMessage })}
        </React.Fragment>
      );
    };
    return (
      <button value="GET" onClick={() => updateState()}>
        GET
      </button>
    );
  }

  performSubmit(data) {
    this.setState({ buffer: data.target.value, inputText: data.target.value });
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
            <button value="Submit" onClick={() => this.handleSubmit()}>
              Submit
            </button>
          </p>
        </form>
        <h2>Get Result:</h2>
        <p>{this.createGetButton()}</p>
        <p>{this.state.pocGetResult}</p>
      </React.Fragment>
    );
  }
}

export default App;
