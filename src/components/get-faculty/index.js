import React, { Component } from 'react';
import axios from 'axios';
import { Empty, Result, Select } from 'antd';

const { Option } = Select;

class GetFaculty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      firstName: '',
      lastName: '',
      phoneNum: '',
      showInfo: false,
    };

    this.getItem = this.getItem.bind(this);
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

  handleChange(value) {
    this.setState({
      selected: value,
    });
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

    return (
      // TODO: render an actual committee component here (CF1-52)
      <div>
        {JSON.stringify(
          this.state.firstName.find(
            faculty => faculty.firstName === this.state.selected
          )
        )}
      </div>
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      showInfo: true,
      selected: null,
    });
  };

  render() {
    const options /*this.state.firstName.map(faculty => (
      <Option key={faculty.firstName} value={faculty.firstName}>
        {faculty.firstName}
      </Option>*/ = (
      /*
      <Option key={this.state.firstName} value={this.state.firstName}>

      </Option>*/
      <Option value={this.state.firstName}>person1</Option>
    );
    return (
      <div className="Get">
        <h1>Get faculty info here</h1>
        <p>Message:{this.state.text}</p>
        {/*
        <form onSubmit={this.getItem}>
          <input ref={a => (this._aName = a)} placeholder="Faculty member name" />
          <button type="submit">Submit</button>
        </form>*/}
        <Select
          showSearch
          className="aligner-item-center select"
          placeholder="Search for a faculty member"
          optionFilterProp="children"
          onChange={this.handleChange}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          dropdownMatchSelectWidth={false}
          size="large"
          loading={this.state.loading}
        >
          {options}
        </Select>
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
        </form>
      </div>
    );
  }
}

export default GetFaculty;
