import { Form, Input, Select, Button } from 'antd';
import React from 'react';
import axios from 'axios';

const { Option } = Select;

class AddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      senateDivisions: [],
      departments: [],
      text: '',
      error: {},
      loading: true,
      loading2: true,

      _firstName: '',
      buffer: '',
      _lastName: '',
      _email: '',
      _jobTitle: '',
      _phoneNum: '',
      _senateDivision: '',
      _fullName: '',
      _departments: [],
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
    this.setState({ _firstName: event.target.value });
  };
  handleLnameChange = event => {
    this.setState({ _lastName: event.target.value });
  };
  handleEmailChange = event => {
    this.setState({ _email: event.target.value });
  };
  handleJobChange = event => {
    this.setState({ _jobTitle: event.target.value });
  };
  handlePhoneChange = event => {
    this.setState({ _phoneNum: event.target.value });
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
      _senateDivision: value,
    });
  }

  handleChangeD(value) {
    this.setState({
      _departments: value,
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
    axios
      .post('/api/faculty', {
        fullName: this.state._firstName + ' ' + this.state._lastName,
        email: this.state._email,
        jobTitle: this.state._jobTitle,
        phoneNum: this.state._phoneNum,
        senateDivision: this.state._senateDivision,
        departments: this.state._departments,
      })
      .then(() => {
        this.setState({
          text: 'Data insert was a success',
        });
      })
      .catch(err => {
        this.setState({
          text: 'Insert was not successful',
        });
        console.log(err);
      });

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const SenateOptions = this.state.senateDivisions.map(senateDivision => (
      <Option
        key={senateDivision.senate_division_short_name}
        value={senateDivision.senate_division_short_name}
      >
        {senateDivision.senate_division_short_name}
      </Option>
    ));
    const DevisionOptions = this.state.departments.map(departments => (
      <Option key={departments.name} value={departments.name}>
        {departments.name}
      </Option>
    ));

    const { getFieldDecorator } = this.props.form;

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
            loading={this.state.loading}
          >
            {SenateOptions}
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
            loading={this.state.loading}
          >
            {DevisionOptions}
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
