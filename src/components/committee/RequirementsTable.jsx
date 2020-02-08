import React, { Component } from 'react';
import { Table, Divider, InputNumber, Button } from 'antd';
import axios from 'axios';

const pageSize = 30; // Page size to show pagination

export default class RequirementsTable extends Component {
  state = {
    committeeId: this.props.committeeId,
    disabled: true,
    newSlotReqs: [],
  };

  handleReqChange = (value, senateShortname) => {
    let newSlotReqsState = this.state.newSlotReqs;

    let exists = false;
    newSlotReqsState.map(item => {
      if (item.senateShortname === senateShortname) {
        item.slotReq = value;
        exists = true;
      }
    });

    if (exists === false) {
      newSlotReqsState = this.state.newSlotReqs.concat({
        senateShortname: senateShortname,
        slotReq: value,
      });
    }

    this.setState({ newSlotReqs: newSlotReqsState });
  };

  toggle = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
    console.log(this.state.newSlotReqs);
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
      render: (initValue, key) => (
        <InputNumber
          min={0}
          defaultValue={initValue}
          disabled={this.state.disabled}
          onChange={value => {
            this.handleReqChange(value, key.senateShortname);
          }}
        />
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
