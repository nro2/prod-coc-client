import React from 'react';
import CommitteeHeader from './committeeHeader.jsx';
import CommitteeSlots from './committeeSlots.jsx';
import RequirementsTable from './requirementsTable.jsx';
import MembersTable from './membersTable.jsx';
import axios from 'axios';

// Start App
export default class App extends React.Component {
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
              <CommitteeSlots data={this.state.committee} />
              <RequirementsTable data={this.state.committee} />
              <MembersTable data={this.state.committee} />
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}
