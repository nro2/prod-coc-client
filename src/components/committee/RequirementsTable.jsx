import React, { Component } from 'react';
import { Table, Divider, InputNumber, Button, message } from 'antd';
import axios from 'axios';
import ReqsEditableFormTable from './ReqsEditableTable';

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

  render() {
    const columns = [
      {
        title: 'Senate',
        dataIndex: 'senateShortname',
        editable: false,
        inputType: 'text',
      },
      {
        title: 'Filled',
        dataIndex: 'slotFilled',
        editable: false,
        inputType: 'text',
      },
      {
        title: 'Required',
        dataIndex: 'slotMinimum',
        editable: true,
        inputType: 'number',
      },
      {
        title: 'To Be Filled',
        dataIndex: 'slotsRemaining',
        editable: false,
        inputType: 'text',
      },
    ];

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
          <ReqsEditableFormTable
            data={this.props.data}
            committeeId={this.props.id}
            columns={columns}
          />
        </div>
      </div>
    );
  }
}
