import React, { Component } from 'react';
import { Table, Divider, InputNumber, Button, message } from 'antd';
import axios from 'axios';

const pageSize = 30; // Page size to show pagination

export default class RequirementsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      committeeId: this.props.committeeId,
      disabled: true,
      newSlotReqs: [],
    };

    this.handleReqChange = this.handleReqChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleReqChange = (value, senateShortname) => {
    let newSlotReqsState = this.state.newSlotReqs;

    let exists = false;
    newSlotReqsState.map(item => {
      if (item.senateShortname === senateShortname) {
        item.slotReqs = value;
        exists = true;
      }
      return item;
    });

    if (exists === false) {
      newSlotReqsState = this.state.newSlotReqs.concat({
        senateShortname: senateShortname,
        slotReqs: value,
      });
    }

    this.setState({ newSlotReqs: newSlotReqsState });
  };

  handleSave = () => {
    this.state.newSlotReqs.map(item => {
      let res = axios
        .put(
          `api/committee-slots/${this.props.committeeId}/${item.senateShortname}`,
          {
            slotRequirements: item.slotReqs,
          }
        )
        .then(response => {
          message.success('Slot requirements successfully updated');
          this.setState({ disabled: true });
          return response;
        })
        .catch(err => {
          message.error(err.response.data.error);
          this.setState({ disabled: true });
          return err;
        });
      return res;
    });

    this.setState({
      newSlotReqs: [],
    });
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
      render: (initValue, key) => (
        <InputNumber
          min={1}
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
        <div style={{ marginBottom: 16 }}>
          <Button style={{ marginRight: 8 }} onClick={this.toggle} type="primary">
            Edit
          </Button>
          <Button onClick={this.handleSave} type="primary">
            Save
          </Button>
        </div>
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
