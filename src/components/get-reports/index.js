/*
import React, { Component } from 'react';
import axios from 'axios';
import { Select } from 'antd';

const { Option } = Select;

class GetReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      committees: [],
      commiteeInfo: [],
    };

    this.fetchCommitee = this.fetchFaculty.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  fetchCommittee() {
    axios
      .get('/api/committees')
      .then(response => {
        this.setState({
          committees: response.data,
          loading: false,
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
      showInfo: true,
    });
  }

  componentDidMount() {
    this.fetchFaculty();
  }

  render() {
    const options = this.state.facultyMembers.map(faculty => (
      <Option key={faculty.email} value={faculty.full_name}>
        {faculty.full_name}
      </Option>
    ));

    return (
        <div>
            <h1>Get committee info here</h1>
            <div>
              {options}
            </div>
        </div>
    );
  }
}

export default GetReports;
*/
