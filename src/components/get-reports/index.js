import React, { Component } from 'react';
import axios from 'axios';
import { Descriptions } from 'antd';

class GetReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      committees: [],
      committeeInfo: [],
    };

    this.fetchCommittees = this.fetchCommittees.bind(this);
  }

  fetchCommittees() {
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

  fetchCommitteeInfo() {
    //var Name = this.state.committees;
    const id = this.state.committees.map(committee => {
      return (
        <li key={`committee-${committee.committee_id}`}>
          {committee.committee_id}
        </li>
      );
    });

    axios
      .get(`/api/committeeInfo/${id}`)
      .then(response => {
        this.setState({
          committeeInfo: response.data,
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

  componentDidMount() {
    this.fetchCommittees();
    this.fetchCommitteeInfo();
  }

  render() {
    const Name = this.state.committees.map(committee => {
      return (
        <li key={`committee-${committee.committee_id}`}>
          {committee.name + ' ID: ' + committee.committee_id}
        </li>
      );
    });

    const Info = this.state.committeeInfo.map(committeeinfo => {
      return (
        <li key={`committee-${committeeinfo.committee_id}`}>
          {committeeinfo.committee_id +
            committeeinfo.name +
            committeeinfo.description +
            committeeinfo.total_slots}
        </li>
      );
    });

    return (
      <div>
        <h1>Get Reports Here</h1>
        <div>
          <Descriptions>
            <Descriptions.Item label="">{Name}</Descriptions.Item>
            <Descriptions.Item label="Description">{}</Descriptions.Item>
            <Descriptions.Item label="Total Slots">{}</Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="Members">{}</Descriptions.Item>
            <Descriptions.Item label="Start Date">{}</Descriptions.Item>
            <Descriptions.Item label="End Date">{}</Descriptions.Item>
          </Descriptions>
          {Info}
        </div>
      </div>
    );
  }
}
export default GetReports;
