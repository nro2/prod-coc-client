import React, { Component } from 'react';
import WrappedDisplayForm from './AddForm';
//import { message } from 'antd';
import { Redirect } from 'react-router-dom';
//import axios from 'axios';

class AddFaculty extends Component {
  state = {
    redirectToGetFaculty: false,
    dataMembers: [],
    selected: '',
  };

  onSuccessHandler = () => {
    this.setState({
      redirectToGetFaculty: true,
    });
  };

  render() {
    const redirect = this.state.redirectToGetFaculty;
    if (redirect === true) {
      return <Redirect to="/get-faculty" />;
    }
    return (
      <div className="Add">
        <WrappedDisplayForm
          wrappedComponentRef={this.saveFormRef}
          onSuccess={this.onSuccessHandler}
          title="Add New Faculty"
          dataMembers={this.state.dataMembers}
        />
      </div>
    );
  }
}

export default AddFaculty;
