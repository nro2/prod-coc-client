import React from 'react';

export default class CommitteeHeader extends React.Component {
  constructor(props) {
    super(props);
    this.getHeader = this.getHeader.bind(this);
  }

  getHeader = function() {
    return (
      <header>
        <h3>{this.props.data['name']}</h3>
        <p>{this.props.data['description']}</p>
      </header>
    );
  };

  render() {
    return <h3>{this.getHeader()}</h3>;
  }
}
