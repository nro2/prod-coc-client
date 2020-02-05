import React from 'react';
import { Select, Divider } from 'antd';

class SearchDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataMembers: [],
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      selected: event,
      showInfo: true,
    });

    this.props.onChange(event);
  }

  render() {
    return (
      <div>
        <div>
          <Select
            showSearch
            className="aligner-item aligner-item-center select"
            placeholder={this.props.placeholder || 'Enter text here'}
            optionFilterProp="children"
            onChange={this.handleChange}
            dropdownMatchSelectWidth={false}
            size="large"
            loading={this.state.loading}
          >
            {this.props.dataMembers}
          </Select>
          {this.state.showInfo && (
            <div>
              <Divider orientation="left">
                {this.state.selected + "'s Info" || ' '}
              </Divider>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SearchDropDown;
