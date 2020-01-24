import React, { Component } from 'react';
import { Table, Input, Popconfirm, Form, InputNumber } from 'antd';
//import axios from 'axios';
/*const reqData = [
  {
    key: '1',
    senateShortname: 'BP',
    slotFilled: 1,
    slotRequirements: 3,
  },
  {
    key: '2',
    senateShortname: 'AO',
    slotFilled: 5,
    slotRequirements: 7,
  },
];
const memberData = [
  {
    key: '1',
    facultyName: 'Boaty McBoatface',
    email: 'boat@gmail.com',
    start_date: '2019-1-1',
    end_date: '2020-1-1',
    senateDivision: 'BO',
  },
  {
    key: '2',
    facultyName: 'Grace Hopper',
    email: 'ghopper@gmail.com',
    start_date: '2019-1-1',
    end_date: '2020-1-1',
    senateDivision: 'AO',
  },
];*/
const slotData = [
  {
    key: '1',
    totalSlots: '10',
    filledSlots: '5',
  },
  {
    key: '2',
    totalSlots: '10',
    filledSlots: '23',
  },
];
var mock = {
  name: 'Committee on Space Exploration',
  description: 'About exploring space',
  totalSlots: '10',
  filledSlots: '5',
  committeeSlots: [
    {
      key: '1',
      senateShortname: 'BP',
      slotRequirements: 3,
    },
    {
      key: '2',
      senateShortname: 'AO',
      slotRequirements: 7,
    },
  ],
  memberData: [
    {
      key: '1',
      facultyName: 'Boaty McBoatface',
      email: 'boat@gmail.com',
      start_date: '2019-1-1',
      end_date: '2020-1-1',
      senateDivision: 'BO',
    },
    {
      key: '2',
      facultyName: 'Grace Hopper',
      email: 'ghopper@gmail.com',
      start_date: '2019-1-1',
      end_date: '2020-1-1',
      senateDivision: 'AO',
    },
  ],
  slotData: [
    {
      key: '1',
      totalSlots: '10',
      filledSlots: '5',
    },
    {
      key: '2',
      totalSlots: '10',
      filledSlots: '23',
    },
  ],
};

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
      //inputType,
      record,
      //index,
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

class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mock,
      editingKey: '',
      saved: false,
    };
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
      const newData = [...this.state.mock];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ mock: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ mock: newData, editingKey: '' });
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
    const columns = this.props.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.Title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.Data}
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

class Committee extends Component {
  constructor(props) {
    super(props);
    this.slotCol = [
      {
        title: 'Filled',
        dataIndex: 'filledSlots',
        key: 'filledSlots',
        editable: false,
      },
      {
        title: 'Total',
        dataIndex: 'totalSlots',
        key: 'totalSlots',
        editable: false,
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: () => (
          <span>
            <a>Delete</a>
          </span>
        ),
      },
    ];
    this.reqCol = [
      {
        title: 'Senate',
        dataIndex: 'senateShortname',
        key: 'senateShortname',
        editable: false,
      },
      {
        title: 'Filled',
        dataIndex: 'slotFilled',
        key: 'senateFilled',
        editable: false,
      },
      {
        title: 'Required',
        dataIndex: 'slotRequirements',
        key: 'slotRequirements',
        editable: true,
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: () => (
          <span>
            <a> Edit Total Slots </a>
          </span>
        ),
      },
    ];
    this.membersCol = [
      {
        title: 'Name',
        dataIndex: 'facultyName',
        key: 'facultyName',
        editable: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        editable: true,
      },
      {
        title: 'Start Date',
        dataIndex: 'start_date',
        key: 'start_date',
        editable: true,
      },
      {
        title: 'End Date',
        dataIndex: 'end_date',
        key: 'end_date',
        editable: true,
      },
      {
        senate: 'Senate Division',
        dataIndex: 'senateDivision',
        key: 'senateDivision',
        editable: false,
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
    this.reqData = [
      {
        key: '1',
        senateShortname: 'BP',
        slotFilled: 1,
        slotRequirements: 3,
      },
      {
        key: '2',
        senateShortname: 'AO',
        slotFilled: 5,
        slotRequirements: 7,
      },
    ];
    this.memberData = [
      {
        key: '1',
        facultyName: 'Boaty McBoatface',
        email: 'boat@gmail.com',
        start_date: '2019-1-1',
        end_date: '2020-1-1',
        senateDivision: 'BO',
      },
      {
        key: '2',
        facultyName: 'Grace Hopper',
        email: 'ghopper@gmail.com',
        start_date: '2019-1-1',
        end_date: '2020-1-1',
        senateDivision: 'AO',
      },
    ];
    this.state = {
      data: this.slotData,
      cols: this.slotCol,
      loading: false,
      saved: false,
    };
    this.handler = this.handler.bind(this);
  }
  start = () => {
    this.setState({ loading: true, saved: false });
    setTimeout(() => {
      this.setState({
        loading: false,
      });
    }, 1000);
  };
  render() {
    return (
      <React.Fragment>
        {this.loadCommittee(
          mock.name,
          mock.description,
          mock.totalSlots,
          mock.committeeSlots,
          mock.filledSlots
        )}
        <h1>Slots</h1>
        {this.loadSlots(slotData, this.slotCol)}
        <h1>Requirements</h1>
        {/*{this.loadRequirements(this.reqData, this.reqCol)}*/}
        <EditableFormTable
          handler={this.handler}
          currentCommittee={this.reqData}
          columns={this.reqCol}
        />
        <h1>Members</h1>
        {/*{this.loadMembers(this.memberData, this.membersCol)}*/}
        <EditableFormTable
          handler={this.handler}
          currentCommittee={this.memberData}
          columns={this.membersCol}
        />
        {this.loadCommittee}
      </React.Fragment>
    );
  }

  loadCommittee(name, description) {
    return (
      <h1>
        <h1>{name}</h1>
        {description + '\n'}
      </h1>
    );
  }
  loadSlots(slotData, columnData) {
    return <Table dataSource={slotData} columns={columnData} />;
  }
  loadRequirements(reqData, columnData) {
    return <Table dataSource={reqData} columns={columnData} />;
  }
  loadMembers(memberData, columnData) {
    return <Table dataSource={memberData} columns={columnData} />;
  }
  handler() {
    this.setState({
      saved: true,
    });
  }
}

export default Committee;
