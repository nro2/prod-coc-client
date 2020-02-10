import React, { Component } from 'react';
import WrappedDisplayForm from './AddForm';
import { message } from 'antd';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class AddFaculty extends Component {
  state = {
    redirectToGetFaculty: false,
    dataMembers: [],
    selected: '',
  };

  postAssignment = async (
    firstName,
    lastName,
    email,
    jobTitle,
    phoneNum,
    senateDivision,
    departments
  ) => {
    const res = await axios
      .post('/api/faculty', {
        fullName: firstName + lastName,
        email: email,
        jobTitle: jobTitle,
        phoneNum: phoneNum,
        senateDivision: senateDivision,
        departments: departments,
      })
      .then(() => {
        this.setState({
          redirectToGetFaculty: true,
        });
      });
    return res;
  };

  handleCreate = value => {
    const { form } = this.formRef.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.formRef.resetState();

      this.postAssignment(
        value,
        values['first'],
        values['last'],
        values['email'],
        values['Job Title'],
        values['Phone Number'],
        values['Senate Division'],
        values['Department']
      )
        .then(() => {
          message.success('Record inserted successfully!');
        })
        .catch(err => {
          message.error(err.response.data.error);
        });

      form.resetFields();
      this.props.rerenderParentCallback();
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
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
          onCreate={this.handleCreate}
          title="Add New Faculty"
          dataMembers={this.state.dataMembers}
        />
      </div>
    );
  }
}

export default AddFaculty;
