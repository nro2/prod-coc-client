import React, { Component } from 'react';
import axios from 'axios';
import RequirementsTable from './RequirementsTable';
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

  stubData = [
    {
      senateShortname: 'AO',
      slotFilled: 15,
      slotMinimum: 20,
      slotsRemaining: 5,
    },
    {
      senateShortname: 'CLAS-Sci',
      slotFilled: 30,
      slotMinimum: 50,
      slotsRemaining: 20,
    },
    {
      senateShortname: 'CLAS-AL',
      slotFilled: 5,
      slotMinimum: 24,
      slotsRemaining: 19,
    },
    {
      senateShortname: 'SB',
      slotFilled: 0,
      slotMinimum: 20,
      slotsRemaining: 20,
    },
  ];

  componentDidMount() {
    this.fetchCommitteeInfo();
  }

  render() {
    return (
      <div>
        <h1>Reports</h1>
        <RequirementsTable data={this.stubData} />
      </div>
    );
  }
}
export default GetReports;
