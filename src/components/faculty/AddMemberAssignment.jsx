import React from 'react';
import { Button, message } from 'antd';
import WrappedDisplayForm from './AddMemberAssignmentForm.jsx';
import axios from 'axios';

class AddMemberAssignment extends React.Component {
  state = {
    visible: false,
    dataMembers: [],
  };

  errorMessages = {
    400: 'No committees found on record',
    500: 'Unable to complete transaction',
  };

  fetchData = () => {
    axios
      .get(this.props.endpoint)
      .then(response => {
        this.setState({
          dataMembers: response.data,
        });
      })
      .catch(err => {
        this.handleErrors(err);
      });
  };

  handleClick = () => {
    this.setState({ visible: true });
    this.fetchData();
  };

  handleCancel = () => {
    this.setState({ visible: false });
    const { form } = this.formRef.props;
    form.resetFields();
  };

  postAssignment = async (committeeId, email, startDate, endDate) => {
    const res = await axios.post('api/committee-assignment', {
      email: email,
      committeeId: committeeId,
      startDate: startDate,
      endDate: endDate,
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

      const dateFormat = 'YYYY/MM/DD';
      this.postAssignment(
        value,
        this.props.email,
        values['start-date'].format(dateFormat),
        values['end-date'].format(dateFormat)
      )
        .then(() => {
          message.success('Record inserted successfully!');
        })
        .catch(err => {
          this.handleErrors(err);
        });

      form.resetFields();
      this.setState({ visible: false });
      this.props.rerenderParentCallback();
    });
  };

  handleErrors = error => {
    const { data, status } = error.response;
    const errorMessage = this.errorMessages[status];

    if (status === 409 && data.detail) {
      message.error(data.detail);
    } else if (!errorMessage) {
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
        <Button type="primary" className="add-button" onClick={this.handleClick}>
          {this.props.buttonLabel || 'Add'}
        </Button>
        <WrappedDisplayForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          okText="Add"
          title="Add New Committee"
          dataMembers={this.state.dataMembers}
          email={this.props.email}
        />
      </div>
    );
  }
}

export default AddMemberAssignment;
