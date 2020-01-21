import React, { Component } from 'react';
import { Table } from 'antd';
//import axios from 'axios';

var mock = {
  name: 'Committee on Space Exploration',
  description: 'About exploring space',
  totalSlots: '10',
  filledSlots: '5',
  committeeSlots: [
    {
      senateShortname: 'BP',
      slotRequirements: 3,
    },
    {
      senateShortname: 'AO',
      slotRequirements: 7,
    },
  ],
  committeeAssignment: [
    {
      facultyName: 'Boaty McBoatface',
      email: 'boat@gmail.com',
      start_date: '2019-1-1',
      end_date: '2020-1-1',
    },
    {
      facultyName: 'Grace Hopper',
      email: 'ghopper@gmail.com',
      start_date: '2019-1-1',
      end_date: '2020-1-1',
    },
  ],
};

class Committee extends Component {
  constructor(props) {
    super(props);
    this.slotCol = [
      {
        title: 'Filled',
        dataIndex: 'filledSlots',
        key: 'filledSlots',
      },
      {
        title: 'Total',
        dataIndex: 'totalSlots',
        key: 'totalSlots',
      },
    ];
    this.reqCol = [
      {
        title: 'Senate Requirements',
        dataIndex: 'senateReqs',
        key: 'senateReqs',
      },
      {
        title: 'Filled',
        dataIndex: 'senateFilled',
        key: 'senateFilled',
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: () => (
          <span>
            <a> Edit Total Slots </a>
          </span>
        ),
      },
    ];
    this.membersCol = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Start Date',
        dataIndex: 'start',
        key: 'start',
      },
      {
        title: 'End Date',
        dataIndex: 'end',
        key: 'end',
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'y',
        render: () => (
          <span>
            <a> Remove Member </a>
          </span>
        ),
      },
    ];
    this.committeeData = [
      mock.name,
      mock.description,
      mock.totalSlots,
      mock.committeeSlots,
      mock.filledSlots,
    ];
  }
  start = () => {
    this.setState({ loading: true, saved: false });
    setTimeout(() => {
      this.setState({
        loading: false,
      });
    }, 1000);
  };
  render() {
    return (
      <React.Fragment>
        {this.loadCommittee(
          mock.name,
          mock.description,
          mock.totalSlots,
          mock.committeeSlots,
          mock.filledSlots
        )}
        <h1>Slots</h1>
        {this.loadSlots(this.committeeData, this.slotCol)}
        <h1>Requirements</h1>
        {this.loadRequirements(this.committeeData, this.reqCol)}
        <h1>Members</h1>
        {this.loadMembers(this.committeeData, this.membersCol)}
      </React.Fragment>
    );
  }
  loadCommittee(name, description) {
    return (
      <span>
        <h1>{name}</h1>
        {description + '\n'}
      </span>
    );
  }
  loadSlots(committeeData, columnData) {
    return <Table dataSource={committeeData} columns={columnData} />;
  }
  loadRequirements(committeeData, columnData) {
    return <Table dataSource={committeeData} columns={columnData} />;
  }
  loadMembers(committeeData, columnData) {
    return <Table dataSource={committeeData} columns={columnData} />;
  }
}

export default Committee;
