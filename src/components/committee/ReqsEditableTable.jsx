import React from 'react';
import {
  Table,
  Button,
  InputNumber,
  Form,
  Input,
  Popconfirm,
  message,
  Divider,
} from 'antd';
import moment from 'moment';
import axios from 'axios';

const pageSize = 30;

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  getDefaultValue = value => {
    if (this.props.inputType === 'date') {
      return moment(value);
    }

    return value;
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
                  message: `Please Input ${title}!`,
                },
                {
                  validator: this.props.validateSlotReq,
                },
              ],
              initialValue: this.getDefaultValue(record[dataIndex]),
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
    this.state = { data: this.props.data, editingKey: '' };

    const operations = {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => {
        const { editingKey } = this.state;
        const editable = this.isEditing(record);
        return editable ? (
          <span>
            <EditableContext.Consumer>
              {form => (
                <Button
                  type="link"
                  onClick={() =>
                    this.save(
                      form,
                      record.senateShortname,
                      record.slotMinimum,
                      this.props.committeeId
                    )
                  }
                  style={{ marginRight: 8 }}
                >
                  Save
                </Button>
              )}
            </EditableContext.Consumer>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={() => this.cancel(record.senateShortname)}
            >
              <Button type="link">Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <React.Fragment>
            <Button
              type="link"
              disabled={editingKey !== ''}
              onClick={() => this.edit(record.senateShortname)}
            >
              Edit
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() =>
                this.delete(record.senateShortname, this.props.committeeId)
              }
            >
              <Button type="link">Delete</Button>
            </Popconfirm>
          </React.Fragment>
        );
      },
    };

    this.columns = this.props.columns;
    this.columns.push(operations);
  }

  isEditing = record => record.senateShortname === this.state.editingKey;

  validateSlotRequirement = (rule, value, callback) => {
    if (value < 1) {
      callback('Slot requirement must be greater than 0');
    } else {
      callback();
    }
  };

  updateSlotReqs = async (senateShortname, committeeId, slotReqs) => {
    const res = axios.put(`api/committee-slots/${committeeId}/${senateShortname}`, {
      slotRequirements: slotReqs,
    });
    return res;
  };

  //TODO
  deleteAssignment = async (email, committeeId) => {
    const res = await axios.delete(
      `api/committee-assignment/${committeeId}/${email}`
    );
    return res;
  };

  save(form, senateShortname, committee_id) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }

      this.setState({
        editingKey: '',
      });
      const slotReqs = row['slotMinimum'];
      this.updateSlotReqs(senateShortname, committee_id, slotReqs)
        .then(() => {
          message.success('Record updated successfully!');
        })
        .catch(err => {
          message.error(err.response.data.error);
        });
    });

    this.props.rerenderParentCallback();
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  //TODO
  delete = (email, committeeId) => {
    this.deleteAssignment(email, committeeId)
      .then(() => {
        message.success('Record deleted successfully!');
      })
      .catch(err => {
        message.error(err.response.data.error);
      });

    this.props.rerenderParentCallback();
  };

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
          inputType: col.inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          validateSlotReq: this.validateSlotRequirement,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          rowKey="senateShortname"
          size="small"
          components={components}
          bordered
          dataSource={this.props.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={1 > pageSize && { pageSize }}
        />
      </EditableContext.Provider>
    );
  }
}

const ReqsEditableFormTable = Form.create()(EditableTable);

export default ReqsEditableFormTable;
