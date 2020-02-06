import React from 'react';
import { Modal, Form, Divider, DatePicker, Select, Descriptions } from 'antd';
import SearchDropDown from '../common/SearchDropDown.jsx';

const { Option } = Select;

class AddCommitteeAssignmentForm extends React.Component {
  state = {
    selected: '',
    showForm: false,
  };

  changeHandler = value => {
    this.setState({
      selected: value,
      showForm: true,
    });
  };

  onSubmitHandler = () => {
    this.props.onCreate(this.state.selected);
  };

  render() {
    const { visible, onCancel, form, layout, okText, title } = this.props;
    const { getFieldDecorator } = form;

    const options = this.props.dataMembers.map(faculty => (
      <Option key={faculty.email}>{faculty.full_name}</Option>
    ));

    const faculty = this.props.dataMembers.find(
      faculty => faculty.email === this.state.selected
    );

    let items = [];

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
        onCancel={onCancel}
        onOk={this.onSubmitHandler}
        destroyOnClose
      >
        <SearchDropDown
          dataMembers={options}
          onChange={this.changeHandler}
          placeholder="Select Faculty"
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
              {getFieldDecorator('end-date', config)(<DatePicker />)}
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
