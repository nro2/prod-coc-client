import React from 'react';
import { Form, DatePicker, Descriptions, Divider } from 'antd';

class AddMemberForm extends React.Component {
  state = {
    confirmDirty: false,
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select date!' }],
    };

    return (
      this.props.visible && (
        <Form layout={this.props.layout || 'vertical'} onSubmit={this.handleSubmit}>
          <Descriptions layout="vertical">{this.props.dataMembers}</Descriptions>
          <Divider orientation="left" />
          <Form.Item label="Start Date">
            {' '}
            {getFieldDecorator('start-date', config)(<DatePicker />)}
          </Form.Item>
          <Form.Item label="End Date">
            {' '}
            {getFieldDecorator('end-date', config)(<DatePicker />)}
          </Form.Item>
        </Form>
      )
    );
  }
}

const WrappedDisplayForm = Form.create({ name: 'AddCommitteeAssignment' })(
  AddMemberForm
);

export default WrappedDisplayForm;
