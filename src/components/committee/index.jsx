import React, { Component } from 'react';
import CommitteeHeader from './CommitteeHeader.jsx';
import RequirementsTable from './RequirementsTable.jsx';
import MembersTable from './MembersTable.jsx';
import axios from 'axios';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      committee: [],
      dataLoaded: false,
    };
  }
  componentDidMount() {
    axios.get(`/api/committee/info/1`).then(response => {
      const committee = response.data;
      this.setState({ committee });
      this.setState({ dataLoaded: true });
    });
  }
  render() {
    console.log('Render Function');
    console.log(this.state.committee);
    return (
      <div className="committeeTable">
        <div className="table-wrapper">
          {this.state.dataLoaded && (
            <React.Fragment>
              <CommitteeHeader data={this.state.committee} />
              <RequirementsTable data={this.state.committee} />
              <MembersTable data={this.state.committee} />
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}
