import React, { Component } from 'react';
import { Table, Button, Divider, Form, Popconfirm, Input, InputNumber } from 'antd';

const EditableContext = React.createContext();

class EditableCell extends Component {
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

class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCommittees: [],
      editingKey: '',
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentCommittees !== prevState.currentCommittees) {
      return { currentCommittees: nextProps.currentCommittees };
    } else {
      return null;
    }
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
      const newData = [...this.state.currentCommittees];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ currentCommittees: newData, editingKey: '' });
        this.props.enableSaveChangesButton(); // enableSaveChangesButton is placed here to prevent undesirable behavior
      } else {
        newData.push(row);
        this.setState({ currentCommittees: newData, editingKey: '' });
        this.props.enableSaveChangesButton(); // enableSaveChangesButton is placed here to prevent undesirable behavior
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
          dataSource={this.state.currentCommittees}
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

export default EditableFormTable;
