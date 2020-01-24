import React, { Component } from 'react';
import {
  Table,
  Button,
  Divider,
  Form,
  Popconfirm,
  Input,
  InputNumber,
  Avatar,
  Typography,
  notification,
  Dropdown,
  Menu,
} from 'antd';
//import './faculty.css'; // for page-specific styling, not implemented yet..
import axios from 'axios';
const { Paragraph } = Typography;

var textStyle = {
  color: 'black',
  fontSize: '85%',
  whiteSpace: 'pre-line',
};

const EditableContext = React.createContext();

class FacultyInfo extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      // this is for our columns in our <Table> component
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
            <Button type="danger">Delete</Button>
          </span>
        ),
      },
    ];
    this.departmentsMenu = ''; // holds our dropdown lists
    this.committeesMenu = ''; // holds our dropdown lists
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
      currCommitteeData: [],
      allCommittees: [],
      allDepartments: [],
      //     interestedCommitteeData: [], // empty for now ..
      //     chosenCommitteeData: [], // empty for now ..
      cols: this.columns,
      loading: false,
      editingKey: '',
      saved: false,
      noFacultyLoaded: false,
      committeeIDList: [],
      facultyName: 'non-specified',
      facultyEmail: 'Faculty name',
      facultyPhone: '(000)-000-0000',
      facultyDepartments: [{ key: 1, name: 'none' }],
      facultySenate: 'Faculty Senate',
      facultyJob: 'Faculty Job',
      facultyExpert: 'Faculty Expertise',
      facultyID: -1,
    };
    this.handler = this.handler.bind(this); // Whenever start/end dates are modified.
    this.onFacultyEdit = this.onFacultyEdit.bind(this); // Whenever faculty info is modified.
  }
  componentDidMount() {
    // This method immediately loads when the Faculty Info component is first rendered.
    // For more information search "React component lifecycle diagram". Below is the order we retrieve data in:
    // 1. All committee and department data. We then set the state.
    // 2. All faculty data. We then set the state.
    // 3. All associations. We then set the state.
    // TODO: I will reduce the number of times setState is called on render from ~3-4 to 1.
    this.retrieveDropdownOptions();
    if (!this.props.email) {
      // if no email is supplied in props, load placeholder data
      this.setState({
        facultyEmail: 'non-specified',
        facultyName: 'Faculty name',
        facultyPhone: '(000)-000-0000',
        facultyDepartments: [
          {
            key: 1,
            name: 'none',
          },
        ],
        facultySenate: 'Faculty Senate',
        facultyJob: 'Faculty Job',
        facultyExpert: 'Faculty Expertise',
        noFacultyLoaded: true,
        facultyID: -1,
      });
    } else {
      // otherwise, immediately retrieve all of the data for this faculti
      this.getFacultyByEmail(this.props.email);
    }
  }
  retrieveDropdownOptions = async () => {
    const committees = await this.retrieveAllCommittees();
    const departments = await this.retrieveAllDepartments();
    var committeeList = [];
    var departmentList = [];
    var length = committees.data.length;
    var i = 0;
    // Begin manipulating our promise objects for the data we want.
    // They work the same as any other object would.
    for (i = 0; i < length; i++) {
      committeeList.push({
        id: committees.data[i].committee_id,
        name: committees.data[i].name,
      });
    }
    length = departments.data.length;
    for (i = 0; i < length; i++) {
      departmentList.push({
        id: departments.data[i].department_id,
        name: departments.data[i].name,
      });
    }
    this.setState({
      // Generate local lists and only modify states through setState.
      // We must treat states as immutable.
      // This is the way.
      allCommittees: committeeList,
      allDepartments: departmentList,
    });
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
  retrieveSenateData(senateShortName) {
    // TODO: change to follow the format of the other retrieval methods
    axios
      .get(`/api/senate-division/${senateShortName}`)
      .then(response => {
        console.log(response.data);
        let senateInfo = response.data; // assigns response promise
        this.setState({
          facultySenate: senateInfo.name,
        });
      })
      .catch(err => {
        console.log(err);
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
    var i = 0;
    var idList = [];
    var dptIdList = [];
    var currentCommitteeList = [];
    var currCommittee = '';
    var currDepartment = '';
    var currDepartmentList = [];
    axios
      .get(`/api/faculty/${email}`)
      .then(response => {
        console.log(response.data);
        let facultyObject = response.data;
        this.retrieveSenateData(facultyObject.senate_division_short_name);
        this.setState({
          facultyName: facultyObject.full_name,
          facultyEmail: facultyObject.email,
          facultyPhone: facultyObject.phone_num,
          facultyJob: facultyObject.job_title,
          // facultySenate update handled by retrieveSenateData()
        });
      })
      .catch(err => {
        console.log(err);
      });
    const ids = await this.retrieveCommitteeAssignments(email);
    const departmentIds = await this.retrieveDepartmentAssignments(email);
    var length = 0; // ids.data.length
    for (i = 0; i < length; i++) {
      idList.push(ids.data[i].committee_id);
      currCommittee = await this.retrieveCommitteeByID(idList[i]);
      currentCommitteeList.push({
        key: `${i}`,
        committee: currCommittee.data.name,
        slots: currCommittee.data.total_slots,
        description: currCommittee.data.description,
        startDate: ids.data[i].start_date,
        endDate: ids.data[i].end_date,
      });
    }
    dptIdList = departmentIds.data.department_ids;
    for (i = 0; i < dptIdList.length; i++) {
      currDepartment = await this.retrieveDepartmentByID(dptIdList[i]);
      currDepartmentList.push({
        key: dptIdList[i],
        name: currDepartment.data.name,
      });
      // currently ignoring the department's description,
      // may need to add in the future
    }
    this.setState({
      // Once all of our committees and departments are sorted, we can finally set their state.
      currCommitteeData: currentCommitteeList,
      facultyDepartments: currDepartmentList,
    });
  };
  onFacultyEdit(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  // When the 'update' button is clicked, we start the loading process.
  start = () => {
    this.setState({ loading: true, saved: false });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        // De-select the checked boxes, and notify DOM
        loading: false,
      });
    }, 1000);
    this.openNotification('topRight'); // Push a notification to the user
  };
  openNotification = placement => {
    notification.info({
      message: `Success!`,
      description: `${this.state.facultyName}'s profile has been updated!`,
      placement,
    });
  };
  sayHello = () => {
    // Used for debugging, or as a placeholder
    alert('Hello! I am not yet implemented.');
  };
  removeDepartment = toRemove => {
    let localDepts = this.state.facultyDepartments.filter(title => {
      return title !== toRemove;
    });
    console.log('Department removed:', toRemove);
    this.setState({ facultyDepartments: localDepts });
  };
  onPhoneChange = facultyPhone => {
    // on edit change to phone #
    console.log('Phone changed:', facultyPhone);
    if (facultyPhone !== this.state.facultyPhone) {
      // Check to see if data was actually changed
      this.handler();
      this.setState({ facultyPhone });
    }
  };
  onSenateChange = facultySenate => {
    // on edit change to senate division
    // TODO: Change this to a dropdown like with committees and departments
    console.log('Senate changed:', facultySenate);
    if (facultySenate !== this.state.facultySenate) {
      // Check to see if data was actually changed
      this.handler();
      this.setState({ facultySenate });
    }
  };
  onDepartmentAdd = toAdd => {
    // expects department object as argument, and appends our faculty member's department associations
    console.log('Department added:', toAdd);
    var length = this.state.facultyDepartments.length;
    var i = 0;
    var onList = false;
    for (i = 0; i < length; i++) {
      // check if already on faculti's list
      if (toAdd.name == this.state.facultyDepartments[i].name) {
        onList = true;
      }
    }
    if (onList == false) {
      // if not, we add it.
      this.state.facultyDepartments.push(toAdd);
    }
  };
  createDepartmentMenu() {
    // Manipulates departments into menu items, and then returns it as a menu object
    var departments = this.state.allDepartments;
    var departmentsMenu = departments.map(departments => (
      <Menu.Item key={departments.id}>
        <a style={{ fontSize: '75%' }}>{departments.name}</a>
      </Menu.Item>
    ));
    return <Menu>{departmentsMenu}</Menu>;
  }
  createCommitteesMenu() {
    // Manipulates committees into menu items, and then returns it as a menu object
    var committees = this.state.allCommittees;
    var committeesMenu = committees.map(committees => (
      <Menu.Item key={committees.id}>
        <a style={{ fontSize: '75%' }}>{committees.name}</a>
      </Menu.Item>
    ));
    return <Menu>{committeesMenu}</Menu>;
  }
  /*******************************************************/
  // Everything above this point manipulates data, or
  // sends queries to the server
  /*******************************************************/
  render() {
    const { loading } = this.state;
    this.departmentsMenu = this.createDepartmentMenu();
    this.committeesMenu = this.createCommitteesMenu();
    return (
      <React.Fragment>
        {/*
        Lots of arguments for LoadFaculti() to reduce the 'this.state.stuff'
        syntax that would make LoadFaculti unreadable
        */}
        {this.loadFaculti(
          this.state.facultyName,
          this.state.facultyJob,
          this.state.facultyEmail,
          this.state.facultyPhone,
          this.state.facultySenate,
          this.state.facultyDepartments,
          this.state.facultyExpert
        )}
        {this.loadCurrentCommittees(this.state.currCommitteeData, this.state.cols)}
        {this.loadChosenCommittees(this.state.data, this.state.cols)}
        {this.loadInterestedCommittees(this.state.data, this.state.cols)}
        {this.loadUpdateButton(this.start, this.state.saved, loading)}
      </React.Fragment>
    );
  }
  /**************************************************************/
  // Everything below this point focuses on rendering components.
  /**************************************************************/
  loadUpdateButton(start, saved, loading) {
    // TODO: Add a 'reset' button to revert all changes?
    return (
      <Button type="primary" onClick={start} disabled={!saved} loading={loading}>
        Save Changes
      </Button>
    );
  }
  loadFaculti(name, jobTitle, email, phone, senateDiv, departments, expertise) {
    // .map() list function is relating the department name to it's own specific delete button
    // and placing it in an HTML list that we call later
    var localDepts = departments.map(departments => (
      <li key={departments.key}>
        {departments.name}
        <Button
          type="link"
          onClick={() => {
            this.removeDepartment(departments);
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
          {name}
          <Divider type="vertical" />
          <i style={textStyle}>{jobTitle}</i>
          <Divider type="vertical" />
          <span style={textStyle}>{expertise}</span>
          <Divider type="vertical" />
          <Button type="link" onClick={this.sayHello} size="small">
            Change
          </Button>
        </h1>
        <p style={{ fontSize: '90%' }}>
          <b>Senate: </b>
          <Paragraph
            style={{ display: 'inline' }}
            editable={{ onChange: this.onSenateChange }}
          >
            {senateDiv}
          </Paragraph>
          <Divider type="vertical" />
          <Button
            size="small"
            onClick={() => {
              this.getFacultyByEmail('wolsborn@pdx.edu');
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
            <li>{email + '\n'}</li>
            <li>
              <Paragraph editable={{ onChange: this.onPhoneChange }}>
                {phone}
              </Paragraph>
            </li>
          </ul>
          <Divider type="horizontal" orientation="left">
            Departments
          </Divider>
          <ul>
            {localDepts}
            {/*TODO: make button have departments in the dropdown, and disabled when no faculty member is selected*/}
            <Dropdown overlay={this.departmentsMenu}>
              <Button
                type="link"
                icon="down"
                onClick={() => this.sayHello()}
                size="small"
              >
                Add
              </Button>
            </Dropdown>
          </ul>
        </p>
      </span>
    ); // Everything above is HTML/AntDesign magic to make it look pretty. This is ONLY Faculti info.
  }
  loadCurrentCommittees() {
    // load current committees that this faculty member is a part of, start/end dates are editable
    return (
      <span>
        <Dropdown overlay={this.committeesMenu}>
          <Button
            type="primary"
            icon="plus"
            size="small"
            onClick={() => this.sayHello()}
          ></Button>
        </Dropdown>
        <Divider type="vertical" />
        <h1 style={{ display: 'inline' }}>Currently a part of:</h1>
        <EditableFormTable
          handler={this.handler}
          currentCommittee={this.state.currCommitteeData}
        />
      </span>
    );
  }
  loadChosenCommittees(facultyData, columnData) {
    // Loads the chosen comittee table
    return (
      <span>
        <Dropdown overlay={this.committeesMenu}>
          <Button
            type="primary"
            icon="plus"
            size="small"
            onClick={() => this.sayHello()}
          ></Button>
        </Dropdown>
        <Divider type="vertical" />
        <h1 style={{ display: 'inline' }}>Committees Chosen:</h1>
        <Table dataSource={facultyData} bordered columns={columnData} />
      </span>
    );
  }
  loadInterestedCommittees(facultyData, columnData) {
    // loads the interested committee table
    return (
      <span>
        <Dropdown overlay={this.committeesMenu}>
          <Button
            type="primary"
            icon="plus"
            size="small"
            onClick={() => this.sayHello()}
          ></Button>
        </Dropdown>
        <Divider type="vertical" />
        <h1 style={{ display: 'inline' }}>Committees interested in:</h1>
        <Table dataSource={facultyData} bordered columns={columnData} />
      </span>
    );
  }
  handler() {
    // handler is triggered by child state whenever start/end dates are edited and saved
    // this is what allows the 'save changes button' to be enabled when changes are made
    this.setState({
      saved: true,
    });
  }
}

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      record,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please input the ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currCommitteeData: this.props.currentCommittee,
      editingKey: '',
      saved: false,
    };
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'committee',
        key: 'committee',
        editable: false,
      },
      {
        title: 'Slots available',
        dataIndex: 'slots',
        key: 'slots',
        editable: false,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        editable: false,
      },
      {
        title: 'Start',
        dataIndex: 'startDate',
        key: 'startDate',
        editable: true,
      },
      {
        title: 'End',
        dataIndex: 'endDate',
        key: 'endDate',
        editable: true,
      },
      {
        title: 'Action',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <Button
                    type="link"
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </Button>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="Cancel without saving?"
                onConfirm={() => this.cancel(record.key)}
              >
                <Button type="link">Cancel</Button>
              </Popconfirm>
            </span>
          ) : (
            <span>
              <Button
                type="primary"
                disabled={editingKey !== ''}
                onClick={() => this.edit(record.key)}
                ghost
              >
                Edit
              </Button>
              <Divider type="vertical" />
              <Button type="danger">Delete</Button>
            </span>
          );
        },
      },
    ];
  }
  // TODO: Find a new way of updating child state, as this method is deprecated
  componentWillReceiveProps(newProps) {
    this.setState({ currCommitteeData: newProps.currentCommittee });
  }
  isEditing = record => record.key === this.state.editingKey;
  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.currCommitteeData];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ currCommitteeData: newData, editingKey: '' });
        this.props.handler(); // handler is placed here to prevent undesirable behavior
      } else {
        newData.push(row);
        this.setState({ currCommitteeData: newData, editingKey: '' });
        this.props.handler(); // handler is placed here to prevent undesirable behavior
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.currCommitteeData}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default FacultyInfo;
