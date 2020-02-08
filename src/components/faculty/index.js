import React, { Component, Fragment } from 'react';
import { Button, notification, Divider, Popconfirm } from 'antd';
import './faculty.css';
import FacultyInfo from './FacultyInfo';
import CommitteeTables from './CommitteeTables';
import axios from 'axios';

class Faculty extends Component {
  constructor(props) {
    super(props);
    this.facultyData = [
      {
        key: '1',
        committee: 'mock-data-committee',
        slots: '0',
        description: 'stuff and things',
      },
    ];
    this.state = {
      facultySnapshot: {},
      data: this.facultyData,
      facultiCurrentCommittees: [],
      allCommittees: [],
      allDepartments: [],
      //     interestedCommitteeData: [], // empty for now ..
      //     chosenCommitteeData: [], // empty for now ..
      loading: false,
      editingKey: '',
      saved: false,
      committeeIDList: [],
      facultyLoaded: false,
      facultyName: 'Faculty Name',
      facultyEmail: 'none-specified',
      facultyPhone: '(000)-000-0000',
      facultyDepartments: [{ key: 1, name: 'none' }],
      facultySenate: 'Faculty Senate',
      facultyJob: 'Faculty Job',
      facultyExpert: 'Faculty Expertise',
      facultyID: -1,
    };
    this.enableSaveChangesButton = this.enableSaveChangesButton.bind(this); // Whenever start/end dates are modified.
    this.onFacultyEdit = this.onFacultyEdit.bind(this); // Whenever faculty info is modified.
  }

  componentDidMount() {
    // This method immediately loads when the Faculty Info component is first rendered.
    // TODO: Report when queries are unsuccessful (CF1-156)
    let retrieved = this.retrieveDropdownOptions();
    if (this.props.email && retrieved === true) {
      retrieved = this.getFacultyByEmail(this.props.email);
    }
  }

  retrieveDropdownOptions = async () => {
    const committees = await this.retrieveAllCommittees();
    const departments = await this.retrieveAllDepartments();
    if (!committees || !departments) {
      // notify caller about failure to retrieve data
      return false;
    }
    let committeeList = [];
    let departmentList = [];
    // Begin manipulating our promise objects for the data we want.
    // They work the same as any other object would.
    committees.data.forEach(committees => {
      committeeList.push({
        id: committees.committee_id,
        name: committees.name,
      });
    });

    departments.data.forEach(departments => {
      departmentList.push({
        id: departments.committee_id,
        name: departments.name,
      });
    });
    this.setState({
      // Generate local lists and only modify states through setState.
      // We must treat states as immutable.
      // This is the way.
      allCommittees: committeeList,
      allDepartments: departmentList,
    });
    return true;
  };

  retrieveAllCommittees() {
    // queries for all committees, returns the promise
    return axios.get(`/api/committees`).catch(err => {
      console.log(err);
    });
  }

  retrieveAllDepartments() {
    // queries for all departments, returns the promise
    return axios.get(`/api/departments`).catch(err => {
      console.log(err);
    });
  }

  retrieveFacultiInfo = async email => {
    return axios.get(`api/faculty/info/${email}`).catch(() => {
      console.log('Failed to retrieve faculty by email!');
    });
  };
  // TODO: Change from 3 setStates to 1 setState in onComponentMount()
  getFacultyByEmail = async email => {
    let currentCommittees = [];
    let facultiCurrentDepartments = [];
    const facultyObject = await this.retrieveFacultiInfo(email);
    if (!facultyObject) {
      // alert the user on failed request
      // CF1-156
      return;
    }

    currentCommittees = this.constructCommitteeAssociations(
      facultyObject.data.committees
    );
    facultiCurrentDepartments = facultyObject.data.departments;
    this.setState({
      // Once all of our committees and departments are built, we can finally set their state.
      facultiCurrentCommittees: currentCommittees,
      facultyDepartments: facultiCurrentDepartments,
      facultyName: facultyObject.data.full_name,
      facultyEmail: facultyObject.data.email,
      facultyPhone: facultyObject.data.phone_num,
      facultyJob: facultyObject.data.job_title,
      facultySenate: facultyObject.data.senate_division_short_name,
      facultyLoaded: true,
    });

    this.takeFacultySnapshot();
    return true;
  };

