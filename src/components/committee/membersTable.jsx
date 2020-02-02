import React from 'react';
import { Table, Divider, Form, Input, Button, Popconfirm } from 'antd';
import 'antd/dist/antd.css';
import './index.css';

const pageSize = 5; // Page size to show pagination

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(
          <Input
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
          />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

export default class MembersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.data['committeeAssignment'],
      count: this.props.data['committeeAssignment'].length,
    };
  }
  memberColumns = [
    {
      title: 'Name',
      dataIndex: 'facultyName',
      key: 'facultyNameKey',
      editable: true,
    },
    {
      title: 'Email',
      dataIndex: 'facultyEmail',
      key: 'facultyEmail',
      editable: true,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      editable: true,
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      editable: true,
    },
    {
      title: 'Senate Division',
      dataIndex: 'senateDivision',
      key: 'senateDivision',
      editable: true,
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (text, record) =>
        this.state.dataSource.length >= 1 ? (
          <Popconfirm
            title="Remove member?"
            onConfirm={() => this.handleDelete(record.key)}
          >
            <a>Remove Member</a>
          </Popconfirm>
        ) : null,
    },
  ];
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      facultyName: ``,
      facultyEmail: ``,
      startDate: ``,
      endDate: ``,
      senateDivision: ``,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleDelete = key => {
    console.log(key);
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.memberColumns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Divider type="horizontal" orientation="left">
          Members
        </Divider>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add a member
        </Button>
        <Table
          rowKey={record => record.facultyName}
          bordered
          components={components}
          rowClassName={() => 'editable-row'}
          dataSource={this.state.dataSource}
          columns={columns}
          pagination={this.state.dataSource.length > pageSize && { pageSize }}
        />
      </div>
    );
  }
}
