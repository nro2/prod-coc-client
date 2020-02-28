import React from 'react';
import { Modal, Form, Divider, DatePicker, Select, Descriptions } from 'antd';
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

  validateDate = (rule, value, callback) => {
    const { form } = this.props;
    if (
      value &&
      value.format('YYYY/MM/DD') <
        form.getFieldValue('start-date').format('YYYY/MM/DD')
    ) {
      callback('End date must come after start date.');
    } else {
      callback();
    }
  };

  render() {
    const { visible, form, layout, okText, title } = this.props;
    const { getFieldDecorator } = form;

    const options = this.props.dataMembers.map(faculty => (
      <Option key={faculty.email}>{faculty.full_name}</Option>
    ));

    const senateDivisions = this.props.senateDivisions.map(divisions => (
      <Option key={divisions.senate_division_short_name}>
        {divisions.senate_division_short_name}
      </Option>
    ));

    const faculty = this.props.dataMembers.find(
      faculty => faculty.email === this.state.selected
    );

    const items = [];

    if (faculty !== undefined) {
      Object.entries(faculty).forEach(([key, value]) =>
        items.push(
          <Descriptions.Item key={key} label={key}>
            {value}
          </Descriptions.Item>
        )
      );
    }

    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select date!' }],
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
          filter={senateDivisions}
          filterPlaceholder="Filter by Senate Division"
          dataMembers={options}
          onChange={this.handleChange}
          placeholder="Select Faculty"
          dividerText="Faculty Info"
        />
        <Descriptions>{items}</Descriptions>
        {this.state.showForm && (
          <Form layout={layout || 'vertical'}>
            <Divider orientation="left" />
            <Form.Item label="Start Date">
              {' '}
              {getFieldDecorator('start-date', config)(<DatePicker />)}
            </Form.Item>
            <Form.Item label="End Date">
              {' '}
              {getFieldDecorator('end-date', {
                rules: [
                  {
                    type: 'object',
                    required: true,
                    message: 'Please select date!',
                  },
                  {
                    validator: this.validateDate,
                  },
                ],
              })(<DatePicker />)}
            </Form.Item>
          </Form>
        )}
      </Modal>
    );
  }
}

const WrappedDisplayForm = Form.create({ name: 'AddCommitteeAssignment' })(
  AddCommitteeAssignmentForm
);

export default WrappedDisplayForm;
