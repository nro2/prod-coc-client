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
const { Paragraph, Text } = Typography;

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
      saved: false,
      facultyName: mock.name,
      facultyEmail: mock.email,
      facultyPhone: mock.phone,
      facultyDepartments: mock.departments,
      facultySenate: mock.senateDiv,
      facultyJob: mock.jobTitle,
      facultyExpert: mock.expertise,
      deptList: '',
    };
    this.handler = this.handler.bind(this); // Whenever start/end dates are modified.
    this.onFacultyEdit = this.onFacultyEdit.bind(this); // Whenever faculty info is modified.
  }
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
    alert('Current departments:' + this.state.facultyDepartments);
  };
  addDepartment = toAdd => {
    return null;
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
          mock.name,
          mock.jobTitle,
          mock.email,
          mock.phone,
          mock.senateDiv,
          this.state.facultyDepartments, // Passing state data so that it's interactive!
          mock.expertise
        )}
        {this.loadCurrentCommittees(this.state.data, this.state.cols)}
        {this.loadChosenCommittees(this.state.data, this.state.cols)}
        {this.loadInterestedCommittees(this.state.data, this.state.cols)}
        {this.loadUpdateButton(this.start, this.state.saved, loading)}
      </React.Fragment>
    );
  }
  testText() {
    return <Text editable="true">Touch me!</Text>;
  }
  loadUpdateButton(start, saved, loading) {
    // TODO: Add a 'reset' button to revert all changes
    return (
      <Button type="primary" onClick={start} disabled={!saved} loading={loading}>
        Save Changes
      </Button>
    );
  }
  loadFaculti(name, jobTitle, email, phone, senateDiv, departments, expertise) {
    // Currently expects departments arg as a list of strings
    var localDepts = departments.map(departments => (
      <li>
        {departments}
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
          <span style={textStyle}>{expertise + ' expert'}</span>
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
            {this.state.facultySenate}
          </Paragraph>
        </p>
        <Divider type="horizontal" orientation="left">
          Contact Information
        </Divider>
        <p style={textStyle}>
          <ul>
            <li>{email + '\n'}</li>
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

          <Divider type="vertical" />
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
          currentCommittee={this.facultyData}
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
  facultyEdit() {} // triggered by another component whenever faculty info is edited
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
      inputType,
      record,
      index,
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

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.mockFaculty];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ mockFaculty: newData, editingKey: '' });
        this.props.handler(); // handler is placed here to prevent undesirable behavior
      } else {
        newData.push(row);
        this.setState({ mockFaculty: newData, editingKey: '' });
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
          dataSource={this.state.mockFaculty}
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
