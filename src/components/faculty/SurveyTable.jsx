import React, { Component } from 'react';
import { Divider, Table, Descriptions } from 'antd';
import 'antd/dist/antd.css';

export default class SurveyTable extends Component {
  constructor(props) {
    super(props);
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

    let items = [];
    console.log(this.props.data);
    if (this.props.data !== undefined) {
      Object.entries(this.props.data).forEach(([key, value]) => {
        if (key !== 'choices') {
          if (typeof value === 'boolean') {
            value = 'yes';
          }
          items.push(
            <Descriptions.Item key={key} label={key}>
              {value}
            </Descriptions.Item>
          );
        }
      });
    }

    return (
      <div>
        <Divider type="horizontal" orientation="left">
          Most Recent Survey
        </Divider>
        <Descriptions>{items}</Descriptions>
        <div style={{ marginBottom: 16 }}>
          <Table dataSource={this.props.data.choices} columns={columns} />;
        </div>
      </div>
    );
  }
}
