import React from 'react';
import { Table, Divider } from 'antd';

const pageSize = 20; // Page size to show pagination
const memberColumns = [
  {
    title: 'Name',
    dataIndex: 'facultyName',
    key: 'facultyName',
    editable: true,
  },
  {
    title: 'Email',
    dataIndex: 'facultyEmail',
    key: 'facultyEmail',
    editable: true,
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate',
    editable: true,
  },
  {
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate',
    editable: true,
  },
  {
    title: 'Senate Division',
    dataIndex: 'senateDivision',
    key: 'senateDivision',
    editable: false,
  },
  {
    title: 'Action',
    dataIndex: 'operation',
    render: () => {
      return (
        <span>
          <a> Remove Member</a>
        </span>
      );
    },
  },
];

export default class MembersTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Divider type="horizontal" orientation="left">
          Members
        </Divider>
        <Table
          rowKey="membersTable"
          bordered
          dataSource={this.props.data['committeeAssignment']}
          columns={memberColumns}
          pagination={
            this.props.data['committeeAssignment'].length > pageSize && { pageSize }
          }
        />
      </div>
    );
  }
}
