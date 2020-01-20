import React, { Component } from 'react';
import axios from 'axios';
import { Empty, Result, Select, Descriptions, Divider } from 'antd';

const { Option } = Select;

class GetFaculty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      facultyMembers: [],
      text: '',
      firstName: '',
      lastName: '',
      phoneNum: '',
      showInfo: false,
      email: '',
    };

    this.getItem = this.getItem.bind(this);
    this.fetchFaculty = this.fetchFaculty.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getItem(e) {
    axios
      .get('http://127.0.0.1:8080', { params: { firstName: this._aName.value } })
      .then(response => {
        this.setState({
          text: 'Success',
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phoneNum: response.data.phoneNum,
        });
      })
      .catch(err => {
        this.setState({
          text: 'Bad Request',
          firstName: '',
          lastName: '',
          phoneNum: '',
        });
        console.log(err);
      });

    this._aName.value = '';

    e.preventDefault();
  }

  /*Gets the list of all faculty members for drop down select*/
  fetchFaculty() {
    axios
      .get('http://localhost:8080/faculty')
      .then(response => {
        this.setState({
          facultyMembers: response.data,
          loading: false,
          selected: 0,
          error: {},
        });
      })
      .catch(err => {
        this.setState({
          error: { message: err.response.data.error, code: err.response.status },
          loading: false,
        });
      });
  }

  handleChange(value) {
    this.setState({
      selected: value,
      showInfo: true,
    });
  }

  componentDidMount() {
    this.fetchFaculty();
  }

  renderBody = () => {
    if (this.state.selected === 0) {
      return (
        <div className="aligner-item">
          <Empty />
        </div>
      );
    }

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
        {JSON.stringify(
          this.state.facultyMembers.find(
            faculty => faculty.full_name === this.state.selected,
            faculty => faculty.email === this.state.selected
          )
        )}
      </div>
    );
  };

  render() {
    const options = this.state.facultyMembers.map(faculty => (
      <Option key={faculty.full_name} value={faculty.full_name}>
        {faculty.full_name}
      </Option>
    ));

    return (
      <div className="aligner">
        <div>
          <h1>Get faculty info here</h1>
          <div>
            <Select
              className="aligner-item aligner-item-center select"
              showSearch
              placeholder="Search for a faculty member"
              optionFilterProp="children"
              onChange={this.handleChange}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
                0
              }
              dropdownMatchSelectWidth={false}
              size="large"
              loading={this.state.loading}
            >
              {options}
            </Select>
            {this.state.showInfo && (
              <div>
                <Divider orientation="left">
                  {this.state.selected + "'s Info"}
                </Divider>
                <Descriptions>
                  <Descriptions.Item label="Name">
                    {this.state.selected}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">{}</Descriptions.Item>
                  <Descriptions.Item label="Phone">{}</Descriptions.Item>
                  <Descriptions.Item label="Job Title">{}</Descriptions.Item>
                  <Descriptions.Item label="Senate Division">{}</Descriptions.Item>
                </Descriptions>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default GetFaculty;
