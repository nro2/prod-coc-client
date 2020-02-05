import React, { Component } from 'react';
import { Table, Divider, Form, Input } from 'antd';
import 'antd/dist/antd.css';

const pageSize = 5; // Page size to show pagination

const EditableContext = React.createContext();

const EditableRow = ({ form, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
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
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }}>
        {children}
      </div>
    );
  };

  render() {
    const { children, ...restProps } = this.props;
    return <td {...restProps}>{children}</td>;
  }
}

export default class MembersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.data['committeeAssignment'],
      start: this.props.data['committeeAssignment'],
      end: this.props.data['committeeAssignment'],
      count: this.props.data['committeeAssignment'].length,
    };
  }
  memberColumns = [
    {
      title: 'Name',
      dataIndex: 'facultyName',
      key: 'facultyNameKey',
    },
    {
      title: 'Email',
      dataIndex: 'facultyEmail',
      key: 'facultyEmail',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Senate Division',
      dataIndex: 'senateDivision',
      key: 'senateDivision',
    },
  ];

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.memberColumns.map(col => {
      return {
        ...col,
        onCell: record => ({
          record,

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
        <Table
          rowKey={record => record.facultyName}
          bordered
          components={components}
          dataSource={this.state.dataSource}
          columns={columns}
          pagination={this.state.dataSource.length > pageSize && { pageSize }}
        />
      </div>
    );
  }
}
