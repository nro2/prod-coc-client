import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      getText: '',
    };
  }
  handleSubmit(e) {
    this.setState({ inputText: e.target.value });
  }

  getClick() {
    this.setState({ getText: this.state.inputText });
  }

  render() {
    return (
      <div>
        <h1>Submit/Get</h1>
        <form onSubmit={this.handleSubmit}>
          <p>
            <input type="text" placeholder="First Name" name="name" />
          </p>
          <p>
            <button>Submit</button>
          </p>
        </form>

        <button type="submit" onClick={this.getClick}>
          Get
        </button>
        <p>{this.state.getText}</p>
      </div>
    );
  }
}

export default App;
