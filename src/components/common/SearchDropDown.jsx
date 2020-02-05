import React from 'react';
import { Select, Divider } from 'antd';

const { Option } = Select;

class SearchDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataMembers: [],
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({
      selected: value,
      showInfo: true,
    });
  }

  render() {
    return (
      <div>
        <h1>Get faculty info here</h1>
        <div>
          <Select
            showSearch
            placeholder="Search for a faculty member"
            optionFilterProp="children"
            onChange={this.handleChange}
            dropdownMatchSelectWidth={false}
            size="large"
            loading={this.state.loading}
          >
            <Option key="1">1</Option>
          </Select>
          {this.state.showInfo && (
            <div>
              <Divider orientation="left">
                {this.state.selected + "'s Info"}
              </Divider>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SearchDropDown;
