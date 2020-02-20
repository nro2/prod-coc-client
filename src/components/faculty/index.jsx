import React, { Component } from 'react';
import { Result, Select } from 'antd';
import './faculty.css';
import FacultyHeader from './FacultyHeader';
import CommitteeTables from './CommitteeTables';
import CommitteesTable from './CommitteesTable.jsx';
import axios from 'axios';
import SearchDropDown from '../common/SearchDropDown.jsx';
import SurveyTable from './SurveyTable';

const { Option } = Select;

class Faculty extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: '',
      email: '',
      dataLoaded: false,
      allCommittees: [],
      allDepartments: [],
      allFaculty: [],
      senateDivisions: [],
      error: {},
      faculty: {
        currentCommittees: [],
        recentSurvey: {
          survey_date: '',
          is_interested: false,
          expertise: '',
          choices: [
            {
              choice_id: 0,
              committee_id: 0,
              name: '',
              description: '',
              total_slots: 0,
            },
          ],
        },
        departments: [{ department_id: 1, name: 'none' }],
        name: 'Faculty Name',
        email: 'none-specified',
        phone: '(000)-000-0000',
        senate: 'Faculty Senate',
        job: 'Faculty Job',
      },
    };

    this.updateFaculty = this.updateFaculty.bind(this);
    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
  }

  fetchFacultyInfo(email) {
    axios
      .get(`/api/faculty/info/${email}`)
      .then(response => {
        const faculty = {
          currentCommittees: response.data['committees'],
          recentSurvey: response.data['surveys'],
          departments: response.data['departments'],
          name: response.data.full_name,
          email: response.data.email,
          phone: response.data.phone_num,
          job: response.data.job_title,
          senate: response.data.senate_division_short_name,
        };
        this.setState({
          faculty,
          email: faculty.email,
          dataLoaded: true,
        });
      })
      .catch(err => {
        const data = err.response;
        console.log(err);
        this.setState({
          error: {
            message: data ? data.error : 'Internal Server Error',
            code: data ? data.status : 500,
          },
          loading: false,
        });
      });
  }

  fetchFaculty() {
    axios
      .get('/api/faculty')
      .then(firstResponse => {
        axios
          .get(
            `/api/faculty/info/${this.state.selected ||
              firstResponse.data[0].email}`
          )
          .then(secondResponse => {
            const faculty = {
              currentCommittees: secondResponse.data['committees'],
              recentSurvey: secondResponse.data['surveys'],
              departments: secondResponse.data['departments'],
              name: secondResponse.data.full_name,
              email: secondResponse.data.email,
              phone: secondResponse.data.phone_num,
              job: secondResponse.data.job_title,
              senate: secondResponse.data.senate_division_short_name,
            };

            this.setState({
              faculty,
              allFaculty: firstResponse.data,
              selected: faculty.email,
              email: faculty.email,
              dataLoaded: true,
            });
          });
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

  rerenderParentCallback() {
    this.fetchFaculty();
  }

  changeHandler = value => {
    this.setState({
      selected: value,
      showForm: true,
    });

    this.fetchFacultyInfo(value);
  };

  async componentDidMount() {
    this.fetchFaculty();
    await this.retrieveCommittees();
    await this.retrieveDepartments();
    await this.retrieveSenateDivisions();
  }

  retrieveCommittees = async () => {
    await axios.get('/api/committees').then(response => {
      this.setState({
        allCommittees: response.data,
      });
    });
  };

  retrieveDepartments = async () => {
    await axios.get('/api/departments').then(response => {
      this.setState({
        allDepartments: response.data,
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

    const options = this.state.allFaculty.map(faculty => (
      <Option key={faculty.email}>{faculty.full_name}</Option>
    ));

    return (
      <div>
        {this.state.dataLoaded && (
          <React.Fragment>
            <SearchDropDown
              dataMembers={options}
              placeholder="Search Committees"
              onChange={this.changeHandler}
              dividerText="Faculty Info"
              default={this.state.selected}
              showInfo={true}
            />
            <FacultyHeader
              onCreate={this.updateFaculty}
              faculty={this.state.faculty}
              senateDivisions={this.state.senateDivisions}
              departments={this.state.allDepartments}
            />
            <CommitteesTable
              data={this.state.faculty.currentCommittees}
              email={this.state.faculty.email}
              rerenderParentCallback={this.rerenderParentCallback}
            />
            <SurveyTable data={this.state.faculty.recentSurvey} />
            <CommitteeTables
              facultiCurrentCommittees={this.state.faculty.currentCommittees}
              mockData={this.state.data}
              sayHello={this.sayHello}
              enableSaveChangesButton={this.enableSaveChangesButton}
              committees={this.state.allCommittees}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Faculty;
