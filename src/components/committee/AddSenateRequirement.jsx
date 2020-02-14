import React from 'react';
import { Button, message } from 'antd';
import axios from 'axios';
import WrappedDisplayForm from './AddSenateRequirementForm.jsx';

class AddSenateRequirement extends React.Component {
  state = {
    visible: false,
    dataMembers: [],
    selected: '',
  };

  fetchData() {
    axios
      .get(this.props.endpoint)
      .then(response => {
        this.setState({
          dataMembers: response.data,
          loading: false,
          error: {},
        });
      })
      .catch(err => {
        this.setState({
          error: { message: err.response.data.error, code: err.response.status },
          loading: false,
        });
      });
  }

  showModal = () => {
    this.setState({ visible: true });
    this.fetchData();
  };

  handleCancel = () => {
    this.setState({ visible: false, selected: '' });
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
