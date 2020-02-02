import React from 'react';
import { Divider } from 'antd';

export default class CommitteeSlots extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Divider type="horizontal" orientation="left">
          Slots
        </Divider>
        <h4>To Be Filled / Total Slots</h4>
        <h4>
          {this.props.data['slotsRemaining']} / {this.props.data['totalSlots']}
        </h4>
      </div>
    );
  }
}
