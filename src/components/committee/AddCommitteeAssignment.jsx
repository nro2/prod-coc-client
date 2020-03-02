import React from 'react';
import { Button, message } from 'antd';
import WrappedDisplayForm from './AddCommitteeAssignmentForm.jsx';
import axios from 'axios';

class AddCommitteeAssignment extends React.Component {
  state = {
    visible: false,
    dataMembers: [],
    senateDivisions: [],
  };

  fetchData = () => {
    const errorMessages = {
      404: 'There are no faculty members',
      500: 'Unable to save record',
    };

    const handleErrors = error => {
      const { status } = error.response;
      const errorMessage = errorMessages[status];

      if (!errorMessage) {
        message.error('Unknown error');
      } else {
        message.error(errorMessage);
      }
    };

    axios
      .get(this.props.endpoint)
      .then(response => {
        this.setState({
          dataMembers: response.data,
        });
      })
      .catch(err => {
        handleErrors(err);
      });

    axios
      .get('api/senate-divisions')
      .then(response => {
        this.setState({
          senateDivisions: response.data,
        });
      })
      .catch(err => {
        handleErrors(err);
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

  postAssignment = async (email, committeeId, startDate, endDate) => {
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
      const errorMessages = {
        400: 'Missing field(s) in request',
        409: 'Faculty is already a member of this committee',
        500: 'Unable to save record',
      };

      const handleErrors = error => {
        const { status } = error.response;
        const errorMessage = errorMessages[status];

        if (!errorMessage) {
          message.error('Unknown error');
        } else {
          message.error(errorMessage);
        }
      };

      if (err) {
        return;
      }

      this.formRef.resetState();

      const dateFormat = 'YYYY/MM/DD';
      this.postAssignment(
        value,
        this.props.committeeId,
        values['start-date'].format(dateFormat),
        values['end-date'].format(dateFormat)
      )
        .then(() => {
          message.success('Record inserted successfully!');
        })
        .catch(err => {
          handleErrors(err);
        });

      form.resetFields();
      this.setState({ visible: false });
      this.props.rerenderParentCallback();
    });
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
          title="Add New Committee Member"
          dataMembers={this.state.dataMembers}
          senateDivisions={this.state.senateDivisions}
          committeeId={this.props.committeeId}
        />
      </div>
    );
  }
}

export default AddCommitteeAssignment;
