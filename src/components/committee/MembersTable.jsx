import React from 'react';
import { Divider } from 'antd';
import 'antd/dist/antd.css';
import './index.css';
import AddCommitteeAssignment from './AddCommitteeAssignment.jsx';
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
        inputType: 'text',
      },
      {
        title: 'Email',
        dataIndex: 'facultyEmail',
        editable: false,
        inputType: 'text',
      },
      {
        title: 'Start Date',
        dataIndex: 'startDate',
        editable: true,
        inputType: 'date',
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        editable: true,
        inputType: 'date',
      },
      {
        title: 'Senate Division',
        dataIndex: 'senateDivision',
        editable: false,
        inputType: 'text',
      },
    ];
    return (
      <div>
        <Divider type="horizontal" orientation="left">
          Members
        </Divider>
        <AddCommitteeAssignment
          buttonLabel="Add Member"
          endpoint="api/faculty"
          committeeId={this.props.id}
          rerenderParentCallback={this.rerenderParentCallback}
        />
        <EditableFormTable
          rerenderParentCallback={this.rerenderParentCallback}
          data={this.props.data}
          committeeId={this.props.id}
          columns={columns}
        />
      </div>
    );
  }
}
