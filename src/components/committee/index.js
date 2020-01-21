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
      key: '1',
      senateShortname: 'BP',
      slotRequirements: 3,
    },
    {
      key: '2',
      senateShortname: 'AO',
      slotRequirements: 7,
    },
  ],
  committeeAssignment: [
    {
      key: '1',
      facultyName: 'Boaty McBoatface',
      email: 'boat@gmail.com',
      start_date: '2019-1-1',
      end_date: '2020-1-1',
    },
    {
      key: '2',
      facultyName: 'Grace Hopper',
      email: 'ghopper@gmail.com',
      start_date: '2019-1-1',
      end_date: '2020-1-1',
    },
  ],
};

/*var johnMock = [
  {
    key: '1', // <-- Be sure to attach key elements to your data, otherwise the Table component cant read it
    totalSlots: '10',
    filledSlots: '5',
    trashData: 'this shouldnt show up in the table at all',
  },
  {
    key: '2', // <--
    totalSlots: '10',
    filledSlots: '23',
    coolCats: 'or impede it in any way',
  },
];
*/
class Committee extends Component {
  constructor(props) {
    super(props);
    this.slotCol = [
      {
        title: 'Filled',
        dataIndex: 'filledSlots', // <-- as long as the dataIndex matches the variable names it will display in the table
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
        title: 'Senate',
        dataIndex: 'senateShortname',
        key: 'senateShortname',
      },
      {
        title: 'Filled',
        dataIndex: 'slotFilled',
        key: 'senateFilled',
      },
      {
        title: 'Required',
        dataIndex: 'slotRequirements',
        key: 'slotRequirements',
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
        dataIndex: 'facultyName',
        key: 'facultyName',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Start Date',
        dataIndex: 'start_date',
        key: 'start_date',
      },
      {
        title: 'End Date',
        dataIndex: 'end_date',
        key: 'end_date',
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
    this.slotData = [
      {
        key: '1',
        totalSlots: '10',
        filledSlots: '5',
      },
      {
        key: '2',
        totalSlots: '10',
        filledSlots: '23',
      },
    ];
    this.reqData = [
      {
        key: '1',
        senateShortname: 'BP',
        slotFilled: 1,
        slotRequirements: 3,
      },
      {
        key: '2',
        senateShortname: 'AO',
        slotFilled: 5,
        slotRequirements: 7,
      },
    ];
    this.memberData = [
      {
        key: '1',
        facultyName: 'Boaty McBoatface',
        email: 'boat@gmail.com',
        start_date: '2019-1-1',
        end_date: '2020-1-1',
      },
      {
        key: '2',
        facultyName: 'Grace Hopper',
        email: 'ghopper@gmail.com',
        start_date: '2019-1-1',
        end_date: '2020-1-1',
      },
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
        {this.loadSlots(this.slotData, this.slotCol)}
        <h1>Requirements</h1>
        {this.loadRequirements(this.reqData, this.reqCol)}
        <h1>Members</h1>
        {this.loadMembers(this.memberData, this.membersCol)}
      </React.Fragment>
    );
  }
  loadCommittee(name, description) {
    return (
      <h1>
        <h1>{name}</h1>
        {description + '\n'}
      </h1>
    );
  }
  loadSlots(slotData, columnData) {
    return <Table dataSource={slotData} columns={columnData} />;
  }
  loadRequirements(reqData, columnData) {
    return <Table dataSource={reqData} columns={columnData} />;
  }
  loadMembers(memberData, columnData) {
    return <Table dataSource={memberData} columns={columnData} />;
  }
}

export default Committee;
