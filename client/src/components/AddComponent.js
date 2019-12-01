import React, { Component } from 'react';
import axios from 'axios';
import '../stylesheets/Add.css';

class AddComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };

    this.addItem = this.addItem.bind(this);
  }

  addItem(e) {
    axios
      .post('http://127.0.0.1:8080', {
        firstName: this._firstName.value,
        lastName: this._lastName.value,
        phoneNum: this._phoneNum.value,
      })
      .then(response => {
        let newText = response.data;
        this.setState({
          text: newText,
        });
        this._firstName.value = '';
        this._lastName.value = '';
        this._phoneNum.value = '';
      })
      .catch(err => {
        this.setState({
          text: 'Insert was not successful',
        });
        console.log(err);
      });

    e.preventDefault();
  }
  render() {
    return (
      <div className="Add">
        <h1>Add faculty here</h1>
        <p>Message: {this.state.text}</p>
        <form onSubmit={this.addItem}>
          <input ref={a => (this._firstName = a)} placeholder="First Name"></input>
          <input ref={a => (this._lastName = a)} placeholder="Last Name"></input>
          <input ref={a => (this._phoneNum = a)} placeholder="Phone Number"></input>
          <button type="submit">Add</button>
        </form>
      </div>
    );
  }
}

export default AddComponent;
