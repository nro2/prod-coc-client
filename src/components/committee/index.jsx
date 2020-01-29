import React from 'react';
import CommitteeHeader from './committeeHeader.jsx';
import CommitteeSlots from './committeeSlots.jsx';
import RequirementsTable from './requirementsTable.jsx';
import MembersTable from './membersTable.jsx';

// Axios used to pull data from endpoint
//import axios from 'axios';

const committees = [
  {
    id: 1,
    name: 'Committee on Space Exploration',
    description: 'About exploring space',
    totalSlots: '10',
    filledSlots: '5',
    committeeSlots: [
      {
        key: '1',
        senateShortname: 'BP',
        slotRequirements: 3,
      },
      {
        key: '2',
        senateShortname: 'AO',
        slotRequirements: 7,
      },
    ],
    memberData: [
      {
        key: '1',
        facultyName: 'Boaty McBoatface',
        email: 'boat@gmail.com',
        start_date: '2019-1-1',
        end_date: '2020-1-1',
        senateDivision: 'BP',
      },
      {
        key: '2',
        facultyName: 'Grace Hopper',
        email: 'ghopper@gmail.com',
        start_date: '2019-1-1',
        end_date: '2020-1-1',
        senateDivision: 'AO',
      },
      {
        key: '3',
        facultyName: 'Boaty McBoatface',
        email: 'boat@gmail.com',
        start_date: '2019-1-1',
        end_date: '2020-1-1',
        senateDivision: 'BP',
      },
      {
        key: '4',
        facultyName: 'Grace Hopper',
        email: 'ghopper@gmail.com',
        start_date: '2019-1-1',
        end_date: '2020-1-1',
        senateDivision: 'AO',
      },
    ],
  },
];
// Start App
export default class App extends React.Component {
  constructor(props) {
    super(props); //since we are extending class Table so we have to use super in order to override Component class constructor
    this.state = {
      committees,
    };
  }

  render() {
    return (
      <div className="committeTable">
        {this.state.committees.map((value, index) => {
          return (
            <div key={value + index} className="table-wrapper">
              <React.Fragment>
                <CommitteeHeader data={this.state.committees[index]} />
                <CommitteeSlots data={this.state.committees[index]} />
                <RequirementsTable data={this.state.committees[index]} />
                <MembersTable data={this.state.committees[index]} />
              </React.Fragment>
            </div>
          );
        })}
      </div>
    );
  }
}
