import React, { Component } from 'react';
import axios from 'axios';
import { Descriptions } from 'antd';

class GetReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      committees: [],
      committeeInfo: [],
    };

    this.fetchCommittees = this.fetchCommittees.bind(this);
  }

  fetchCommittees() {
    axios
      .get('/api/committees')
      .then(response => {
        this.setState({
          committees: response.data,
          loading: false,
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

  fetchCommitteeInfo() {
    axios
      .get('/api/committeeInfo/committees')
      .then(response => {
        this.setState({
          committeeInfo: response.data,
          loading: false,
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

  componentDidMount() {
    this.fetchCommittees();
    this.fetchCommitteeInfo();
  }

  render() {
    const Name = this.state.committees.map(committee => {
      return <li key={`committee-${committee.committee_id}`}>{committee.name}</li>;
    });

    const cInfo = this.state.committeeInfo.map(committeeinfo => {
      return (
        <li key={`committee-${committeeinfo.committee_id}`}>
          {committeeinfo.committee_id}
        </li>
      );
    });

    axios.get(`/api/committeeInfo/${Name}`).then(response => {
      const Info = response.data;
      this.setState({ Info });
    });

    //const Info = this.state.committees.map(committeeinfo => {
    //  return axios.get(`api/committeeInfo/${committeeinfo.committee_id}`)
    // });

    return (
      <div>
        <h1>Get Reports Here</h1>
        <div>
          <Descriptions>
            <Descriptions.Item label="">{Name}</Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="Description">{}</Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="Total Slots">{}</Descriptions.Item>
          </Descriptions>

          {/*this.state.Info.map(infos => <li>{infos.Name}</li>)*/}
          {cInfo}
        </div>
      </div>
    );
  }
}
export default GetReports;
