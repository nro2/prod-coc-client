import React from 'react';
import { Modal, Form, Divider, Input, InputNumber } from 'antd';

class EditHeaderForm extends React.Component {
  state = {
    selected: '',
    totalSlots: this.props.data['totalSlots'],
    description: this.props.data['description'],
    name: this.props.data['name'],
    showForm: true,
  };

  resetState = () => {
    this.setState({
      selected: '',
      totalSlots: this.props.data['totalSlots'],
      description: this.props.data['description'],
      name: this.props.data['name'],
    });
  };

  onSubmitHandler = () => {
    this.props.onCreate(this.state.selected);
  };

  onCancelHandler = () => {
    this.setState({
      selected: '',
    });
    this.props.onCancel();
  };

  render() {
    const { visible, form, layout, okText, title } = this.props;
    const { getFieldDecorator } = form;

    const slotsConfig = {
      initialValue: this.state.totalSlots,
      rules: [
        {
          type: 'number',
          required: true,
          message: 'Please select a requirement!',
        },
      ],
    };

    const nameConfig = {
      initialValue: this.state.name,
      rules: [
        {
          type: 'string',
          required: true,
          message: 'Committee must have a name',
        },
      ],
    };

    const { TextArea } = Input;
    return (
      <Modal
        visible={visible}
        title={title || 'Create a new collection'}
        okText={okText || 'Save'}
        onCancel={this.onCancelHandler}
        onOk={this.onSubmitHandler}
        okButtonProps={{ disabled: !this.state.showForm }}
        destroyOnClose
      >
        <Form layout={layout || 'vertical'}>
          <Divider orientation="left" />
          <Form.Item label="Name">
            {' '}
            {getFieldDecorator('name', nameConfig)(<Input />)}
          </Form.Item>
          <Form.Item label="Description">
            {' '}
            {getFieldDecorator('description', {
              initialValue: this.state.description,
            })(<TextArea rows={4} />)}
          </Form.Item>
          <Form.Item label="Total slots">
            {' '}
            {getFieldDecorator('totalSlots', slotsConfig)(<InputNumber min={1} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const WrappedDisplayForm = Form.create({ name: 'EditHeaderForm' })(EditHeaderForm);

export default WrappedDisplayForm;
