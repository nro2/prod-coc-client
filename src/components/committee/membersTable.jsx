import React from 'react';
import { Table, Input, Popconfirm, Form, InputNumber } from 'antd';

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
    dataIndex: 'email',
    key: 'email',
    editable: true,
  },
  {
    title: 'Start Date',
    dataIndex: 'start_date',
    key: 'start_date',
    editable: true,
  },
  {
    title: 'End Date',
    dataIndex: 'end_date',
    key: 'end_date',
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
        <h3>Members</h3>
        <Table
          dataSource={this.props.data['memberData']}
          columns={memberColumns}
          pagination={
            this.props.data['memberData'].length > pageSize && { pageSize }
          }
        />
      </div>
    );
  }
}
