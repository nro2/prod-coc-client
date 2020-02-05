import React, { Component } from 'react';
import axios from 'axios';
import { Descriptions } from 'antd';
import './get-reports.css';

class GetReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      committees: [],
      committeeInfo: [],
      dataLoaded: false,
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
    const id = this.state.committees.map(committee => {
      return committee.committee_id;
    });
    /*
    let promises = [];

    for (var i = 0; i < id.length; i++) {
      promises
        .push(
          axios.get(`/api/committee/info/${id[i]}`).then(response => {
            this.state.committeeInfo.push(response);
            this.setState({
              loading: false,
              dataLoaded: true,
              error: {},
            });
          })
        )
        .catch(err => {
          this.setState({
            error: { message: err.response.data.error, code: err.response.status },
            loading: false,
          });
        });
    }
    */

    axios.get(`/api/committee/info/${id[0]}`).then(response => {
      this.setState({
        committeeInfo: response.data,
        dataLoaded: true,
        loading: false,
        error: {},
      });
    });
  }

  componentDidMount() {
    this.fetchCommittees();
    this.fetchCommitteeInfo();
  }

  render() {
    /*
    const Name = this.state.committees.map(committee => {
      return (
        <li key={`committee-${committee.committee_id}`}>
          {committee.name + ' ID: ' + committee.committee_id}
        </li>
      );
    });*/
    /*
    const Info = this.state.committeeInfo.map(committeeinfo => {
      return (
        <li key={`committee-${committeeinfo.committee_id}`}>
          {committeeinfo.name}
        </li>
      );
    });*/

    const facultyname = this.state.committeeInfo.committeeAssignment.map(name => {
      return <li key={`name.facultyName`}>{name.facultyName}</li>;
    });

    return (
      <div>
        <h1>Reports</h1>
        <div>
          {this.state.dataLoaded &&
            +(
              <React.Fragment>
                <Descriptions
                  title={this.state.committeeInfo['name']}
                  layout="vertical"
                  bordered
                >
                  <Descriptions.Item label="Description">
                    {this.state.committeeInfo['description']}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Slots">
                    {this.state.committeeInfo['totalSlots']}
                  </Descriptions.Item>
                  <Descriptions.Item label="Slots Remaining">
                    {this.state.committeeInfo['slotsRemaining']}
                  </Descriptions.Item>
                </Descriptions>

                <Descriptions title="Members" layout="vertical" bordered>
                  <Descriptions.Item label="Name">{facultyname}</Descriptions.Item>
                  <Descriptions.Item label="Email">{}</Descriptions.Item>
                  <Descriptions.Item label="Start Date">{}</Descriptions.Item>
                  <Descriptions.Item label="End Date">{}</Descriptions.Item>
                  <Descriptions.Item label="Senate Division">{}</Descriptions.Item>
                </Descriptions>
              </React.Fragment>
            )}
        </div>
      </div>
    );
  }
}
export default GetReports;
