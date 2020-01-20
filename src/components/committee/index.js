import React, { Component } from 'react';
//import axios from 'axios';
//import { Table, Button, Divider } from 'antd';

var mock = {
  name: 'Committee on Space Exploration',
  description: 'About exploring space',
  totalSlots: '10',
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
    ];
  }
  start = () => {
    this.setState({ loading: true, saved: false });
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <React.Fragment>
        {this.loadCommittee(
          mock.name,
          mock.description,
          mock.totalSlots,
          mock.committeeSlots
        )}
        <h1>Slots</h1>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
        {this.loadSlots(rowSelection, this.committeeData, this.slotCol)}
        <h1>Requirements</h1>
        {this.loadRequirements(this.committeeData, this.reqCol)}
        <h1>Members</h1>
        {this.loadMembers(this.committeeData, this.membersCol)}
      </React.Fragment>
    );
  }
}

export default Committee;
