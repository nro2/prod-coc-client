import React, { Component } from 'react';
import { Table, Button, Divider } from 'antd';
//import axios from 'axios';

var textStyle = {
  color: 'black',
  fontSize: '85%',
  whiteSpace: 'pre-line',
};
var mock = {
  name: "John d'Arc Lorenz IV",
  jobTitle: 'Cat Connoisseur',
  senateDiv: 'I am the not senate',
  departments: ['Computer Science', 'Journalism'],
  expertise: 'Sleep',
  email: '1337h4x69@winning.com',
  phone: '503-xxx-xxxx',
};
// padding, text-align, font-family, background color

class FacultyInfo extends Component {
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
        title: 'Start/End',
        dataIndex: 'dates',
        key: 'dates',
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: () => (
          <span>
            <a>Delete</a>
            <Divider type="vertical" />
            <a>Add</a>
            <Divider type="vertical" />
            <a>Edit</a>
          </span>
        ),
      },
    ];
    this.facultyData = [
      {
        key: '1',
        committee: 'Computer Science Committee',
        slots: '0',
        description: 'stuff and things',
      },
    ];
    this.state = {
      data: this.facultyData,
      cols: this.columns,
      selectedRowKeys: [],
      loading: false,
      editingKey: '',
    };
  }
  // When the 'update' button is clicked, we start the loading process.
  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        // De-select the checked boxes, and notify DOM
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys }); //
  };
  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <React.Fragment>
        {/* React.Fragment is a great way to cut down on <div> clutter*/}
        {this.loadFaculti(
          mock.name,
          mock.jobTitle,
          mock.email,
          mock.phone,
          mock.senateDiv,
          mock.departments,
          mock.expertise
        )}
        <h1>Currently a part of:</h1>
        {/*TODO: Place button into a function to reduce clutter*/}
        <Button
          type="primary"
          onClick={this.start}
          disabled={!hasSelected}
          loading={loading}
        >
          Update
        </Button>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
        {this.loadCurrentCommittees(rowSelection, this.facultyData, this.columns)}
        <h1>Committees Chosen:</h1>
        {this.loadChosenCommittees(this.facultyData, this.columns)}
        <h1>Committees interested in:</h1>
        {this.loadInterestedCommittees(this.facultyData, this.columns)}
      </React.Fragment>
    );
  }
  loadFaculti(name, jobTitle, email, phone, senateDiv, departments, expertise) {
    // Currently expects departments arg as a list of strings
    var localDepts = departments.map(departments => <li>{departments}</li>);
    // Maps the departments list as an HTML list to localDepts
    return (
      <span>
        <h1>
          {name}
          <Divider type="vertical" />
          <i style={textStyle}>{jobTitle}</i>
          <Divider type="vertical" />
          <span style={textStyle}>{expertise + ' expert'}</span>
        </h1>
        <b style={{ fontSize: '90%' }}>Senate: </b>
        {senateDiv + '\n'}
        <Divider type="horizontal" orientation="left">
          Contact Information
        </Divider>
        <p style={textStyle}>
          <ul>
            <li>{email + '\n'}</li>
            <li>{phone + '\n'}</li>
          </ul>
          <Divider type="horizontal" orientation="left">
            Departments
          </Divider>
          <ul>{localDepts}</ul>
        </p>
      </span>
    ); // Everything above is HTML/AntDesign magic to make it look pretty. This is ONLY Faculti info.
  }
  loadCurrentCommittees(rowsSelected, facultyData, columnData) {
    // load current committees that this faculty member is a part of
    return (
      <Table
        rowSelection={rowsSelected}
        dataSource={facultyData}
        columns={columnData}
      />
    );
  }
  loadChosenCommittees(facultyData, columnData) {
    // Loads the chosen comittee table
    return <Table dataSource={facultyData} columns={columnData} />;
  }
  loadInterestedCommittees(facultyData, columnData) {
    // loads the interested committee table
    return <Table dataSource={facultyData} columns={columnData} />;
  }
}

export default FacultyInfo;
