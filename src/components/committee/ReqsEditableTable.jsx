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
    const { editing, dataIndex, title, record, children } = this.props;

    return (
      <td>
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
    this.state = { editingKey: '' };

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
                    this.save(form, record.senateShortname, this.props.committeeId)
                  }
                  style={{ marginRight: 8 }}
                >
                  Save
                </Button>
              )}
            </EditableContext.Consumer>
            <Popconfirm
              title="Cancel without saving?"
              onConfirm={() => this.cancel()}
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
              title="Delete this field?"
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
      callback('The minimum slot requirement must be greater than 0');
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

  deleteRequirement = async (senateShortname, committeeId) => {
    const res = await axios.delete(
      `api/committee-slots/${committeeId}/${senateShortname}`
    );
    return res;
  };

  save(form, senateShortname, committee_id) {
    const errorMessages = {
      400: 'Missing field(s) in request',
      404: 'Committee ID or senate do not exist',
      500: 'Unable to complete transaction',
    };

    const handleErrors = error => {
      const { status } = error.response;
      const errorMessage = errorMessages[status];

      if (!errorMessage) {
        message.error('Unknown error');
      } else {
        message.error(errorMessage);
      }
    };

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
          handleErrors(err);
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

  delete = (senateShortname, committeeId) => {
    const errorMessages = {
      404: 'No committee found with requested id and senate division name',
      500: 'Unable to delete record',
    };

    const handleErrors = error => {
      const { status } = error.response;
      const errorMessage = errorMessages[status];

      if (!errorMessage) {
        message.error('Unknown error');
      } else {
        message.error(errorMessage);
      }
    };

    this.deleteRequirement(senateShortname, committeeId)
      .then(() => {
        message.success('Record deleted successfully!');
      })
      .catch(err => {
        handleErrors(err);
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
          pagination={false}
        />
      </EditableContext.Provider>
    );
  }
}

const ReqsEditableFormTable = Form.create()(EditableTable);

export default ReqsEditableFormTable;
