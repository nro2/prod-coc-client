import React from 'react';
import { Modal, Form, Divider, DatePicker, Select, Descriptions } from 'antd';
import SearchDropDown from '../common/SearchDropDown.jsx';

const { Option } = Select;

class AddMemberAssignmentForm extends React.Component {
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

    const options = this.props.dataMembers.map(committee => (
      <Option key={committee.committee_id}>{committee.name}</Option>
    ));

    const committee = this.props.dataMembers.find(
      committee => committee.committee_id === parseInt(this.state.selected)
    );

    let items = [];

    if (committee !== undefined) {
      Object.entries(committee).forEach(([key, value]) => {
        if (key === 'name' || key === 'total_slots') {
          items.push(
            <Descriptions.Item key={key} label={key}>
              {value}
            </Descriptions.Item>
          );
        }
      });
    }

    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select date!' }],
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
          placeholder="Select Committee"
          dividerText="Committee Info"
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

const WrappedDisplayForm = Form.create({ name: 'AddMemberAssignment' })(
  AddMemberAssignmentForm
);

export default WrappedDisplayForm;
