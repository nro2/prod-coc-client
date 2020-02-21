import React from 'react';
import { Modal, Form, Divider, Select, Descriptions, InputNumber } from 'antd';
import SearchDropDown from '../common/SearchDropDown.jsx';

const { Option } = Select;

class AddCommitteeAssignmentForm extends React.Component {
  state = {
    selected: '',
    showForm: false,
  };

  handleChange = value => {
    this.setState({
      selected: value,
      showForm: true,
    });
  };

  resetState = () => {
    this.setState({
      selected: '',
      showForm: false,
    });
  };

  handleOk = () => {
    this.props.onCreate(this.state.selected);
  };

  handleCancel = () => {
    this.setState({
      selected: '',
      showForm: false,
    });
    this.props.onCancel();
  };

  render() {
    const { visible, form, layout, okText, title } = this.props;
    const { getFieldDecorator } = form;

    const options = this.props.dataMembers.map(senate => (
      <Option key={senate.senate_division_short_name}>
        {senate.senate_division_short_name}
      </Option>
    ));

    const senate = this.props.dataMembers.find(
      senate => senate.senate_division_short_name === this.state.selected
    );

    const items = [];

    if (senate !== undefined) {
      Object.entries(senate).forEach(([key, value]) => {
        if (key === 'name') {
          items.push(
            <Descriptions.Item key={key} label="Name">
              {value}
            </Descriptions.Item>
          );
        } else {
          items.push(
            <Descriptions.Item key={key} label="Abbreviation">
              {value}
            </Descriptions.Item>
          );
        }
      });
    }

    const config = {
      rules: [
        {
          type: 'number',
          required: true,
          message: 'Please select a requirement!',
        },
      ],
    };

    return (
      <Modal
        visible={visible}
        title={title || 'Create a new collection'}
        okText={okText || 'Save'}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        okButtonProps={{ disabled: !this.state.showForm }}
        destroyOnClose
      >
        <SearchDropDown
          dataMembers={options}
          onChange={this.handleChange}
          placeholder="Select Senate Division"
          dividerText="Slot Requirements"
        />
        <Descriptions layout="vertical">{items}</Descriptions>
        {this.state.showForm && (
          <Form layout={layout || 'vertical'}>
            <Divider orientation="left" />
            <Form.Item label="Slot Requirement">
              {' '}
              {getFieldDecorator('slotReq', config)(<InputNumber min={1} />)}
            </Form.Item>
          </Form>
        )}
      </Modal>
    );
  }
}

const WrappedDisplayForm = Form.create({ name: 'AddSenateRequirement' })(
  AddCommitteeAssignmentForm
);

export default WrappedDisplayForm;
