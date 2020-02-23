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
    const senate =
      this.state.selectedSenateDivision === ''
        ? this.props.faculty.senate
        : this.state.selectedSenateDivision;

    const departmentAssociations = [];
    if (form.getFieldValue('departments').length) {
      form.getFieldValue('departments').map(item => {
        this.props.departments.forEach(department => {
          if (item === department.name) {
            departmentAssociations.push({
              department_id: department.department_id,
              name: department.name,
              description: department.description,
            });
          }
        });
      });
    }

    const faculty = {
      ...this.props.faculty,
      name: form.getFieldValue('name'),
      phone: form.getFieldValue('phone'),
      job: form.getFieldValue('title'),
      senate,
      departments: departmentAssociations,
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

    const defaultDepartments = [];
    if (this.props.faculty.departments !== null) {
      this.props.faculty.departments.map(department => {
        defaultDepartments.push({
          label: department.name,
          value: department.department_id,
        });
      });
    }

    const divisionOptions = this.props.departments.map(department => (
      <Option key={department.name}>{department.name}</Option>
    ));

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
              valuePropName: 'option',
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
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Title">
            {getFieldDecorator('title', {
              initialValue: faculty.job,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Senate Division">
            {this.renderSenateDivisions()}
          </Form.Item>
          <Form.Item label="Departments">
            {getFieldDecorator('departments', {
              initialValue: defaultDepartments.map(opt => opt && opt.label),
              rules: [{ required: false, type: 'array' }],
            })(
              <Select
                mode="multiple"
                showSearch
                placeholder="Select department(s)"
                optionFilterProp="children"
                dropdownMatchSelectWidth={false}
              >
                {divisionOptions}
              </Select>
            )}
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
