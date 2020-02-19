import React, { Component } from 'react';
import WrappedDisplayForm from './AddCommitteeForm';
import { Redirect } from 'react-router-dom';

class AddCommittee extends Component {
  state = {
    redirectToGetCommittee: false,
    selected: '',
  };

  onSuccessHandler = value => {
    this.setState({
      redirectToCommitteeInfo: true,
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
            state: { showInfo: true, selected: this.state.selected },
          }}
        />
      );
    }
    return (
      <div className="Add">
        <WrappedDisplayForm
          onSuccess={this.onSuccessHandler}
          title="Add New Committee"
        />
      </div>
    );
  }
}

export default AddCommittee;
