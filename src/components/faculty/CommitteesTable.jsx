import React, { Component } from 'react';
import { Divider } from 'antd';
import 'antd/dist/antd.css';
import EditableCommitteeTable from './EditableCommitteeTable';

export default class CommitteesTable extends Component {
  constructor(props) {
    super(props);

    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
  }

  rerenderParentCallback() {
    this.props.rerenderParentCallback();
  }

  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        editable: false,
        inputType: 'text',
      },
      {
        title: 'Start Date',
        dataIndex: 'start_date',
        editable: true,
        inputType: 'date',
      },
      {
        title: 'End Date',
        dataIndex: 'end_date',
        editable: true,
        inputType: 'date',
      },
      {
        title: 'Total Slots',
        dataIndex: 'total_slots',
        editable: false,
        inputType: 'number',
      },
    ];

    return (
      <div>
        <Divider type="horizontal" orientation="left">
          Committees
        </Divider>
        <div style={{ marginBottom: 16 }}>
          <EditableCommitteeTable
            data={this.props.data}
            email={this.props.email}
            columns={columns}
            rerenderParentCallback={this.rerenderParentCallback}
          />
        </div>
      </div>
    );
  }
}
