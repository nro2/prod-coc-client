import React, { Component } from 'react';
import WrappedDisplayForm from './AddForm';
import { Redirect } from 'react-router-dom';

class AddFaculty extends Component {
  state = {
    redirectToGetFaculty: false,
    selected: '',
  };

  onSuccessHandler = value => {
    this.setState({
      redirectToGetFaculty: true,
      selected: value,
    });
  };

  render() {
    const redirect = this.state.redirectToGetFaculty;
    if (redirect === true) {
      return (
        <Redirect
          to={{
            pathname: '/get-faculty',
            state: { showInfo: true, selected: this.state.selected },
          }}
        />
      );
    }
    return (
      <div className="Add">
        <WrappedDisplayForm
          onSuccess={this.onSuccessHandler}
          title="Add New Faculty"
        />
      </div>
    );
  }
}

export default AddFaculty;
