import React, { Component } from 'react';
import { PageHeader, Typography, Row, Statistic } from 'antd';

const { Paragraph } = Typography;

const Content = ({ children, extraContent }) => {
  return (
    <Row type="flex">
      <div style={{ flex: 3 }}>{children}</div>
      <div
        style={{
          marginLeft: 50,
          marginRight: 50,
        }}
      >
        {extraContent}
      </div>
    </Row>
  );
};

export default class CommitteeHeader extends Component {
  constructor(props) {
    super(props);
    this.getHeader = this.getHeader.bind(this);
  }

  getHeader = function() {
    let modifiedDescription = this.props.data['description']
      .split('\n')
      .map((item, i) => {
        return <li key={i}>{item}</li>;
      });

    const content = (
      <div>
        <Paragraph>{modifiedDescription}</Paragraph>
      </div>
    );

    return (
      <PageHeader
        style={{ paddingLeft: 0, paddingRight: 0 }}
        title={this.props.data['name']}
      >
        <Content
          extraContent={
            <Statistic
              style={{ marginRight: 20 }}
              title="Available Slots"
              value={this.props.data['slotsRemaining']}
              suffix={`/ ${this.props.data['totalSlots']}`}
            />
          }
        >
          {content}
        </Content>
      </PageHeader>
    );
  };

  render() {
    return <div>{this.getHeader()}</div>;
  }
}
