import React, { Component } from 'react';
import WrappedDisplayForm from './AddForm';
//import { message } from 'antd';
import { Redirect } from 'react-router-dom';
//import axios from 'axios';

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
          wrappedComponentRef={this.saveFormRef}
          onSuccess={this.onSuccessHandler}
          title="Add New Faculty"
        />
      </div>
    );
  }
}

export default AddFaculty;
