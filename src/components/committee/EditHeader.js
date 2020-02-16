import React from 'react';
import { Button, message } from 'antd';
import axios from 'axios';

import WrappedDisplayForm from './EditHeaderForm';

class EditCommitteeHeader extends React.Component {
  state = {
    visible: false,
    data: this.props.data,
    selected: '',
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false, selected: '' });
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

  handleCreate = value => {
    const { form } = this.formRef.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.formRef.resetState();

      this.updateCommittee(
        this.props.committeeId,
        value,
        values['description'],
        values['totalSlots']
      )
        .then(() => {
          message.success('Record inserted successfully!');
        })
        .catch(err => {
          message.error(err.response.data.error);
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
        <Button type="primary" onClick={this.showModal}>
          {this.props.buttonLabel || 'Add'}
        </Button>
        <WrappedDisplayForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          okText="Edit"
          title="Update committee info"
          data={this.state.data}
          committeeId={this.props.committeeId}
        />
      </div>
    );
  }
}

export default EditCommitteeHeader;
