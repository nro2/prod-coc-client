import React, { Component } from 'react';

export default class CommitteeHeader extends Component {
  constructor(props) {
    super(props);
    this.getHeader = this.getHeader.bind(this);
  }

  getHeader = function() {
    return (
      <header>
        <h2>{this.props.data['name']}</h2>
        <p>{this.props.data['description']}</p>
      </header>
    );
  };

  render() {
    return <h3>{this.getHeader()}</h3>;
  }
}
