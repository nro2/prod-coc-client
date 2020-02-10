import React, { Component } from 'react';
import axios from 'axios';
import RequirementsTable from './RequirementsTable';
import './get-reports.css';
import { Statistic } from 'antd';

class GetReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportInfo: '',
      dataLoaded: false,
    };
    this.fetchReportInfo = this.fetchReportInfo.bind(this);
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

  componentDidMount() {
    this.fetchReportInfo();
  }

  render() {
    return (
      <div>
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
export default GetReports;
