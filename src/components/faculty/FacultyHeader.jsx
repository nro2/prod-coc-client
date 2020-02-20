import { Descriptions, Divider, PageHeader, List, Tooltip } from 'antd';
import React, { Component } from 'react';
import FacultyHeaderModal from './FacultyHeaderModal';

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
  /**
   * Child component callback that re-renders the view with the faculty object passed
   * back by the callback.
   *
   * @param faculty Faculty object modified by the child component
   */
  onCreate = faculty => {
    this.props.onCreate(faculty);
  };

  render() {
    const name = buildSurnameForename(this.props.faculty.name);
    const { email, job, phone, senate, departments } = this.props.faculty;

    let hasDepartments;
    if (Array.isArray(departments) && departments.length) {
      hasDepartments = true;
    } else {
      hasDepartments = false;
    }

    return (
      <div>
        <PageHeader
          title={name}
          style={{ paddingLeft: 0 }}
          extra={[
            <FacultyHeaderModal
              key="1"
              faculty={this.props.faculty}
              onCreate={this.onCreate}
              senateDivisions={this.props.senateDivisions}
              departments={this.props.departments}
            />,
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
          <Descriptions.Item label="Senate Division">{senate}</Descriptions.Item>
        </Descriptions>
        <span>Departments:</span>
        {hasDepartments && (
          <List
            rowKey={departments.department_id}
            itemLayout="horizontal"
            grid={{ gutter: 16, column: 4, size: 'small' }}
            dataSource={departments}
            className="department-item"
            renderItem={item => (
              <Tooltip
                title={item.description}
                mouseEnterDelay="0.75"
                mouseLeaveDelay="0.05"
                arrowPointAtCenter="true"
              >
                <List.Item>
                  <List.Item.Meta title={item.name} />
                </List.Item>
              </Tooltip>
            )}
          />
        )}
        <Divider type="horizontal" orientation="left" />
      </div>
    );
  }
}
