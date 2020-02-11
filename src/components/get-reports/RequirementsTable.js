import React, { Component } from 'react';
import { Table, Divider } from 'antd';

const pageSize = 30; // Page size to show pagination
const reqColumns = [
  {
    title: 'Senate',
    dataIndex: 'senate_division',
    editable: false,
  },
  {
    title: 'Filled',
    dataIndex: 'SlotsFilled',
    editable: false,
  },
  {
    title: 'Required',
    dataIndex: 'SlotMinimum',
    editable: false,
  },
  {
    title: 'To Be Filled',
    dataIndex: 'SlotsRemaining',
    editable: false,
  },
];

export default class RequirementsTable extends Component {
  render() {
    return (
      <div>
        <Divider type="horizontal" orientation="left">
          Requirements
        </Divider>
        <Table
          rowKey="senateShortname"
          bordered
          dataSource={this.props.data}
          columns={reqColumns}
          pagination={1 > pageSize && { pageSize }}
          size="small"
        />
      </div>
    );
  }
}
