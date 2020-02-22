import React, { Component } from 'react';
import WrappedDisplayForm from './AddCommitteeForm';
import { Redirect } from 'react-router-dom';

class AddCommittee extends Component {
  state = {
    redirectToGetCommittee: false,
    selected: '',
  };

  handleSuccess = value => {
    this.setState({
      redirectToGetCommittee: true,
      selected: value,
    });
  };

  render() {
    const redirect = this.state.redirectToGetCommittee;
    if (redirect === true) {
      return (
        <Redirect
          to={{
            pathname: '/committee',
            state: { selected: this.state.selected },
          }}
        />
      );
    }
    return (
      <div className="Add">
        <WrappedDisplayForm
          onSuccess={this.handleSuccess}
          title="Add New Committee"
        />
      </div>
    );
  }
}

export default AddCommittee;
