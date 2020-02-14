import React, { Component, Fragment } from 'react';
import { Button, notification, Divider, Popconfirm, Result } from 'antd';
import './faculty.css';
import FacultyHeader from './FacultyHeader';
import CommitteeTables from './CommitteeTables';
import axios from 'axios';

class Faculty extends Component {
  constructor(props) {
    super(props);
    // TODO: remove this hardcoded value once we have a page that renders this
    //  component and rename it to a this.props.email or similar
    this.email = 'wolsborn@pdx.edu';
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
      allCommittees: [],
      departments: [],
      committeesLoaded: false,
      departmentsLoaded: false,
      loading: false,
      error: {},
      faculty: {
        currentCommittees: [],
        departments: [{ department_id: 1, name: 'none' }],
        name: 'Faculty Name',
        email: 'none-specified',
        phone: '(000)-000-0000',
        senate: 'Faculty Senate',
        job: 'Faculty Job',
        expertise: 'Faculty Expertise',
        id: -1,
        loaded: false,
      },
      senateDivisions: [],
      facultySnapshot: {},
      saved: false,
    };
    this.enableSaveChangesButton = this.enableSaveChangesButton.bind(this);
    this.onFacultyEdit = this.onFacultyEdit.bind(this);
    this.updateFaculty = this.updateFaculty.bind(this);
  }

  async componentDidMount() {
    await this.retrieveDropdownOptions();
    await this.retrieveSenateDivisions();

    await axios
      .get(`api/faculty/info/${this.email}`)
      .then(result => {
        const data = result.data;
        const { committees, departments } = result.data;
        const currentCommittees = this.mapCurrentCommittees(committees);

        const faculty = {
          currentCommittees,
          departments,
          name: data.full_name,
          email: data.email,
          phone: data.phone_num,
          job: data.job_title,
          senate: data.senate_division_short_name,
          loaded: true,
          expertise: data.surveys.expertise || 'No Expertise',
        };

        this.setState({
          faculty,
        });

        this.takeFacultySnapshot();
      })
      .catch(err => {
        const data = err.response;
        this.setState({
          error: {
            message: data ? data.error : 'Internal Server Error',
            code: err.response.status,
          },
          loading: false,
        });
      });
  }

  /**
   * Retrieves the committees and departments list and stores them in the state of
   * the component.
   *
   * When the requests fail, the `committeesLoaded` state remains `false`.
   *
   * @returns {Promise<void>}
   */
  retrieveDropdownOptions = async () => {
    await axios.get('/api/committees').then(committees => {
      const committeeList = [];
      committees.data.forEach(committees => {
        committeeList.push({
          id: committees.committee_id,
          name: committees.name,
        });
      });

      this.setState({
        allCommittees: committeeList,
        committeesLoaded: true,
      });
    });

    axios.get('/api/departments').then(response => {
      const departments = [];
      response.data.forEach(department => {
        departments.push({
          id: department.department_id,
          name: department.name,
        });
      });

      this.setState({
        departments,
        departmentsLoaded: true,
      });
    });
  };

  retrieveSenateDivisions = async () => {
    await axios.get('/api/senate-divisions').then(response => {
      this.setState({
        senateDivisions: response.data,
      });
    });
  };

  /**
   * Takes a snapshot of the current faculty state, so that when we can revert
   * changes to the faculty by referring to the snapshot as a restoration point.
   */
  takeFacultySnapshot() {
    this.setState({
      facultySnapshot: this.state.faculty,
    });
  }

  /**
   * Builds an Ant-compatible committees object to be passed to the `CommitteeTables`
   * component.
   *
   * @param committees  List of committees retrieved from the back-end
   * @returns {[]}      List of table-compatible committee object
   */
  mapCurrentCommittees = committees => {
    const currentCommittees = [];

    committees.forEach((committee, index) => {
      currentCommittees.push({
        key: `${index}`,
        committee: committee.name,
        slots: committee.total_slots,
        description: committee.description,
        startDate: committee.start_date,
        endDate: committee.end_date,
      });
    });

    return currentCommittees;
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
      description: `${this.state.faculty.name}'s profile has been updated!`,
      placement,
    });
  };

  /**
   * Notifies the user that a function is not implemented, working as a placeholder.
   */
  sayHello = () => {
    alert('Hello! I am not yet implemented.');
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
        faculty: {
          ...this.state.faculty,
          phone,
          senate,
        },
      });
    }
  }

  /**
   * Restores the latest faculty snapshot, overriding the current faculty with the
   * last saved faculty state.
   */
  restoreSnapshot() {
    this.setState({
      faculty: this.state.facultySnapshot,
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
          onConfirm={() => this.restoreSnapshot()}
          okText="Yes!"
          disabled={!this.state.faculty.loaded}
        >
          <Button
            type="primary"
            disabled={!this.state.faculty.loaded}
            loading={loading}
          >
            Reset
          </Button>
        </Popconfirm>
      </Fragment>
    );
  }

  updateFaculty(faculty) {
    this.setState({
      faculty,
    });
  }

  render() {
    if (Object.keys(this.state.error).length !== 0) {
      return (
        <div className="aligner-item">
          <Result
            status="500"
            title={this.state.error.code}
            subTitle={this.state.error.message}
          />
        </div>
      );
    }

    return (
      <div>
        <FacultyHeader
          onCreate={this.updateFaculty}
          faculty={this.state.faculty}
          senateDivisions={this.state.senateDivisions}
        />
        <CommitteeTables
          facultiCurrentCommittees={this.state.faculty.currentCommittees}
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
