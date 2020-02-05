import React, { Component } from 'react';
import { Table, Divider, Form } from 'antd';
import 'antd/dist/antd.css';

const pageSize = 5; // Page size to show pagination

const Context = React.createContext();

const Row = ({ form, ...props }) => (
  <Context.Provider value={form}>
    <tr {...props} />
  </Context.Provider>
);

const FormRow = Form.create()(Row);

class Cell extends Component {
  renderCell = form => {
    this.form = form;
    const { children } = this.props;
    return { children };
  };

  render() {
    const { children, ...restProps } = this.props;
    return <td {...restProps}>{children}</td>;
  }
}

export default class MembersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.data['committeeAssignment'],
    };
  }
  memberColumns = [
    {
      title: 'Name',
      dataIndex: 'facultyName',
      key: 'facultyNameKey',
    },
    {
      title: 'Email',
      dataIndex: 'facultyEmail',
      key: 'facultyEmail',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Senate Division',
      dataIndex: 'senateDivision',
      key: 'senateDivision',
    },
  ];

  render() {
    const components = {
      body: {
        row: FormRow,
        cell: Cell,
      },
    };

    const columns = this.memberColumns.map(col => {
      return {
        ...col,
        onCell: record => ({
          record,
        }),
      };
    });
    return (
      <div>
        <Divider type="horizontal" orientation="left">
          Members
        </Divider>
        <Table
          rowKey={record => record.facultyName}
          bordered
          components={components}
          dataSource={this.state.dataSource}
          columns={columns}
          pagination={this.state.dataSource.length > pageSize && { pageSize }}
        />
      </div>
    );
  }
}
