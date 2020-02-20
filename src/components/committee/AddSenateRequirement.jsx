import React from 'react';
import { Button, message } from 'antd';
import axios from 'axios';
import WrappedDisplayForm from './AddSenateRequirementForm.jsx';

class AddSenateRequirement extends React.Component {
  state = {
    visible: false,
    dataMembers: [],
  };

  fetchData = () => {
    const errorMessages = {
      404: 'Found no senate divisions',
      500: 'Unable to retrieve record',
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

  postAssignment = async (committeeId, senateShortName, slotReqs) => {
    const res = await axios.post('api/committee-slots', {
      committeeId: committeeId,
      senateDivision: senateShortName,
      slotRequirements: slotReqs,
    });

    return res;
  };

  handleCreate = value => {
    const errorMessages = {
      400: 'Missing field(s) in request',
      409: 'Committee already has this senate requirement',
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

    const { form } = this.formRef.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.formRef.resetState();

      this.postAssignment(this.props.committeeId, value, values['slotReq'])
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
          title="Add New Senate Requirement"
          dataMembers={this.state.dataMembers}
          committeeId={this.props.committeeId}
        />
      </div>
    );
  }
}

export default AddSenateRequirement;
