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
    editable: false,
  },
  {
    title: 'To Be Filled',
    dataIndex: 'slotsRemaining',
    key: 'slotsRemaining',
    editable: false,
  },
];

export default class RequirementsTable extends React.Component {
  constructor(props) {
    super(props);
  }

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
