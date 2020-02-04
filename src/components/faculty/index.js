import React, { Component, Fragment } from 'react';
import { Button, notification, Menu, Divider, Popconfirm } from 'antd';
import './faculty.css';
import FacultyInfo from './FacultyInfo';
import CommitteeTables from './CommitteeTables';
import axios from 'axios';

class Faculty extends Component {
  constructor(props) {
    super(props);
    this.departmentsDropdownMenu = '';
    this.committeesDropdownMenu = '';
    this.facultyData = [
      {
        key: '1',
        committee: 'mock-data-committee',
        slots: '0',
        description: 'stuff and things',
      },
    ];
    this.state = {
      data: this.facultyData,
      facultiCurrentCommittees: [],
      allCommittees: [],
      allDepartments: [],
      //     interestedCommitteeData: [], // empty for now ..
      //     chosenCommitteeData: [], // empty for now ..
      //cols: this.columns,
      loading: false,
      editingKey: '',
      saved: false,
      facultyLoaded: false,
      committeeIDList: [],
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
    // For more information search "React component lifecycle diagram". Below is the order we retrieve data in:
    // 1. All committee and department data. We then set the state.
    // 2. All faculty data. We then set the state.
    // 3. All associations. We then set the state.
    // TODO: I will reduce the number of times setState is called on render from ~3-4 to 1.

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

  // TODO: replace all these `retrieve` methods with getFacultyInfo (CF1-129)
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

  retrieveSenateData(senateShortName) {
    // TODO: change to follow the format of the other retrieval methods
    axios
      .get(`/api/senate-division/${senateShortName}`)
      .then(response => {
        console.log(response.data);
        const senateInfo = response.data; // assigns response promise
        this.setState({
          facultySenate: senateInfo.name,
        });
        return true;
      })
      .catch(err => {
        console.log(err);
        return false;
      });
  }

  retrieveCommitteeByID(id) {
    // queries for a specific committee using the ID, returns the promise object
    return axios.get(`/api/committee/${id}`).catch(err => {
      console.log(err);
    });
  }

  retrieveDepartmentAssignments(email) {
    // queries for departments a faculti is a part of, returns the promise object
    return axios.get(`/api/department-associations/faculty/${email}`).catch(err => {
      console.log(err);
    });
  }

  retrieveCommitteeAssignments(email) {
    // queries for committees that a faculty is assigned to, returns the promise object
    return axios.get(`/api/committee-assignment/faculty/${email}`).catch(err => {
      console.log(err);
    });
  }

  retrieveDepartmentByID(id) {
    // queries for a department given its ID, returns the promise object
    return axios.get(`/api/department/${id}`).catch(err => {
      console.log(err);
    });
  }

  // TODO: Change from 3 setStates to 1 setState in onComponentMount()
  getFacultyByEmail = async email => {
    let currentCommittees = [];
    let facultiCurrentDepartments = [];
    let retrieved = false;

    axios
      .get(`/api/faculty/${email}`)
      .then(response => {
        console.log(response.data);
        const facultyObject = response.data;
        this.retrieveSenateData(facultyObject.senate_division_short_name);
        if (!this.state.facultySenate) {
          alert(retrieved);
          return false;
        }
        this.setState({
          facultyName: facultyObject.full_name,
          facultyEmail: facultyObject.email,
          facultyPhone: facultyObject.phone_num,
          facultyJob: facultyObject.job_title,
          facultyLoaded: true,
        });
      })
      .catch(err => {
        console.log(err);
        // catch and return failures
        return false;
      });

    const committeeIDList = await this.retrieveCommitteeAssignments(email);
    const departments = await this.retrieveDepartmentAssignments(email);

    if (!committeeIDList) {
      console.log(`No committee assignments for ${this.state.name}`);
    } else {
      currentCommittees = await this.constructCommitteeAssociations(
        committeeIDList
      );
    }

    if (!departments) {
      console.log(`No department assignments for ${this.state.name}`);
    } else {
      facultiCurrentDepartments = await this.constructDepartmentAssociations(
        departments.data.department_ids
      );
    }

    this.setState({
      // Once all of our committees and departments are built, we can finally set their state.
      facultiCurrentCommittees: currentCommittees,
      facultyDepartments: facultiCurrentDepartments,
    });

    return true;
  };

  constructDepartmentAssociations = async ids => {
    let facultiDepartments = [];
    let department = '';
    for (let i = 0; i < ids.length; i++) {
      department = await this.retrieveDepartmentByID(ids[i]);
      facultiDepartments.push({
        key: ids[i],
        name: department.data.name,
      });
      // currently ignoring the department's description,
      // may need to add in the future
    }
    return facultiDepartments;
  };

  constructCommitteeAssociations = async ids => {
    let facultiCurrentCommittees = [];
    let idList = [];
    for (let i = 0; i < ids.data.length; i++) {
      idList.push(ids.data[i].committee_id);
      const committee = await this.retrieveCommitteeByID(idList[i]);
      facultiCurrentCommittees.push({
        key: `${i}`,
        committee: committee.data.name,
        slots: committee.data.total_slots,
        description: committee.data.description,
        startDate: ids.data[i].start_date,
        endDate: ids.data[i].end_date,
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

  createDepartmentMenu() {
    // Manipulates departments into menu items, and then returns it as a menu object
    const departmentsDropdownMenu = this.state.allDepartments.map(departments => (
      <Menu.Item key={departments.id}>
        <Button type="link">{departments.name}</Button>
      </Menu.Item>
    ));
    return <Menu>{departmentsDropdownMenu}</Menu>;
  }

  createCommitteesMenu() {
    const committeesDropdownMenu = this.state.allCommittees.map(committees => (
      <Menu.Item key={committees.id}>
        <Button type="link">{committees.name}</Button>
      </Menu.Item>
    ));
    return <Menu>{committeesDropdownMenu}</Menu>;
  }

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
  resetChanges() {
    return null;
  }
  renderSubmissionButtons(start, saved, loading) {
    // TODO: Add a 'reset' button to revert all changes?
    return (
      <Fragment>
        <Button type="primary" onClick={start} disabled={!saved} loading={loading}>
          Save Changes
        </Button>
        <Divider type="vertical" />
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => this.resetChanges()}
          okText="Yes!"
          disabled={!saved}
        >
          <Button type="primary" disabled={!saved}>
            Reset
          </Button>
        </Popconfirm>
      </Fragment>
    );
  }

  render() {
    const { loading } = this.state;
    this.departmentsDropdownMenu = this.createDepartmentMenu();
    this.committeesDropdownMenu = this.createCommitteesMenu();
    return (
      <Fragment>
        <FacultyInfo
          object={this.state}
          departmentsDropdownMenu={this.departmentsDropdownMenu}
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
          committeesDropdownMenu={this.committeesDropdownMenu}
        />
        {this.renderSubmissionButtons(this.start, this.state.saved, loading)}
      </Fragment>
    );
  }
}

export default Faculty;
