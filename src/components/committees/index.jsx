import React, { Component } from 'react';
import axios from 'axios';
import { Empty, Result, Select } from 'antd';
import './committees.css';

const { Option } = Select;

class Committees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      committees: [],
      error: {},
      loading: true,
    };

    this.fetchCommittees = this.fetchCommittees.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  fetchCommittees() {
    axios
      .get('/api/committees')
      .then(response => {
        this.setState({
          committees: response.data,
          loading: false,
          selected: 0,
          error: {},
        });
      })
      .catch(err => {
        this.setState({
          error: { message: err.response.data.error, code: err.response.status },
          loading: false,
        });
      });
  }

  handleChange(value) {
    this.setState({
      selected: value,
    });
  }

  componentDidMount() {
    this.fetchCommittees();
  }

  renderBody = () => {
    if (this.state.selected === 0) {
      return (
        <div className="aligner-item">
          <Empty />
        </div>
      );
    }

    if (Object.keys(this.state.error).length !== 0) {
      return (
        <div className="aligner-item">
          <Result
            status="500"
            title={this.state.error.code}
            subTitle={this.state.error.message}
          />
        </div>
      );
    }

    return (
      <div>
        {JSON.stringify(
          this.state.committees.find(
            committee => committee.committee_id === this.state.selected
          )
        )}
      </div>
    );
  };

  render() {
    const options = this.state.committees.map(committee => (
      <Option key={committee.committee_id} value={committee.committee_id}>
        {committee.name}
      </Option>
    ));

    return (
      <div className="aligner">
        <div>
          <Select
            className="aligner-item aligner-item--top-left select"
            showSearch
            placeholder="Select a committee"
            optionFilterProp="children"
            onChange={this.handleChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            dropdownMatchSelectWidth={false}
            size="large"
            loading={this.state.loading}
          >
            {options}
          </Select>
        </div>
        {this.renderBody()}
      </div>
    );
  }
}

export default Committees;
