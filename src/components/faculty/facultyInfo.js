import React, { Component } from 'react';
import { Button, Divider, Avatar, Typography, Dropdown } from 'antd';
const { Paragraph } = Typography;

const textStyle = {
  color: 'black',
  fontSize: '85%',
  whiteSpace: 'pre-line',
};

class FacultyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      facultyName: 'Faculty Name',
      facultyEmail: 'none-specified',
      facultyPhone: '(000)-000-0000',
      facultyDepartments: [{ key: 1, name: 'none' }],
      facultySenate: 'Faculty Senate',
      facultyJob: 'Faculty Job',
      facultyExpert: 'Faculty Expertise',
      facultyID: -1,
    };
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      facultyName: newProps.object.facultyName,
      facultyEmail: newProps.object.facultyEmail,
      facultyPhone: newProps.object.facultyPhone,
      facultyDepartments: newProps.object.facultyDepartments,
      facultySenate: newProps.object.facultySenate,
      facultyJob: newProps.object.facultyJob,
      facultyExpert: newProps.object.facultyExpert,
      facultyID: newProps.object.facultyID,
    });
  }
  onPhoneChange = facultyPhone => {
    // on edit change to phone #
    console.log('Phone changed:', facultyPhone);
    if (facultyPhone !== this.state.facultyPhone) {
      // Check to see if data was actually changed
      this.props.enableSaveChangesButton(
        facultyPhone,
        this.state.facultySenate,
        null
      );
    }
  };
  onSenateChange = facultySenate => {
    // on edit change to senate division
    // TODO: Change this to a dropdown like with committees and departments
    console.log('Senate changed:', facultySenate);
    if (facultySenate !== this.state.facultySenate) {
      // Check to see if data was actually changed
      this.props.enableSaveChangesButton(
        this.state.facultyPhone,
        facultySenate,
        null
      );
    }
  };
  render() {
    return (
      <React.Fragment>
        {this.renderFacultiInfo(this.state.facultyDepartments)}
      </React.Fragment>
    );
  }
  renderFacultiInfo(departments) {
    // .map() list function is relating the department name to it's own specific delete button
    // and placing it in an HTML list that we call later
    const localDepts = departments.map(departments => (
      <li key={departments.key}>
        {departments.name}
        <Button
          type="link"
          onClick={() => {
            this.props.removeDepartment(departments);
          }}
          size="small"
        >
          x
        </Button>
      </li>
    ));
    // Maps the departments list as an HTML list to localDepts
    return (
      <span>
        <h1>
          <Avatar size={64} icon="user" />
          <Divider type="vertical" />
          {this.state.facultyName}
          <Divider type="vertical" />
          <i style={textStyle}>{this.state.facultyJob}</i>
          <Divider type="vertical" />
          <span style={textStyle}>{this.state.facultyExpert}</span>
          <Divider type="vertical" />
          <Button type="link" onClick={() => this.props.sayHello()} size="small">
            Change
          </Button>
        </h1>
        <p style={{ fontSize: '90%' }}>
          <b>Senate: </b>
          <Paragraph
            style={{ display: 'inline' }}
            editable={{ onChange: this.onSenateChange }}
          >
            {this.state.facultySenate}
          </Paragraph>
          <Divider type="vertical" />
          <Button
            size="small"
            onClick={() => {
              this.props.getFacultyByEmail('wolsborn@pdx.edu');
            }}
          >
            Retrieve Joshy
          </Button>
        </p>
        <Divider type="horizontal" orientation="left">
          Contact Information
        </Divider>
        <p style={textStyle}>
          <ul>
            <li>{this.state.facultyEmail + '\n'}</li>
            <li>
              <Paragraph editable={{ onChange: this.onPhoneChange }}>
                {this.state.facultyPhone}
              </Paragraph>
            </li>
          </ul>
          <Divider type="horizontal" orientation="left">
            Departments
          </Divider>
          <ul>
            {localDepts}
            {/*TODO: make button have departments in the dropdown, and disabled when no faculty member is selected*/}
            <Dropdown overlay={this.props.departmentsDropdownMenu}>
              <Button type="link" icon="down" size="small">
                Add
              </Button>
            </Dropdown>
          </ul>
        </p>
      </span>
    );
  }
}

export default FacultyInfo;
