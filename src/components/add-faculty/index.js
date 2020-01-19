import React, { Component } from 'react';
import axios from 'axios';
import { Empty, Result, Select /*Menu, Dropdown, Icon*/ } from 'antd';

const { Option } = Select;

class AddFaculty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      senateDivisions: [],
      text: '',
      error: {},
      loading: true,
    };

    this.addItem = this.addItem.bind(this);
    this.fetchDivisions = this.fetchDivisions.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
      selected: value,
    });
    this._senateDivision = value;
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

  addItem(e) {
    this._fullName.value = `${this._firstName.value} ${this.lastName.value}`;
    axios
      .post('http://localhost:8080/faculty', {
        fullName: this._fullName.value,
        email: this._email.value,
        jobTitle: this._jobTitle.value,
        phoneNum: this._phoneNum.value,
        senateDivision: this._senateDivision,
      })
      .then(() => {
        this.setState({
          text: 'Data insert was a success',
        });
        this._firstName.value = '';
        this._lastName.value = '';
        this._email.value = '';
        this._jobTitle.value = '';
        this._phoneNum.value = '';
        this._senateDivision = '';
        this._fullName = '';
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

    return (
      <div className="Add">
        <h1>Add faculty here</h1>
        <p>Message: {this.state.text}</p>
        <form onSubmit={this.addItem}>
          <input ref={a => (this._firstName = a)} placeholder="First Name" />
          <input ref={a => (this._lastName = a)} placeholder="Last Name" />
          <input ref={a => (this._email = a)} placeholder="Email" />
          <input ref={a => (this._jobTitle = a)} placeholder="Job Title" />
          <input ref={a => (this._phoneNum = a)} placeholder="Phone Number" />
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
        </form>
      </div>
    );
  }
}

export default AddFaculty;
