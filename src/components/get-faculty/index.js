import React, { Component } from 'react';
import axios from 'axios';
import { Empty, Result, Select } from 'antd';

const { Option } = Select;

class GetFaculty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      facultyMembers: [],
      text: '',
      firstName: '',
      lastName: '',
      phoneNum: '',
      showInfo: false,
    };

    this.getItem = this.getItem.bind(this);
    this.fetchFaculty = this.fetchFaculty.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getItem(e) {
    axios
      .get('http://127.0.0.1:8080', { params: { firstName: this._aName.value } })
      .then(response => {
        this.setState({
          text: 'Success',
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phoneNum: response.data.phoneNum,
        });
      })
      .catch(err => {
        this.setState({
          text: 'Bad Request',
          firstName: '',
          lastName: '',
          phoneNum: '',
        });
        console.log(err);
      });

    this._aName.value = '';

    e.preventDefault();
  }

  /*Gets the list of all faculty members for drop down select*/
  fetchFaculty() {
    axios
      .get('http://localhost:8080/faculty')
      .then(response => {
        this.setState({
          facultyMembers: response.data,
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
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      showInfo: true,
      selected: null,
    });
  };

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

    return (
      <div>
        {JSON.stringify(
          this.state.facultyMembers.find(
            faculty => faculty.full_name === this.state.selected
          )
        )}
      </div>
    );
  };

  render() {
    const options = this.state.facultyMembers.map(faculty => (
      <Option key={faculty.full_name} value={faculty.full_name}>
        {faculty.full_name}
      </Option>
    ));

    return (
      <div className="Get">
        <div>
          <h1>Get faculty info here</h1>
          {/*<p>Message:{this.state.text}</p>
          <form onSubmit={this.getItem}>
            <input ref={a => (this._aName = a)} placeholder="Faculty member name" />
            <button type="submit">Submit</button>
          </form>*/}
          <div>
            <Select
              showSearch
              className="aligner-item-center select"
              placeholder="Search for a faculty member"
              optionFilterProp="children"
              onChange={this.handleChange}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
                0
              }
              dropdownMatchSelectWidth={false}
              size="large"
              loading={this.state.loading}
            >
              {options}
            </Select>
          </div>
          {/*this.renderBody()*/}
        </div>
        {/*
        <button type="submit" onClick={this.handleSubmit}>
          Submit
        </button>
        <form id="show-faculty-info">
          {this.state.showInfo && (
            <p>
              First Name:{this.state.firstName}
              <br></br>
              Last Name:{this.state.lastName}
              <br></br>
              Phone Number: {this.state.phoneNum}
            </p>
          )}
        </form>*/}
      </div>
    );
  }
}

export default GetFaculty;
