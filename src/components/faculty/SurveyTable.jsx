import React, { Component } from 'react';
import { Divider, Table, Descriptions } from 'antd';
import 'antd/dist/antd.css';

export default class SurveyTable extends Component {
  labelConverter(key) {
    let label = '';
    switch (key) {
      case 'survey_date':
        label = 'Survey Date';
        return label;
      case 'is_interested':
        label = 'Is Interested';
        return label;
      case 'expertise':
        label = 'Expertise';
        return label;
    }
  }
  render() {
    const columns = [
      {
        title: 'Choice',
        dataIndex: 'choice_id',
        editable: false,
        inputType: 'number',
      },
      {
        title: 'Committee Name',
        dataIndex: 'name',
        editable: false,
        inputType: 'text',
      },
    ];
    const items = [];
    if (this.props.data !== null) {
      Object.entries(this.props.data).forEach(([key, value]) => {
        if (key !== 'choices') {
          if (typeof value === 'boolean') {
            value = 'yes';
          }
          const label = this.labelConverter(key);
          items.push(
            <Descriptions.Item key={key} label={label}>
              {value}
            </Descriptions.Item>
          );
        }
      });
    }

    let choices = [];
    if (this.props.data !== null) {
      choices = this.props.data.choices;
    }
    return (
      <div>
        <Divider type="horizontal" orientation="left">
          Most Recent Survey
        </Divider>
        <Descriptions>{items}</Descriptions>
        <div style={{ marginBottom: 16 }}>
          <Table
            rowKey="choice_id"
            dataSource={choices}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
    );
  }
}
