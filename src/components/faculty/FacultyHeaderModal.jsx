import React from 'react';
import { Button, message } from 'antd';
import WrappedEditFacultyForm from './WrappedEditFacultyForm';
import axios from 'axios';

class FacultyHeaderModal extends React.Component {
  state = {
    visible: false,
  };

  errorMessages = {
    404: 'Missing field(s) in faculty request',
    500: 'Error updating faculty',
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  updateFaculty = async faculty => {
    const { name, email, job, phone, senate, departments } = faculty;

    return axios.put('/api/faculty', {
      fullName: name,
      email,
      jobTitle: job,
      phoneNum: phone,
      senateDivision: senate,
      departmentAssociations: departments,
    });
  };

  /**
   * Function that is triggered when the "Ok" button is clicked.
   *
   * Calls the `onCreate` function from the parent component will update the faculty
   * object and re-render the view
   *
   * @param faculty Faculty to be passed by the callback
   */
  handleOk = faculty => {
    const { form } = this.formRef.props;

    form.validateFields(err => {
      if (err) {
        return;
      }

      this.setState({
        faculty,
        visible: false,
      });

      this.updateFaculty(faculty)
        .then(() => {
          message.success('Faculty updated successfully');
          this.props.onCreate(faculty);
        })
        .catch(err => {
          this.handleErrors(err);
        });
    });
  };

  handleCancel = () => {
    this.setState({ visible: false, selected: '' });
    const { form } = this.formRef.props;
    form.resetFields();
  };

  handleErrors = error => {
    const { status } = error.response;
    const errorMessage = this.errorMessages[status];

    if (!errorMessage) {
      message.error('Unknown error');
    } else {
      message.error(errorMessage);
    }
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Edit
        </Button>
        <WrappedEditFacultyForm
          title="Edit Faculty"
          visible={this.state.visible}
          faculty={this.props.faculty}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          wrappedComponentRef={this.saveFormRef}
          senateDivisions={this.props.senateDivisions}
          departments={this.props.departments}
        />
      </div>
    );
  }
}

export default FacultyHeaderModal;
