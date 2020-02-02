import React from 'react';
import { Table, Divider } from 'antd';

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
    dataIndex: 'slotMinimum',
    key: 'slotMinimum',
    editable: true,
  },
  {
    title: 'To Be Filled',
    dataIndex: 'slotsRemaining',
    key: 'slotsRemaining',
    editable: false,
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
        <Divider type="horizontal" orientation="left">
          Requirements
        </Divider>
        <Table
          bordered
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
