import React, { Component } from 'react';
import axios from 'axios';
import { Descriptions } from 'antd';
import './get-reports.css';

class GetReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      committeeInfo: [],
      dataLoaded: false,
    };
    this.fetchCommitteeInfo = this.fetchCommitteeInfo.bind(this);
  }

  async fetchCommitteeInfo() {
    let committeeIds = await axios.get('/api/committees').then(response => {
      return response.data;
    });

    const promises = committeeIds.map(async item => {
      let res = await axios.get(`/api/committee/info/${item.committee_id}`);
      return res.data;
    });

    const results = await Promise.all(promises);

    let newCommitteeInfoState = this.state.committeeInfo.concat(results);
    this.setState({
      committeeInfo: newCommitteeInfoState,
      dataLoaded: true,
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
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}
export default GetReports;
