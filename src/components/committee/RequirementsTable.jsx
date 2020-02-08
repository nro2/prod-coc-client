import React, { Component } from 'react';
import { Table, Divider, InputNumber, Button } from 'antd';
import axios from 'axios';

const pageSize = 30; // Page size to show pagination

export default class RequirementsTable extends Component {
  state = {
    disabled: true,
  };

  toggle = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  };

  reqColumns = [
    {
      title: 'Senate',
      dataIndex: 'senateShortname',
      editable: false,
    },
    {
      title: 'Filled',
      dataIndex: 'slotFilled',
      editable: false,
    },
    {
      title: 'Required',
      dataIndex: 'slotMinimum',
      render: value => (
        <InputNumber min={0} defaultValue={value} disabled={this.state.disabled} />
      ),
    },
    {
      title: 'To Be Filled',
      dataIndex: 'slotsRemaining',
      editable: false,
    },
  ];
  render() {
    return (
      <div>
        <Divider type="horizontal" orientation="left">
          Requirements
        </Divider>
        <Button onClick={this.toggle} type="primary">
          Edit
        </Button>
        <Table
          rowKey="senateShortname"
          bordered
          dataSource={this.props.data}
          columns={this.reqColumns}
          pagination={1 > pageSize && { pageSize }}
          size="small"
        />
      </div>
    );
  }
}
