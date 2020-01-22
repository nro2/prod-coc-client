import React, { Component } from 'react';
import axios from 'axios';
import {
  Empty,
  Result,
  Select,
  Form,
  Input,
  // Button,
  //Icon,
  //Tooltip,
  //Cascader,
  //Row,
  //Col,
  //Checkbox,
  // AutoComplete /*Menu, Dropdown, Icon*/,
} from 'antd';

const { Option } = Select;

class AddFaculty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      senateDivisions: [],
      text: '',
      error: {},
      loading: true,
      _firstName: '',
      buffer: '',
      _lastName: '',
      _email: 'rat',
      _jobTitle: 'asd',
      _phoneNum: 'asd',
      _senateDivision: 'AO',
      _fullName: '',
    };

    this.addItem = this.addItem.bind(this);
    this.fetchDivisions = this.fetchDivisions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFnameChange = this.handleFnameChange.bind(this);
    this.handleLnameChange = this.handleLnameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleJobChange = this.handleJobChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
  }

  fetchDivisions() {
    axios
      .get('http://localhost:8080/senate-divisions')
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

  addItem(e) {
    //   this.state._fullName = `${this.state._firstName} ${this.state.lastName}`;
    axios
      .post('http://localhost:8080/faculty', {
        fullName: this.state._firstName + ' ' + this.state._lastName,
        email: this.state._email,
        jobTitle: this.state._jobTitle,
        phoneNum: this.state._phoneNum,
        senateDivision: this.state.senateDivision,
      })
      .then(() => {
        /*       this.setState({
          text: 'Data insert was a success',
          _firstName: '',
          _lastName: '',
          _email: '',
          _jobTitle: '',
          _phoneNum: '',
          _senateDivision: '',
          _fullName: '',
        });*/
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
    //   const { getFieldDecorator} = this.props.form;
    const options = this.state.senateDivisions.map(senate_division => (
      <Option
        key={senate_division.senate_division_short_name}
        value={senate_division.senate_division_short_name}
      >
        {senate_division.senate_division_short_name}
      </Option>
    ));

    return (
      <div className="Add">
        <h1>Add faculty here</h1>

        <Form onSubmit={this.addItem}>
          <Input
            placeholder="First Name"
            size="small"
            //value ={this.state.fullName}
            onChange={this.handleFnameChange}
          />
          <Input
            placeholder="Last Name"
            size="small"
            onChange={this.handleLnameChange}
          />
          <Input
            placeholder="Email"
            size="small"
            onChange={this.handleEmailChange}
          />
          <Input
            placeholder="Job Title"
            size="small"
            onChange={this.handleJobChange}
          />
          <Input
            placeholder="Phone Number"
            size="small"
            onChange={this.handlePhoneChange}
          />
          <Select
            className="aligner-item aligner-item--bottom-left select"
            showSearch
            placeholder="Select a senate devision"
            optionFilterProp="children"
            onChange={this.handleChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            dropdownMatchSelectWidth={false}
            size="small"
            loading={this.state.loading}
          >
            {options}
          </Select>

          <button type="submit">Submit</button>
        </Form>
        <p>Message: {this.state.text}</p>
      </div>
    );
  }
}

export default AddFaculty;
