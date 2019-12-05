import React, { Component } from 'react';
import axios from 'axios';
import '../../stylesheets/Committees.css';
class CommitteeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      committees: [],
      text: '',
    };

    this.getCommittees = this.getCommittees.bind(this);
    this.createCommittee = this.createCommittee.bind(this);
  }

  getCommittees() {
    axios
      .get('http://127.0.0.1:8080/committees')
      .then(response => {
        console.log(response.data);
        let committeeArray = response.data;
        this.setState({
          committees: committeeArray,
        });
      })
      .catch(err => {
        this.setState({
          text: 'Could not retrieve committees',
        });
        console.log(err);
      });
  }

  createCommittee(item) {
    return <li key={item.key}>{item.committee}</li>;
  }

  componentDidMount() {
    this.getCommittees();
  }

  render() {
    let items = this.state.committees;
    let listItems = items.map(this.createCommittee);
    return (
      <div className="Committees">
        <h1>List of Committees</h1>
        <p>{this.state.text}</p>
        {listItems}
      </div>
    );
  }
}

export default CommitteeComponent;
