import React, { Component } from 'react';
import AddForm from './AddForm';

class AddFaculty extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Add">
        <AddForm />
      </div>
    );
  }
}

export default AddFaculty;
