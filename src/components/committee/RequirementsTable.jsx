import React, { Component } from 'react';
import { Divider } from 'antd';
import 'antd/dist/antd.css';
import './index.css';
import ReqsEditableFormTable from './ReqsEditableTable.jsx';

export default class RequirementsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      committeeId: this.props.committeeId,
      disabled: true,
      newSlotReqs: [],
    };
  }
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
