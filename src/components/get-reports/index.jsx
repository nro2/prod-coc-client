import React, { Component } from 'react';
import axios from 'axios';
import RequirementsTable from './RequirementsTable';
import { Statistic } from 'antd';

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportInfo: '',
      dataLoaded: false,
    };
    this.fetchReportInfo = this.fetchReportInfo.bind(this);
  }

  componentDidMount() {
    this.fetchReportInfo();
  }

  async fetchReportInfo() {
    await axios
      .get('/api/reports')
      .then(response => {
        this.setState({
          reportInfo: response.data,
          dataLoaded: true,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div style={{ flex: 1 }}>
        <h1>Reports</h1>
        {this.state.dataLoaded && (
          <React.Fragment>
            <Statistic
              style={{ marginRight: 20 }}
              title="Available Slots"
              value={
                this.state.reportInfo.total_slots -
                this.state.reportInfo.slots_filled
              }
              suffix={`/ ${this.state.reportInfo.total_slots}`}
            />
            <RequirementsTable data={this.state.reportInfo['senate_division']} />
          </React.Fragment>
        )}
      </div>
    );
  }
}
export default Reports;