  takeFacultySnapshot() {
    this.setState({
      facultySnapshot: {
        facultyName: this.state.facultyName,
        facultyPhone: this.state.facultyPhone,
        facultyEmail: this.state.facultyEmail,
        facultyJob: this.state.facultyJob,
        facultyDepartments: this.state.facultyDepartments,
        facultyExpert: this.state.facultyExpert,
        facultySenate: this.state.facultySenate,
        facultyID: this.state.facultyID,
        facultiCurrentCommittees: this.state.facultiCurrentCommittees,
      },
    });
  }

  constructCommitteeAssociations = ids => {
    let facultiCurrentCommittees = [];
    let idList = [];
    for (let i = 0; i < ids.length; i++) {
      idList.push(ids[i].committee_id);
      facultiCurrentCommittees.push({
        key: `${i}`,
        committee: ids[i].name,
        slots: ids[i].total_slots,
        description: ids[i].description,
        startDate: ids[i].start_date,
        endDate: ids[i].end_date,
      });
    }
    return facultiCurrentCommittees;
  };

  onFacultyEdit(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  // When the 'update' button is clicked, we start the loading process.
  start = () => {
    this.setState({ loading: true, saved: false });
    setTimeout(() => {
      this.setState({
        loading: false,
      });
    }, 1000);
    this.openNotification('topRight');
  };

  openNotification = placement => {
    notification.info({
      message: `Success!`,
      description: `${this.state.facultyName}'s profile has been updated!`,
      placement,
    });
  };

  /**
   * Notifies the user that a function is not implemented, working as a placeholder.
   */
  sayHello = () => {
    alert('Hello! I am not yet implemented.');
  };

  removeDepartment = toRemove => {
    let localDepts = this.state.facultyDepartments.filter(
      title => title !== toRemove
    );
    console.log('Department removed:', toRemove);
    this.enableSaveChangesButton();
    this.setState({ facultyDepartments: localDepts });
  };

  enableSaveChangesButton(phone, senate, committeeID) {
    // enableSaveChangesButton is triggered by child state whenever start/end dates are edited and saved
    // this is what allows the 'save changes button' to be enabled when changes are made
    if (committeeID) {
      this.setState({
        saved: true,
      });
      // Add editable functionality for current committee tables
    }
    if (phone || senate) {
      this.setState({
        saved: true,
        facultyPhone: phone,
        facultySenate: senate,
      });
    }
  }

  undoChanges() {
    this.setState({
      facultyName: this.state.facultySnapshot.facultyName,
      facultyPhone: this.state.facultySnapshot.facultyPhone,
      facultyEmail: this.state.facultySnapshot.facultyEmail,
      facultyDepartments: this.state.facultySnapshot.facultyDepartments,
      facultyJob: this.state.facultySnapshot.facultyJob,
      facultyID: this.state.facultySnapshot.facultyID,
      facultyExpert: this.state.facultySnapshot.facultyExpert,
      facultySenate: this.state.facultySnapshot.facultySenate,
      facultiCurrentCommittees: this.state.facultySnapshot.facultiCurrentCommittees,
      saved: false,
    });
  }

  renderSubmissionButtons(start) {
    const { saved, loading } = this.state;
    return (
      <Fragment>
        <Button type="primary" onClick={start} disabled={!saved} loading={loading}>
          Save Changes
        </Button>
        <Divider type="vertical" />
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => this.undoChanges()}
          okText="Yes!"
          disabled={!this.state.facultyLoaded}
        >
          <Button
            type="primary"
            disabled={!this.state.facultyLoaded}
            loading={loading}
          >
            Reset
          </Button>
        </Popconfirm>
      </Fragment>
    );
  }

  render() {
    return (
      <div>
        <FacultyInfo
          object={this.state}
          departments={this.state.allDepartments}
          enableSaveChangesButton={this.enableSaveChangesButton}
          updateFaculty={this.updateFaculty}
          sayHello={this.sayHello}
          getFacultyByEmail={this.getFacultyByEmail}
          removeDepartment={this.removeDepartment}
        />
        <CommitteeTables
          facultiCurrentCommittees={this.state.facultiCurrentCommittees}
          mockData={this.state.data}
          sayHello={this.sayHello}
          enableSaveChangesButton={this.enableSaveChangesButton}
          committees={this.state.allCommittees}
        />
        {this.renderSubmissionButtons(this.start)}
      </div>
    );
  }
}

export default Faculty;
