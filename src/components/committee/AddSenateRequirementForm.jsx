import React from 'react';
import {
  Modal,
  Form,
  Divider,
  DatePicker,
  Select,
  Descriptions,
  InputNumber,
} from 'antd';
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

  resetState = () => {
    this.setState({
      selected: '',
      showForm: false,
    });
  };

  onSubmitHandler = () => {
    this.props.onCreate(this.state.selected);
  };

  onCancelHandler = () => {
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

    const faculty = this.props.dataMembers.find(
      faculty => faculty.senate_division_short_name === this.state.selected
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
      rules: [
        {
          type: 'object',
          required: true,
          message: 'Please select a senate division!',
        },
      ],
    };

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
        <SearchDropDown
          dataMembers={options}
          onChange={this.changeHandler}
          placeholder="Select Senate Division"
          dividerText="Slot Requirements"
        />
        <Descriptions>{items}</Descriptions>
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
