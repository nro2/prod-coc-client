import React from 'react';
import { Modal, Button, Select, Descriptions } from 'antd';
import axios from 'axios';
import SearchDropDown from '../common/SearchDropDown.jsx';
import AddMemberForm from './AddMemberForm.jsx';

const { Option } = Select;

class ModalSearchForm extends React.Component {
  state = {
    ModalText: 'Content of the modal',
    visible: false,
    confirmLoading: false,
    dataMembers: [],
    selected: '',
  };

  fetchData() {
    axios
      .get(this.props.endpoint)
      .then(response => {
        this.setState({
          dataMembers: response.data,
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

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.fetchData();
  };

  handleOk = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
      selected: '',
    });
  };

  changeHandler = value => {
    this.setState({
      selected: value,
    });
  };

  render() {
    let showForm = false;
    if (this.state.selected !== '') showForm = true;

    const options = this.state.dataMembers.map(faculty => (
      <Option key={faculty.email}>{faculty.full_name}</Option>
    ));

    const faculty = this.state.dataMembers.find(
      faculty => faculty.email === this.state.selected
    );

    let items = [];

    if (faculty !== undefined) {
      Object.entries(faculty).forEach(([key, value]) =>
        items.push(<Descriptions.Item label={key}>{value}</Descriptions.Item>)
      );
    }

    const { visible, confirmLoading } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          {this.props.buttonName}
        </Button>
        <Modal
          title={this.props.title || 'Title'}
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          destroyOnClose
        >
          <div>
            <SearchDropDown
              dataMembers={options}
              onChange={this.changeHandler}
              placeholder="Select Faculty"
            />
          </div>
          <div>
            <AddMemberForm
              layout="vertical"
              visible={showForm}
              dataMembers={items}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default ModalSearchForm;
