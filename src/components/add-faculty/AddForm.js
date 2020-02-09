import { Form, Input, Select, Button } from 'antd';
import React from 'react';
import axios from 'axios';
//import { Redirect } from 'react-router-dom';

const { Option } = Select;

class AddFacultyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      showForm: false,
      confirmDirty: false,
      senateDivisions: [],
      departmentsList: [],
      error: {},
      loadingDivisions: true,
      loadingDepartments: true,

      departments: [],
      redirectToGetFaculty: false,
    };

    this.fetchDivisions = this.fetchDivisions.bind(this);
    this.fetchDepartments = this.fetchDepartments.bind(this);
  }

  changeHandler = value => {
    this.setState({
      selected: value,
      showForm: true,
    });
  };

  onSubmitHandler = () => {
    this.props.onCreate(this.state.selected);
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

  /*  handleChange(value) {
    this.setState({
      senateDivision: value,
    });
  }

  handleChangeD(value) {
    this.setState({
      departmentsList: value,
    });
  }
*/
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

  /* handleSubmit = e => {
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
  };*/

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

    const { layout } = this.props;
    const { getFieldDecorator } = this.props.form;

    /*   const redirect = this.state.redirectToGetFaculty;
    if (redirect === true) {
      return <Redirect to="/get-faculty" />;
    }*/

    return (
      <Form layout={layout || 'vertical'}>
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
          <Select
            showSearch
            placeholder="Select a senate division"
            onChange={this.changeHandler}
            optionFilterProp="children"
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
            onChange={this.changeHandler}
            dropdownMatchSelectWidth={false}
            loadingDepartments={this.state.loading}
          >
            {divisionOptions}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" onSubmit={this.onSubmitHandler}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedDisplayForm = Form.create({ name: 'AddFaculty' })(AddFacultyForm);

export default WrappedDisplayForm;
