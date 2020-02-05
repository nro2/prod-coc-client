import React, { Component } from 'react';
import { Table, Divider } from 'antd';

const pageSize = 5; // Page size to show pagination
const reqColumns = [
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
    dataIndex: 'slotMinimum',
    key: 'slotMinimum',
  },
  {
    title: 'To Be Filled',
    dataIndex: 'slotsRemaining',
    key: 'slotsRemaining',
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
          rowkey="senatesTable"
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
