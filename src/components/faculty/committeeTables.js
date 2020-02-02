import React, { Component } from 'react';
import { Table, Button, Divider, Dropdown } from 'antd';
import './faculty.css';
import EditableFormTable from './editableTable';

class CommitteeTables extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      // this is for our columns in our <Table> component
      {
        title: 'Name',
        dataIndex: 'committee',
        key: 'committee',
      },
      {
        title: 'Slots available',
        dataIndex: 'slots',
        key: 'slots',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: () => (
          <span>
            <Button
              type="danger"
              onClick={() => {
                alert('Not yet implemented!');
              }}
            >
              Delete
            </Button>
          </span>
        ),
      },
    ];
    this.state = {
      facultiCurrentCommittees: [],
      facultiInterestedCommittees: [],
      facultiChosenCommittees: [],
      committeesDropdownMenu: [],
    };
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      facultiCurrentCommittees: newProps.facultiCurrentCommittees,
      facultiInterestedCommittees: newProps.mockData,
      facultiChosenCommittees: newProps.mockData,
      committeesDropdownMenu: newProps.committeesDropdownMenu,
    });
  }
  render() {
    return (
      <React.Fragment>
        {this.renderCurrentCommittees(
          this.state.facultiCurrentCommittees,
          this.columns
        )}
        {this.renderChosenCommittees(
          this.state.facultiChosenCommittees,
          this.columns
        )}
        {this.renderInterestedCommittees(
          this.state.facultiChosenCommittees,
          this.columns
        )}
      </React.Fragment>
    );
  }

  renderCurrentCommittees() {
    // load current committees that this faculty member is a part of, start/end dates are editable
    return (
      <span>
        <Dropdown overlay={this.state.committeesDropdownMenu}>
          <Button
            type="primary"
            icon="plus"
            size="small"
            onClick={() => this.props.sayHello()}
          ></Button>
        </Dropdown>
        <Divider type="vertical" />
        <h1 style={{ display: 'inline' }}>Currently a part of:</h1>
        <EditableFormTable
          enableSaveChangesButton={this.props.enableSaveChangesButton}
          currentCommittee={this.state.facultiCurrentCommittees}
        />
      </span>
    );
  }

  renderChosenCommittees(facultyData, columnData) {
    // Loads the chosen comittee table
    return (
      <span>
        <Dropdown overlay={this.state.committeesDropdownMenu}>
          <Button
            type="primary"
            icon="plus"
            size="small"
            onClick={() => this.props.sayHello()}
          ></Button>
        </Dropdown>
        <Divider type="vertical" />
        <h1 style={{ display: 'inline' }}>Committees Chosen:</h1>
        <Table dataSource={facultyData} bordered columns={columnData} />
      </span>
    );
  }

  renderInterestedCommittees(facultyData, columnData) {
    // loads the interested committee table
    return (
      <span>
        <Dropdown overlay={this.state.committeesDropdownMenu}>
          <Button
            type="primary"
            icon="plus"
            size="small"
            onClick={() => this.props.sayHello()}
          ></Button>
        </Dropdown>
        <Divider type="vertical" />
        <h1 style={{ display: 'inline' }}>Committees interested in:</h1>
        <Table dataSource={facultyData} bordered columns={columnData} />
      </span>
    );
  }
}

export default CommitteeTables;
