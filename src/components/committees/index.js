import React, { Component } from 'react';
import axios from 'axios';
import { Empty, Select } from 'antd';
import './committees.css';

const { Option } = Select;

class Committees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      committees: [],
      errorMessage: '',
      errorCode: '',
      loading: true,
    };

    this.fetchCommittees = this.fetchCommittees.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  fetchCommittees() {
    axios
      .get('http://localhost:8080/committees')
      .then(response => {
        this.setState({
          committees: response.data,
          loading: false,
          selected: 0,
        });
      })
      .catch(err => {
        this.setState({
          errorMessage: err,
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

  render() {
    const options = this.state.committees.map(committee => (
      <Option key={committee.committee_id} value={committee.committee_id}>
        {committee.name}
      </Option>
    ));

    return (
      <div>
        <div>
          <Select
            showSearch
            style={{ width: 300 }}
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
        <div>
          {this.state.selected === 0 ? (
            <Empty />
          ) : (
            // TODO: display this committee data in a nicer way
            JSON.stringify(
              this.state.committees.find(
                committee => committee.committee_id === this.state.selected
              )
            )
          )}
        </div>
      </div>
    );
  }
}

export default Committees;
