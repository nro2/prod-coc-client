import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

class EditFacultyForm extends React.Component {
  state = {
    selectedSenateDivision: '',
  };

  /**
   * Triggers when the "Save" button is clicked, invoking the callback function
   * from the parent component with an updated faculty object.
   */
  onSubmitHandler = () => {
    const { form } = this.props;
    const faculty = {
      ...this.props.faculty,
      name: form.getFieldValue('name'),
      phone: form.getFieldValue('phone'),
      job: form.getFieldValue('title'),
      senate: this.state.selectedSenateDivision,
    };

    this.props.onOk(faculty);
  };

  onCancelHandler = () => {
    this.props.onCancel();
  };

  renderSenateDivisions = () => {
    const handleChange = value => {
      this.setState({
        selectedSenateDivision: value,
      });
    };

    const senateOptions = this.props.senateDivisions.map(senateDivision => (
      <Option
        key={senateDivision.senate_division_short_name}
        value={senateDivision.senate_division_short_name}
      >
        {senateDivision.senate_division_short_name}
      </Option>
    ));

    return (
      <Select defaultValue={this.props.faculty.senate} onChange={handleChange}>
        {senateOptions}
      </Select>
    );
  };

  render() {
    const { visible, form, title, faculty } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        visible={visible}
        title={title}
        okText="Save"
        onCancel={this.onCancelHandler}
        onOk={this.onSubmitHandler}
        destroyOnClose
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="Name">
            {getFieldDecorator('name', {
              initialValue: faculty.name,
              rules: [
                {
                  required: true,
                  message: 'Please input the full name',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Phone">
            {getFieldDecorator('phone', {
              initialValue: faculty.phone,
              rules: [
                {
                  required: true,
                  message: 'Please input the phone number',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Title">
            {getFieldDecorator('title', {
              initialValue: faculty.job,
              rules: [
                {
                  required: true,
                  message: 'Please input the job title',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Senate Division">
            {this.renderSenateDivisions()}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const WrappedEditFacultyForm = Form.create({ name: 'EditFacultyForm' })(
  EditFacultyForm
);

export default WrappedEditFacultyForm;
