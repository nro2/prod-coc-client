import { Form, Input, Empty, Result, Select, Button } from 'antd';
import React from 'react';
//  import ReactDOM from 'react-dom';
import axios from 'axios';

const { Option } = Select;

class AddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      senateDivisions: [],
      text: '',
      error: {},
      loading: true,

      autoCompleteResult: [],
      _firstName: '',
      buffer: '',
      _lastName: '',
      _email: '',
      _jobTitle: '',
      _phoneNum: '',
      _senateDivision: '',
      _fullName: '',
    };

    //  this.addItem = this.addItem.bind(this);
    this.fetchDivisions = this.fetchDivisions.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
      senateDivision: value,
    });
  }

  componentDidMount() {
    this.fetchDivisions();
  }
  renderBody = () => {
    if (this.state.selected === 0) {
      return (
        <div className="aligner-item">
          <Empty />
        </div>
      );
    }

    if (Object.keys(this.state.error).length !== 0) {
      return (
        <div className="aligner-item">
          <Result
            status="500"
            title={this.state.error.code}
            subTitle={this.state.error.message}
          />
        </div>
      );
    }
  };

  handleSubmit = e => {
    axios
      .post('/api/faculty', {
        fullName: this.state._firstName + ' ' + this.state._lastName,
        email: this.state._email,
        jobTitle: this.state._jobTitle,
        phoneNum: this.state._phoneNum,
        senateDivision: this.state.senateDivision,
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
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleWebsiteChange = value => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(
        domain => `${value}${domain}`
      );
    }
    this.setState({ autoCompleteResult });
  };

  addItem(e) {
    //   this.state._fullName = `${this.state._firstName} ${this.state.lastName}`;
    axios
      .post('/api/faculty', {
        fullName: this.state._firstName + ' ' + this.state._lastName,
        email: this.state._email,
        jobTitle: this.state._jobTitle,
        phoneNum: this.state._phoneNum,
        senateDivision: this.state.senateDivision,
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
  }

  render() {
    const options = this.state.senateDivisions.map(senate_division => (
      <Option
        key={senate_division.senate_division_short_name}
        value={senate_division.senate_division_short_name}
      >
        {senate_division.senate_division_short_name}
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
                message: 'Please input Faculty first name!',
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
                message: 'Please input Faculty Last name!',
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
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input faculty E-mail!',
              },
            ],
          })(<Input placeholder="Email" onChange={this.handleEmailChange} />)}
        </Form.Item>
        <Form.Item label="Job Title">
          {getFieldDecorator('job', {
            rules: [{ required: false, message: 'Please input Job Title!' }],
          })(<Input placeholder="Job Title" onChange={this.handleJobChange} />)}
        </Form.Item>
        <Form.Item label="Phone Number">
          {getFieldDecorator('phone', {
            rules: [
              { required: false, message: 'Please input faculty phone number!' },
            ],
          })(
            <Input placeholder="###-###-####" onChange={this.handlePhoneChange} />
          )}
        </Form.Item>
        <Form.Item label="Senate Division">
          <Select
            className="aligner-item aligner-item--bottom-left select"
            showSearch
            placeholder="Select a senate division"
            optionFilterProp="children"
            onChange={this.handleChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            dropdownMatchSelectWidth={false}
            //size="small"
            loading={this.state.loading}
          >
            {options}
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
//const WrappedRegistrationForm = Form.create({ name: 'register' })(AddForm);

//ReactDOM.render(<WrappedRegistrationForm />, mountNode);

// export default AddForm;
