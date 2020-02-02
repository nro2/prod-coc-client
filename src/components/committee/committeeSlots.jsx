import React from 'react';
import { Divider } from 'antd';

//const pageSize = 5; // Page size to show pagination
/*const slotColumns = [
  {
    title: 'To Be Filled',
    dataIndex: 'slotsRemaining',
    key: 'slotsRemaining',
  },
  {
    title: 'Total',
    dataIndex: 'totalSlots',
    key: 'totalSlots',
  },
];
*/
export default class CommitteeSlots extends React.Component {
  constructor(props) {
    super(props);
    this.slots = [
      {
        key: this.props.data['id'],
        filledSlots: this.props.data['filledSlots'],
        totalSlots: this.props.data['totalSlots'],
      },
    ];
  }

  render() {
    //console.log(this.slots);
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
