import { Form, Input, Select, Button, message } from 'antd';
import React from 'react';
import axios from 'axios';

const { Option } = Select;

class AddFacultyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      senateDivisions: [],
      departments: [],
    };

    this.fetchDivisions = this.fetchDivisions.bind(this);
    this.fetchDepartments = this.fetchDepartments.bind(this);
  }

  componentDidMount() {
    this.fetchDivisions();
    this.fetchDepartments();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.postAssignment(
          values['first'] + ' ' + values['last'],
          values['email'],
          values['job'],
          values['phone'],
          values['select'],
          values['select-multiple']
        )
          .then(() => {
            this.props.onSuccess(values['email']);
          })
          .catch(err => {
            console.log(err.response);
          });
      }
    });
  };

  postAssignment = async (
    fullname,
    email,
    jobTitle,
    phoneNum,
    senateDivision,
    departments
  ) => {
    if (departments) {
      const departmentAssociations = departments.map(item => {
        return {
          department_id: item,
        };
      });

      const res = await axios.post('/api/faculty', {
        fullName: fullname,
        email: email,
        jobTitle: jobTitle,
        phoneNum: phoneNum,
        senateDivision: senateDivision,
        departmentAssociations: departmentAssociations,
      });
      return res;
    } else {
      const res = await axios.post('/api/faculty', {
        fullName: fullname,
        email: email,
        jobTitle: jobTitle,
        phoneNum: phoneNum,
        senateDivision: senateDivision,
      });
      return res;
    }
  };

  fetchDivisions() {
    const errorMessages = {
      404: 'Found no senate divisions',
      500: 'Unable to retrieve record',
    };

    const handleErrors = error => {
      const { status } = error.response;
      const errorMessage = errorMessages[status];

      if (!errorMessage) {
        message.error('Unknown error');
      } else {
        message.error(errorMessage);
      }
    };

    axios
      .get('/api/senate-divisions')
      .then(response => {
        this.setState({
          senateDivisions: response.data,
        });
      })
      .catch(err => {
        handleErrors(err);
      });
  }

  fetchDepartments() {
    const errorMessages = {
      400: 'Missing field(s) in request',
      404: 'Found no matching department',
      500: 'Unable to retrieve record',
    };

    const handleErrors = error => {
      const { status } = error.response;
      const errorMessage = errorMessages[status];

      if (!errorMessage) {
        message.error('Unknown error');
      } else {
        message.error(errorMessage);
      }
    };

    axios
      .get('/api/departments')
      .then(response => {
        this.setState({
          departments: response.data,
        });
      })
      .catch(err => {
        handleErrors(err);
      });
  }

  render() {
    const senateOptions = this.state.senateDivisions.map(senateDivision => (
      <Option
        key={senateDivision.senate_division_short_name}
        value={senateDivision.senate_division_short_name}
      >
        {senateDivision.senate_division_short_name}
      </Option>
    ));
    const divisionOptions = this.state.departments.map(departments => (
      <Option key={departments.department_id} value={departments.department_id}>
        {departments.name}
      </Option>
    ));

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    return (
      <Form onSubmit={this.handleSubmit} {...formItemLayout} labelAlign="left">
        <h1>Add New faculty</h1>
        <Form.Item label="First Name">
          {getFieldDecorator('first', {
            rules: [
              {
                required: true,
                message: 'Please input first name',
                whitespace: true,
                labelAlign: 'left',
              },
            ],
          })(<Input placeholder="First Name" />)}
        </Form.Item>
        <Form.Item label="Last Name">
          {getFieldDecorator('last', {
            rules: [
              {
                required: true,
                message: 'Please input last name',
                whitespace: true,
              },
            ],
          })(<Input placeholder="Last Name" />)}
        </Form.Item>
        <Form.Item label="E-mail">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid e-mail',
              },
              {
                required: true,
                message: 'Please input  e-mail',
              },
            ],
          })(<Input placeholder="Email" />)}
        </Form.Item>
        <Form.Item label="Job Title">
          {getFieldDecorator('job', {
            rules: [{ required: false, message: 'Please input job title' }],
          })(<Input placeholder="Job Title" />)}
        </Form.Item>
        <Form.Item label="Phone Number">
          {getFieldDecorator('phone', {
            rules: [{ required: false, message: 'Please input phone number' }],
          })(<Input placeholder="###-###-####" />)}
        </Form.Item>
        <Form.Item label="Senate Division">
          {getFieldDecorator('select', {
            rules: [{ required: true, message: 'Please select Senate Division' }],
          })(
            <Select
              showSearch
              placeholder="Select a senate division"
              optionFilterProp="children"
              dropdownMatchSelectWidth={false}
            >
              {senateOptions}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Department">
          {getFieldDecorator('select-multiple', {
            rules: [{ required: false, message: 'Please select Departments' }],
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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedDisplayForm = Form.create({ name: 'AddFaculty' })(AddFacultyForm);

export default WrappedDisplayForm;
