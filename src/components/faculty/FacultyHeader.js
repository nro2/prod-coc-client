import { Button, Descriptions, Divider, Modal, PageHeader } from 'antd';
import React, { Component } from 'react';

/**
 * Builds a name in the format Surname, Forename.
 *
 * @param fullName    Full name to split and build
 * @returns {string}  Full name in "Surname, Forename" format
 */
const buildSurnameForename = fullName => {
  const firstName = fullName
    .split(' ')
    .slice(0, -1)
    .join(' ');
  const lastName = fullName
    .split(' ')
    .slice(-1)
    .join(' ');

  if (!firstName) {
    return lastName;
  }

  return `${lastName}, ${firstName}`;
};

export default class FacultyHeader extends Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const name = buildSurnameForename(this.props.faculty.name);
    const { email, job, phone } = this.props.faculty;

    const form = () => {
      return (
        <div>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </div>
      );
    };

    return (
      <div>
        <PageHeader
          title={name}
          style={{ paddingLeft: 0 }}
          extra={[
            <div key="1">
              <Button type="primary" onClick={this.showModal}>
                Edit
              </Button>
              <Modal
                title="Edit Faculty"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                {form()}
              </Modal>
            </div>,
          ]}
          avatar={{ icon: 'user' }}
        />
        <Divider type="horizontal" orientation="left">
          Info
        </Divider>
        <Descriptions size="small" column={2}>
          <Descriptions.Item label="Email">
            <a href={`mailto:${email}`}>{email}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Phone">{phone}</Descriptions.Item>
          <Descriptions.Item label="Title">{job}</Descriptions.Item>
        </Descriptions>
        <Divider type="horizontal" orientation="left" />
      </div>
    );
  }
}
