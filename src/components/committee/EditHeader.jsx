import React from 'react';
import { Button, message } from 'antd';
import axios from 'axios';

import WrappedDisplayForm from './EditHeaderForm';

class EditCommitteeHeader extends React.Component {
  state = {
    visible: false,
  };

  handleClick = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
    const { form } = this.formRef.props;
    form.resetFields();
  };

  updateCommittee = async (committeeId, name, description, totalSlots) => {
    const res = await axios.put('api/committee', {
      committeeId: committeeId,
      name: name,
      description: description,
      totalSlots: totalSlots,
    });

    return res;
  };

  handleCreate = () => {
    const errorMessages = {
      400: 'Missing field(s) in request',
      404: 'Committee does not exist',
      409: 'Committee slot already exists',
      500: 'Unable to complete transaction',
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

      this.updateCommittee(
        this.props.committeeId,
        values['name'],
        values['description'],
        values['totalSlots']
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
        <Button type="primary" onClick={this.handleClick}>
          {this.props.buttonLabel || 'Add'}
        </Button>
        <WrappedDisplayForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          okText="Save"
          title="Update Committee Info"
          data={this.props.data}
          committeeId={this.props.committeeId}
        />
      </div>
    );
  }
}

export default EditCommitteeHeader;
