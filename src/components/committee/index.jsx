import React from 'react';
import CommitteeHeader from './committeeHeader.jsx';
import CommitteeSlots from './committeeSlots.jsx';
import RequirementsTable from './requirementsTable.jsx';
import MembersTable from './membersTable.jsx';
import axios from 'axios';

// Axios used to pull data from endpoint
//import axios from 'axios';

const committees = [
  {
    id: 1,
    name: 'Committee on Space Exploration',
    description: 'About exploring space',
    totalSlots: '10',
    slotsRemaining: '5',
    committeeSlots: [
      {
        key: '1',
        senateShortname: 'BP',
        slotFilled: 3,
        slotMinimum: 1,
        slotsRemaining: 3,
      },
      {
        key: '2',
        senateShortname: 'AO',
        slotFilled: 3,
        slotMinimum: 1,
        slotsRemaining: 3,
      },
    ],
    committeeAssignment: [
      {
        key: '1',
        facultyName: 'Boaty McBoatface',
        facultyEmail: 'boat@gmail.com',
        startDate: '2019-1-1',
        endDate: '2020-1-1',
        senateDivision: 'BP',
      },
      {
        key: '2',
        facultyName: 'Grace Hopper',
        facultyEmail: 'ghopper@gmail.com',
        startDate: '2019-1-1',
        endDate: '2020-1-1',
        senateDivision: 'AO',
      },
      {
        key: '3',
        facultyName: 'Boaty McBoatface',
        facultyEmail: 'boat@gmail.com',
        startDate: '2019-1-1',
        endDate: '2020-1-1',
        senateDivision: 'BP',
      },
      {
        key: '4',
        facultyName: 'Grace Hopper',
        facultyEmail: 'ghopper@gmail.com',
        startDate: '2019-1-1',
        endDate: '2020-1-1',
        senateDivision: 'AO',
      },
    ],
  },
];
// Start App
export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      committees,
    };
  }
  componentDidMount() {
    if (this.props.id) {
      this.getCommittee(this.props.id);
    } else {
      console.log('I am inside the else on componentDidMount');
      this.getCommittee(1);
    }
  }
  getCommittee = async id => {
    console.log('I am inside getCommittee');
    axios.get(`/api/committee/${id}`).then(response => {
      console.log('I am inside the axios call');
      console.log(response.data);
      this.setState({
        committees: response.data,
      });
    });
  };
  render() {
    return (
      <div className="committeeTable">
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
