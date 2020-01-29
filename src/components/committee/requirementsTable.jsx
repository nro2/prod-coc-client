import React from 'react';
import { Table, Input, Popconfirm, Form, InputNumber } from 'antd';

const pageSize = 5; // Page size to show pagination
const reqColumns = [
  {
    title: 'Senate',
    dataIndex: 'senateShortname',
    key: 'senateShortname',
    editable: false,
  },
  {
    title: 'Filled',
    dataIndex: 'slotFilled',
    key: 'senateFilled',
    editable: false,
  },
  {
    title: 'Required',
    dataIndex: 'slotRequirements',
    key: 'slotRequirements',
    editable: true,
  },
  {
    title: 'Action',
    dataIndex: '',
    key: 'x',
    render: () => {
      return (
        <span>
          <a> Edit Total Slots </a>
        </span>
      );
    },
  },
];

export default class RequirementsTable extends React.Component {
  constructor(props) {
    super(props);
    this.filledS = [
      {
        key: this.props.data['id'],
        filledSlots: this.props.data['filledSlots'],
        totalSlots: this.props.data['totalSlots'],
      },
    ];
    this.iterate = this.iterate.bind(this);
    this.members = this.props.data['memberData'];
    this.committee = this.props.data['committeeSlots'];
  }

  iterate = function() {
    console.log(this.committee);
    for (let i = 0; i < this.committee.length; i++) {
      console.log(this.committee[i]);
    }
  };

  render() {
    //console.log(this.props.data['committeeSlots']);
    //console.log(this.props.data['memberData']);
    return (
      <div>
        {this.iterate()}
        <h3>Requirements</h3>
        <Table
          dataSource={this.props.data['committeeSlots']}
          columns={reqColumns}
          pagination={
            this.props.data['committeeSlots'].length > pageSize && { pageSize }
          }
        />
      </div>
    );
  }
}
