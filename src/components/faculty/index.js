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
} from 'antd';
import axios from 'axios';
const { Paragraph } = Typography;

var textStyle = {
  color: 'black',
  fontSize: '85%',
  whiteSpace: 'pre-line',
};
var mock = {
  name: "John d'Arc Lorenz IV",
  jobTitle: 'Cat Connoisseur',
  senateDiv: 'I am not the senate',
  departments: ['Computer Science', 'Journalism'],
  expertise: 'Sleep',
  email: '1337h4x69@winning.com',
  phone: '503-xxx-xxxx',
};
const mockFaculty = [
  {
    key: '1',
    committee: 'Computer Science Committee',
    slots: '0',
    description: 'stuff and things',
  },
];
const EditableContext = React.createContext();

class FacultyInfo extends Component {
  constructor(props) {
    super(props);
    //  this.currentCommitteeTable = React.createRef();
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
            <Button type="danger">Delete</Button>
          </span>
        ),
      },
    ];
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
      cols: this.columns,
      loading: false,
      editingKey: '',
      saved: false,
      noFacultyLoaded: false,
      committeeIDList: [],
      facultyName: mock.name,
      facultyEmail: mock.email,
      facultyPhone: mock.phone,
      facultyDepartments: mock.departments,
      facultySenate: mock.senateDiv,
      facultyJob: mock.jobTitle,
      facultyExpert: mock.expertise,
      facultyID: -1,
    };
    this.handler = this.handler.bind(this); // Whenever start/end dates are modified.
    this.onFacultyEdit = this.onFacultyEdit.bind(this); // Whenever faculty info is modified.
  }
  componentDidMount() {
    if (!this.props.email) {
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
      this.getFacultyByEmail(this.props.email);
    }
  }
  retrieveSenateData(senateShortName) {
    // Old retrieval method
    axios
      .get(`http://127.0.0.1:8080/senate-division/${senateShortName}`)
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
    // queries for a specific committee using the ID
    return axios.get(`http://127.0.0.1:8080/committee/${id}`).catch(err => {
      console.log(err);
    });
  }
  retrieveCommitteeAssignments(email) {
    // queries for committees that a faculty is assigned to
    return axios
      .get(`http://127.0.0.1:8080/committee-assignment/faculty/${email}`)
      .catch(err => {
        console.log(err);
      });
  }
  // TODO: Consider promise chaining..
  getFacultyByEmail = async email => {
    var i = 0;
    var idList = [];
    var currentCommitteeList = [];
    var currCommittee = [];
    axios
      .get(`http://127.0.0.1:8080/faculty/${email}`)
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
        alert(err);
        console.log(err);
      });
    const ids = await this.retrieveCommitteeAssignments(email);
    for (i = 0; i < ids.data.length; i++) {
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
    this.setState({
      currCommitteeData: currentCommitteeList,
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
    console.log('Senate changed:', facultySenate);
    if (facultySenate !== this.state.facultySenate) {
      // Check to see if data was actually changed
      this.handler();
      this.setState({ facultySenate });
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <React.Fragment>
        {/* React.Fragment is a great way to cut down on <div> clutter*/}
        {this.loadFaculti(
          this.state.facultyName,
          this.state.facultyJob,
          this.state.facultyEmail,
          this.state.facultyPhone,
          this.state.facultySenate,
          this.state.facultyDepartments, // Passing state data so that it's interactive!
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
    // Currently expects departments arg as a list of strings
    var localDepts = departments.map(departments => (
      <li key={departments.id}>
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
            <Dropdown disabled>
              <Button
                type="link"
                icon="down"
                onClick={this.addDepartment}
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
        <Button type="primary" icon="plus" size="small"></Button>
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
        <Button type="primary" icon="plus" size="small"></Button>
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
        <Button type="primary" icon="plus" size="small"></Button>
        <Divider type="vertical" />
        <h1 style={{ display: 'inline' }}>Committees interested in:</h1>
        <Table dataSource={facultyData} bordered columns={columnData} />
      </span>
    );
  }
  handler() {
    // handler is triggered by child state whenever start/end dates are edited and saved
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
      //      inputType,
      record,
      //      index,
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
      mockFaculty,
      currCommitteeData: this.props.currentCommittee,
      editingKey: '',
      //      data,
      saved: false,
    };
    //    alert(this.props.currentCommittee[0].key);
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
  /*
  componentDidUpdate(prevProps) {
    if (this.props.currCommitteeData !== prevProps.currentCommittee) {
      alert('in');
      this.setState({ currCommitteeData: this.prevProps.currCommitteeData });
    }
  }
*/
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
