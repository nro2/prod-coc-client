import React, { Component } from 'react';
import axios from 'axios';
//import { Menu, Dropdown, Icon } from 'antd';

class AddFaculty extends Component {
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
        jobTitle: this._jobTitle.value,
      })
      .then(() => {
        this.setState({
          text: 'Data insert was a success',
        });
        this._firstName.value = '';
        this._lastName.value = '';
        this._email.value = '';
        this._jobTitle.value = '';
        this._phoneNum.value = '';
        //        this._senateDivision = '';
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
          <input ref={a => (this._firstName = a)} placeholder="First Name" />
          <input ref={a => (this._lastName = a)} placeholder="Last Name" />
          <input ref={a => (this._email = a)} placeholder="Email" />
          <input ref={a => (this._jobTitle = a)} placeholder="Job Title" />
          <input ref={a => (this._phoneNum = a)} placeholder="Phone Number" />

          <button type="submit">Add</button>
        </form>
      </div>
    );
  }
}

export default AddFaculty;
