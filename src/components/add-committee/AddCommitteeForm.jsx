import { Form, Input, Button, InputNumber } from 'antd';
import React from 'react';
import axios from 'axios';

const { TextArea } = Input;

class AddCommitteeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      committeeName: [],
      description: [],
      totalSlots: [],
    };
  }

  onSubmitHandler = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.postAssignment(
          values['committeeName'],
          values['description'],
          values['totalSlots']
        )
          .then(() => {
            this.props.onSuccess(values['email']);
          })
          .catch(err => {
            console.log(err.response);
          });
      }
    });
  };

  postAssignment = async (
    fullname,
    email,
    jobTitle,
    phoneNum,
    senateDivision,
    departments
  ) => {
    if (departments) {
      const departmentAssociations = departments.map(item => {
        return {
          department_id: item,
        };
      });

      const res = await axios.post('/api/faculty', {
        fullName: fullname,
        email: email,
        jobTitle: jobTitle,
        phoneNum: phoneNum,
        senateDivision: senateDivision,
        departmentAssociations: departmentAssociations,
      });
      return res;
    } else {
      const res = await axios.post('/api/faculty', {
        fullName: fullname,
        email: email,
        jobTitle: jobTitle,
        phoneNum: phoneNum,
        senateDivision: senateDivision,
      });
      return res;
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const descriptionConfig = {
      initialValue: ' ',
    };

    const totalSlotsConfig = {
      initialValue: 1,
    };

    return (
      <Form onSubmit={this.onSubmitHandler} {...formItemLayout} labelAlign="left">
        <h1>Add New Committee</h1>
        <Form.Item label="Committee Name">
          {getFieldDecorator('committeeName', {
            rules: [
              {
                required: true,
                message: 'Please input committee name',
                whitespace: true,
                labelAlign: 'left',
              },
            ],
          })(<Input placeholder="Committee Name" />)}
        </Form.Item>
        <Form.Item label="Description">
          {getFieldDecorator('desription', descriptionConfig, {
            rules: [
              {
                required: true,
                message: 'Please input committee description',
                whitespace: true,
              },
            ],
          })(<TextArea rows={4} />)}
        </Form.Item>
        <Form.Item label="Total Slots">
          {getFieldDecorator('totalSlots', totalSlotsConfig, {
            rules: [
              {
                type: 'totalSlots',
                required: true,
              },
            ],
          })(<InputNumber min={1} />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedDisplayForm = Form.create({ name: 'AddCommittee' })(AddCommitteeForm);

export default WrappedDisplayForm;
