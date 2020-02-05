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
      committees: [],
      committeeInfo: [],
      dataLoaded: false,
    };
    this.fetchCommitteeInfo = this.fetchCommitteeInfo.bind(this);
  }

  fetchCommitteeInfo() {
    /*
    axios
    .get('/api/committees')
    .then(response => {
      let promises = [];
      for (var i = 0; i < response.data.length; i++) {
        promises
          .push(
            axios
              .get(`/api/committee/info/${response.data[i].committee_id}`)
              .then(response => {
                this.state.committeeInfo.push(response);
              })
              .catch(err => {
                this.setState({
                  error: { message: err.response.data.error, code: err.response.status },
                  loading: false,
                });
              })
          )
      }
    })
    .catch(err => {
      this.setState({
        error: { message: err.response.data.error, code: err.response.status },
        loading: false,
      });
    });
  }*/

    axios.get('/api/committees').then(response => {
      axios
        .get(`/api/committee/info/${response.data[0].committee_id}`)
        .then(response => {
          this.setState({
            committeeInfo: response.data,
            dataLoaded: true,
            loading: false,
            error: {},
          });
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
              <MembersTable data={this.state.committeeInfo} />
              <RequirementsTable data={this.state.committeeInfo} />
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}
export default GetReports;
