import React, { Component } from 'react';
import { Result, Select } from 'antd';
import './faculty.css';
import FacultyHeader from './FacultyHeader';
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
      dataLoaded: false,
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

    this.handleCreate = this.handleCreate.bind(this);
    this.fetchFaculty = this.fetchFaculty.bind(this);
    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
  }

  async componentDidMount() {
    await this.fetchFaculty().catch(err => {
      const data = err.response;
      const message = data.data.error ? data.data.error : data.data;

      this.setState({
        error: {
          code: data ? data.status.toString() : '',
          title: data ? data.statusText : 'Internal Server Error',
          message: message ? message : 'Unknown Error',
        },
      });
    });
  }

  async fetchFaculty() {
    const facultyResponse = await axios.get('/api/faculty');
    const facultyInfo = await axios.get(
      `/api/faculty/info/${this.state.selected || facultyResponse.data[0].email}`
    );
    const departments = await axios.get('/api/departments');
    const senateDivisions = await axios.get('/api/senate-divisions');

    const faculty = {
      currentCommittees: facultyInfo.data['committees'],
      recentSurvey: facultyInfo.data['surveys'],
      departments: facultyInfo.data['departments'],
      name: facultyInfo.data.full_name,
      email: facultyInfo.data.email,
      phone: facultyInfo.data.phone_num,
      job: facultyInfo.data.job_title,
      senate: facultyInfo.data.senate_division_short_name,
    };

    let selectedValue;
    if (typeof this.props.location.state != 'undefined') {
      selectedValue = this.props.location.state.selected;
    } else {
      selectedValue = faculty.email;
    }

    this.setState({
      faculty,
      allFaculty: facultyResponse.data,
      allDepartments: departments.data,
      senateDivisions: senateDivisions.data,
      selected: selectedValue,
      dataLoaded: true,
    });
  }

  rerenderParentCallback() {
    this.fetchFaculty();
  }

  handleChange = value => {
    this.setState({
      selected: value,
    });

    this.fetchFaculty();
  };

  handleCreate(faculty) {
    this.setState({
      faculty,
    });
  }

  render() {
    if (Object.keys(this.state.error).length !== 0) {
      return (
        <div className="aligner-item">
          <Result
            status={this.state.error.code}
            title={this.state.error.title}
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
              onChange={this.handleChange}
              dividerText="Faculty Info"
              default={this.state.selected}
              showInfo={true}
            />
            <FacultyHeader
              onCreate={this.handleCreate}
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
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Faculty;
