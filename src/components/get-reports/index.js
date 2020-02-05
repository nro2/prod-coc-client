import React, { Component } from 'react';
import axios from 'axios';
import { Descriptions } from 'antd';
import './get-reports.css';
import MembersTable from './MembersTable.js';
import RequirementsTable from './RequirementsTable.js';

class GetReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      committeeInfo: [],
      dataLoaded: false,
    };
    this.fetchCommitteeInfo = this.fetchCommitteeInfo.bind(this);
  }

  fetchCommitteeInfo() {
    axios
      .get('/api/committees')
      .then(response => {
        let promises = [];
        for (var i = 0; i < response.data.length; i++) {
          promises.push(
            axios
              .get(`/api/committee/info/${response.data[i].committee_id}`)
              .then(response => {
                this.state.committeeInfo.push(response.data);
                this.setState({
                  dataLoaded: true,
                });
              })
              .catch(err => {
                this.setState({
                  error: {
                    message: err.response.data.error,
                    code: err.response.status,
                  },
                  loading: false,
                });
              })
          );
        }
      })
      .catch(err => {
        this.setState({
          error: { message: err.response.data.error, code: err.response.status },
          loading: false,
        });
      });
  }

  componentDidMount() {
    this.fetchCommitteeInfo();
  }

  render() {
    return (
      <div>
        <h1>Reports</h1>
        <div>
          {this.state.dataLoaded && (
            <React.Fragment>
              testing retrieving date=
              {this.state.committeeInfo[0].committeeAssignment['startDate']}
              <Descriptions
                title={this.state.committeeInfo[0]['name']}
                layout="vertical"
                bordered
              >
                <Descriptions.Item label="Description">
                  {this.state.committeeInfo[0]['description']}
                </Descriptions.Item>
                <Descriptions.Item label="Total Slots">
                  {this.state.committeeInfo[0]['totalSlots']}
                </Descriptions.Item>
                <Descriptions.Item label="Slots Remaining">
                  {this.state.committeeInfo[0]['slotsRemaining']}
                </Descriptions.Item>
              </Descriptions>
              <MembersTable data={this.state.committeeInfo[0]} />
              <RequirementsTable data={this.state.committeeInfo[0]} />
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}
export default GetReports;
