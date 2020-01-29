import React from 'react';
import { Table, Input, Popconfirm, Form, InputNumber } from 'antd';

const pageSize = 5; // Page size to show pagination
const slotColumns = [
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

export default class CommitteeSlots extends React.Component {
  constructor(props) {
    super(props);
    this.slots = [
      {
        key: this.props.data['id'],
        filledSlots: this.props.data['filledSlots'],
        totalSlots: this.props.data['totalSlots'],
      },
    ];
  }

  render() {
    //console.log(this.slots);
    return (
      <div>
        <h3>Slots</h3>
        <Table
          dataSource={this.slots}
          columns={slotColumns}
          pagination={this.slots.length > pageSize && { pageSize }}
        />
      </div>
    );
  }
}
