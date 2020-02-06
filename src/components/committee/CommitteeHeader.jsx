import React, { Component } from 'react';

export default class CommitteeHeader extends Component {
  constructor(props) {
    super(props);
    this.getHeader = this.getHeader.bind(this);
  }

  getHeader = function() {
    let newText = this.props.data['description'].split('\n').map((item, i) => {
      return <li key={i}>{item}</li>;
    });

    return (
      <header>
        <h2>{this.props.data['name']}</h2>
        Committee Responsibilities:
        <ol>{newText}</ol>
      </header>
    );
  };

  render() {
    return <h3>{this.getHeader()}</h3>;
  }
}
