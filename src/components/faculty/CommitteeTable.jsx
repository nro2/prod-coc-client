import React, { Component, Fragment } from 'react';
import { Table, Button, Divider, Dropdown, Menu } from 'antd';
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
      faculty: {
        currentCommittees: [],
        interestedCommittees: [],
        chosenCommittees: [],
      },
      committeesAreLoaded: false,
      committees: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const committeesLoaded = nextProps.committees.length !== 0;
    if (nextProps.facultiCurrentCommittees !== prevState.facultiCurrentCommittees) {
      return {
        faculty: {
          currentCommittees: nextProps.facultiCurrentCommittees,
          interestedCommittees: nextProps.mockData,
          chosenCommittees: nextProps.mockData,
        },
        committees: nextProps.committees,
        committeesAreLoaded: committeesLoaded,
      };
    } else {
      return null;
    }
  }

  createCommitteesMenu() {
    const committeesDropdownMenu = this.state.committees.map(committee => (
      <Menu.Item key={committee.id}>
        <Button type="link">{committee.name}</Button>
      </Menu.Item>
    ));

    return <Menu>{committeesDropdownMenu}</Menu>;
  }

  renderChosenCommittees(facultyData, columnData) {
    const committees = this.createCommitteesMenu();
    return (
      <span>
        <Dropdown overlay={committees} disabled={!this.state.committeesAreLoaded}>
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
    const committees = this.createCommitteesMenu();

    return (
      <span>
        <Dropdown overlay={committees} disabled={!this.state.committeesAreLoaded}>
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
        {this.renderChosenCommittees(
          this.state.faculty.chosenCommittees,
          this.columns
        )}
        {this.renderInterestedCommittees(
          this.state.faculty.chosenCommittees,
          this.columns
        )}
      </Fragment>
    );
  }
}

export default CommitteeTables;
