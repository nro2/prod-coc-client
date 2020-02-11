import React, { Component } from 'react';
import { message, Select } from 'antd';
import CommitteeHeader from './CommitteeHeader.jsx';
import RequirementsTable from './RequirementsTable.jsx';
import MembersTable from './MembersTable.jsx';
import axios from 'axios';
import SearchDropDown from '../common/SearchDropDown.jsx';

const { Option } = Select;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      committee: [],
      committeeId: 1,
      committeeAssignment: {},
      committeeSlots: {},
      committees: [],
      dataLoaded: false,
      selected: 1,
    };

    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
  }

  rerenderParentCallback() {
    this.fetchCommittees();
  }

  fetchCommitteeInfo(id) {
    axios
      .get(`/api/committee/info/${id}`)
      .then(response => {
        this.setState({
          committee: response.data,
          committeeId: response.data.id,
          committeeAssignment: response.data['committeeAssignment'],
          committeeSlots: response.data['committeeSlots'],
          dataLoaded: true,
        });
      })
      .catch(err => {
        message.error(err);
      });
  }

  fetchCommittees() {
    axios
      .get('/api/committees')
      .then(firstResponse => {
        axios
          .get(`/api/committee/info/${this.state.selected}`)
          .then(secondResponse => {
            this.setState({
              committees: firstResponse.data,
              committee: secondResponse.data,
              committeeId: secondResponse.data.id,
              defaultCommittee: secondResponse.data.name,
              committeeAssignment: secondResponse.data['committeeAssignment'],
              committeeSlots: secondResponse.data['committeeSlots'],
              dataLoaded: true,
            });
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  changeHandler = value => {
    this.setState({
      selected: value,
      showForm: true,
    });

    this.fetchCommitteeInfo(value);
  };

  componentDidMount() {
    this.fetchCommittees();
  }

  render() {
    const options = this.state.committees.map(committees => (
      <Option key={committees.committee_id}>{committees.name}</Option>
    ));

    return (
      <div className="committeeTable">
        <div className="table-wrapper">
          {this.state.dataLoaded && (
            <React.Fragment>
              <SearchDropDown
                dataMembers={options}
                placeholder="Search Committees"
                onChange={this.changeHandler}
                dividerText="Committee Info"
                default={this.state.defaultCommittee}
                showInfo={true}
              />
              <CommitteeHeader data={this.state.committee} />

              <RequirementsTable
                data={this.state.committeeSlots}
                committeeId={this.state.committeeId}
                rerenderParentCallback={this.rerenderParentCallback}
              />
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
