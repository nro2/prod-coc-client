import React from 'react';
import { Divider } from 'antd';
import 'antd/dist/antd.css';
import './index.css';
import AddCommitteeAsignment from './AddCommitteeAssignment.jsx';
import EditableFormTable from './EditableTable.jsx';

export default class MembersTable extends React.Component {
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
        dataIndex: 'facultyName',
        editable: false,
      },
      {
        title: 'Email',
        dataIndex: 'facultyEmail',
        editable: false,
      },
      {
        title: 'Start Date',
        dataIndex: 'startDate',
        editable: true,
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        editable: true,
      },
      {
        title: 'Senate Division',
        dataIndex: 'senateDivision',
        editable: false,
      },
    ];
    return (
      <div>
        <Divider type="horizontal" orientation="left">
          Members
        </Divider>
        <div style={{ marginBottom: 16 }}>
          <AddCommitteeAsignment
            buttonLabel="Add Member"
            endpoint="api/faculty"
            committeeId={this.props.id}
            rerenderParentCallback={this.rerenderParentCallback}
          />
        </div>
        <EditableFormTable data={this.props.data} columns={columns} />
      </div>
    );
  }
}
