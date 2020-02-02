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
          <a href="#"> Edit Total Slots </a>
        </span>
      );
    },
  },
];

export default class RequirementsTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //console.log(this.props.data);
    //console.log(this.props.data['memberData']);
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
