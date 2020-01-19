import React, { Component } from 'react';
import { Table, Button, Divider, Form, Popconfirm, Input, InputNumber } from 'antd';
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
const mockFaculty = [
  {
    key: '1',
    committee: 'Computer Science Committee',
    slots: '0',
    description: 'stuff and things',
  },
];
const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
const EditableContext = React.createContext();

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
      data,
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
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="Cancel without saving?"
                onConfirm={() => this.cancel(record.key)}
              >
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
              Edit
            </a>
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
      } else {
        newData.push(row);
        this.setState({ mockFaculty: newData, editingKey: '' });
      }
    });
    this.props.handler();
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

//ReactDOM.render(<EditableFormTable />, mountNode);

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
    //  alert(this.facultyData[0].key);
    this.state = {
      data: this.facultyData,
      cols: this.columns,
      selectedRowKeys: [],
      loading: false,
      editingKey: '',
      saved: false,
    };
    this.handler = this.handler.bind(this);
  }
  // When the 'update' button is clicked, we start the loading process.
  start = () => {
    this.setState({ loading: true, saved: false });
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
          disabled={!this.state.saved}
          loading={loading}
        >
          Update
        </Button>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
        <EditableFormTable
          handler={this.handler}
          currentCommittee={this.facultyData}
        />
        {/*this.loadCurrentCommittees(rowSelection, this.state.data, this.state.cols)*/}
        <h1>Committees Chosen:</h1>
        {this.loadChosenCommittees(this.state.data, this.state.cols)}
        <h1>Committees interested in:</h1>
        {this.loadInterestedCommittees(this.state.data, this.state.cols)}
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
  handler() {
    this.setState({
      saved: true,
    });
  }
}

export default FacultyInfo;
