import React, { Component, Fragment } from 'react';
import { Table, Button, Divider, Dropdown } from 'antd';
import EditableFormTable from './EditableTable';
import './faculty.css';

class CommitteeTables extends Component {
  constructor(props) {
    super(props);
    this.columns = [
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
      committeesAreLoaded: false,
    };
  }

  // TODO: update this method, as it is deprecated (CF1-140)
  componentWillReceiveProps(newProps) {
    let committeesLoaded = false;
    if (newProps.committeesDropdownMenu) {
      committeesLoaded = true;
    }
    this.setState({
      facultiCurrentCommittees: newProps.facultiCurrentCommittees,
      facultiInterestedCommittees: newProps.mockData,
      facultiChosenCommittees: newProps.mockData,
      committeesDropdownMenu: newProps.committeesDropdownMenu,
      committeesAreLoaded: committeesLoaded,
    });
  }

  renderCurrentCommittees() {
    return (
      <span>
        <Dropdown
          overlay={this.state.committeesDropdownMenu}
          disabled={!this.state.committeesAreLoaded}
        >
          <Button
            type="primary"
            icon="plus"
            size="small"
            onClick={() => this.props.sayHello()}
          />
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
    return (
      <span>
        <Dropdown
          overlay={this.state.committeesDropdownMenu}
          disabled={!this.state.committeesAreLoaded}
        >
          <Button
            type="primary"
            icon="plus"
            size="small"
            onClick={() => this.props.sayHello()}
          />
        </Dropdown>
        <Divider type="vertical" />
        <h1 style={{ display: 'inline' }}>Committees Chosen:</h1>
        <Table dataSource={facultyData} bordered columns={columnData} />
      </span>
    );
  }

  renderInterestedCommittees(facultyData, columnData) {
    return (
      <span>
        <Dropdown
          overlay={this.state.committeesDropdownMenu}
          disabled={!this.state.committeesAreLoaded}
        >
          <Button
            type="primary"
            icon="plus"
            size="small"
            onClick={() => this.props.sayHello()}
          />
        </Dropdown>
        <Divider type="vertical" />
        <h1 style={{ display: 'inline' }}>Committees interested in:</h1>
        <Table dataSource={facultyData} bordered columns={columnData} />
      </span>
    );
  }

  render() {
    return (
      <Fragment>
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
      </Fragment>
    );
  }
}

export default CommitteeTables;
