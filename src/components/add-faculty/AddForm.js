import { Form, Input, Select, Button } from 'antd';
import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const { Option } = Select;

class AddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      senateDivisions: [],
      departmentsList: [],
      error: {},
      loadingDivisions: true,
      loadingDepartments: true,

      firstName: '',
      lastName: '',
      email: '',
      jobTitle: '',
      phoneNum: '',
      senateDivision: '',
      fullName: '',
      departments: [],
      redirectToGetFaculty: false,
    };

    this.fetchDivisions = this.fetchDivisions.bind(this);
    this.fetchDepartments = this.fetchDepartments.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeD = this.handleChangeD.bind(this);
    this.handleFnameChange = this.handleFnameChange.bind(this);
    this.handleLnameChange = this.handleLnameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleJobChange = this.handleJobChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
  }
  handleFnameChange = event => {
    this.setState({ firstName: event.target.value });
  };
  handleLnameChange = event => {
    this.setState({ lastName: event.target.value });
  };
  handleEmailChange = event => {
    this.setState({ email: event.target.value });
  };
  handleJobChange = event => {
    this.setState({ jobTitle: event.target.value });
  };
  handlePhoneChange = event => {
    this.setState({ phoneNum: event.target.value });
  };

  fetchDivisions() {
    axios
      .get('/api/senate-divisions')
      .then(response => {
        this.setState({
          senateDivisions: response.data,
          loading: false,
          selected: 0,
          error: {},
        });
      })
      .catch(err => {
        this.setState({
          error: { message: err.response.data.error, code: err.response.status },
          loading: false,
        });
      });
  }

  handleChange(value) {
    this.setState({
      senateDivision: value,
    });
  }

  handleChangeD(value) {
    this.setState({
      departmentsList: value,
    });
  }

  fetchDepartments() {
    axios
      .get('/api/departments')
      .then(response => {
        this.setState({
          departments: response.data,
          loading2: false,
          selected: 0,
          error: {},
        });
      })
      .catch(err => {
        this.setState({
          error: { message: err.response.data.error, code: err.response.status },
          loading: false,
        });
      });
  }

  componentDidMount() {
    this.fetchDivisions();
    this.fetchDepartments();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        axios
          .post('/api/faculty', {
            fullName: this.state.firstName + ' ' + this.state.lastName,
            email: this.state.email,
            jobTitle: this.state.jobTitle,
            phoneNum: this.state.phoneNum,
            senateDivision: this.state.senateDivision,
            departments: this.state.departments,
          })
          .then(() => {
            this.setState({
              redirectToGetFaculty: true,
            });
          })
          .catch(err => {
            this.setState({
              text: 'Insert was not successful',
            });
            console.log(err);
          });
      }
    });
  };

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
      <Option key={departments.name} value={departments.name}>
        {departments.name}
      </Option>
    ));

    const { getFieldDecorator } = this.props.form;

    const redirect = this.state.redirectToGetFaculty;
    if (redirect === true) {
      return <Redirect to="/get-faculty" />;
    }

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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <h1>Add New faculty</h1>
        <Form.Item label="First Name">
          {getFieldDecorator('first', {
            rules: [
              {
                required: true,
                message: 'Please input first name',
                whitespace: true,
              },
            ],
          })(<Input placeholder="First Name" onChange={this.handleFnameChange} />)}
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
          })(<Input placeholder="Last Name" onChange={this.handleLnameChange} />)}
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
          })(<Input placeholder="Email" onChange={this.handleEmailChange} />)}
        </Form.Item>
        <Form.Item label="Job Title">
          {getFieldDecorator('job', {
            rules: [{ required: false, message: 'Please input job title' }],
          })(<Input placeholder="Job Title" onChange={this.handleJobChange} />)}
        </Form.Item>
        <Form.Item label="Phone Number">
          {getFieldDecorator('phone', {
            rules: [{ required: false, message: 'Please input phone number' }],
          })(
            <Input placeholder="###-###-####" onChange={this.handlePhoneChange} />
          )}
        </Form.Item>
        <Form.Item label="Senate Division">
          <Select
            showSearch
            placeholder="Select a senate division"
            optionFilterProp="children"
            onChange={this.handleChange}
            dropdownMatchSelectWidth={false}
            loadingDivisions={this.state.loading}
          >
            {senateOptions}
          </Select>
        </Form.Item>
        <Form.Item label="Department">
          <Select
            mode="multiple"
            showSearch
            placeholder="Select department(s)"
            optionFilterProp="children"
            onChange={this.handleChangeD}
            dropdownMatchSelectWidth={false}
            loadingDepartments={this.state.loading}
          >
            {divisionOptions}
          </Select>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <p>Message: {this.state.text}</p>
      </Form>
    );
  }
}

export default Form.create()(AddForm);
