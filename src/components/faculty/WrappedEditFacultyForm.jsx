import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

class EditFacultyForm extends React.Component {
  state = {
    selectedSenateDivision: '',
    selectedDepartments: [],
    initialDepartments: [],
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
      departmentAssociations.push();
      form.getFieldValue('departments').map(item => {
        this.props.faculty.departments.forEach(department => {
          if (item === department.name) {
            departmentAssociations.push(department.department_id);
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

  renderDepartments = () => {
    /*const handleChange = (value, option) => {
      const departments = value.map((name, index) => {
        const { key: department_id } = option[index];
        const { description } = option[index].props;
        return { department_id, name, description };
      });

      this.setState({
        selectedDepartments: departments,
      });
    };*/
    /*const defaultDepartments = [];
    if (this.props.faculty.departments !== null) {
      this.props.faculty.departments.forEach(department => {
        defaultDepartments.push(department.name);
      });
    }*/
    /*const divisionOptions = this.props.departments.map(department => (
      <Option
        key={department.department_id}
        value={department.name}
        description={department.description}
      >
        {department.name}
      </Option>
    ));*/
    /*return (
      <Select
        mode="multiple"
        showSearch
        placeholder="Select department(s)"
        defaultValue={defaultDepartments}
        optionFilterProp="children"
        onChange={handleChange}
        dropdownMatchSelectWidth={false}
      >
        {divisionOptions}
      </Select>
    );*/
  };

  initializeDepartments = () => {
    const defaultDepartments = [];
    if (this.props.faculty.departments !== null) {
      this.props.faculty.departments.forEach(department => {
        defaultDepartments.push({
          label: department.name,
          key: department.department_id,
        });
      });
      return defaultDepartments;
    }
  };

  /*handleChange = (value, option) => {
    const departments = value.map((name, index) => {
      const { key: department_id } = option[index];
      const { description } = option[index].props;
      return { department_id, name, description };
    });

    this.setState({
      selectedDepartments: departments,
    });
  };*/

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
      <Option key={69}>{department.name}</Option>
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
