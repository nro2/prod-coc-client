import React, { Component } from 'react';
import { message } from 'antd';
import CommitteeHeader from './CommitteeHeader.jsx';
import CommitteeSlots from './CommitteeSlots.jsx';
import RequirementsTable from './RequirementsTable.jsx';
import MembersTable from './MembersTable.jsx';
import axios from 'axios';

// Start App
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      committee: [],
      committeeId: 0,
      committeeAssignment: {},
      dataLoaded: false,
    };

    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
  }

  rerenderParentCallback() {
    this.fetchCommitteeInfo().then(() => {
      this.forceUpdate();
    });
  }

  fetchCommitteeInfo() {
    axios
      .get(`/api/committee/info/1`)
      .then(response => {
        this.setState({
          committee: response.data,
          committeeId: response.data.id,
          committeeAssignment: response.data['committeeAssignment'],
          dataLoaded: true,
        });
      })
      .catch(err => {
        message.error(err);
      });
  }

  componentDidMount() {
    this.fetchCommitteeInfo();
  }

  render() {
    return (
      <div className="committeeTable">
        <div className="table-wrapper">
          {this.state.dataLoaded && (
            <React.Fragment>
              <CommitteeHeader data={this.state.committee} />
              <CommitteeSlots data={this.state.committee} />
              <RequirementsTable data={this.state.committee} />
              <MembersTable
                data={this.state.committeeAssignment}
                id={this.state.committeeId}
                rerenderParentCallback={this.rerenderParentCallback}
              />
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}
