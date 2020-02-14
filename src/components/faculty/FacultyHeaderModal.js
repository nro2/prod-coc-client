import React from 'react';
import { Button } from 'antd';
import WrappedEditFacultyForm from './WrappedEditFacultyForm';

class FacultyHeaderModal extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  /**
   * Function that is triggered when the "Ok" button is clicked.
   *
   * Calls the `onCreate` function from the parent component will update the faculty
   * object and re-render the view
   *
   * @param faculty Faculty to be passed by the callback
   */
  handleOk = faculty => {
    const { form } = this.formRef.props;

    form.validateFields(err => {
      if (err) {
        return;
      }

      this.setState({
        faculty,
        visible: false,
      });
      this.props.onCreate(faculty);
    });
  };

  handleCancel = () => {
    this.setState({ visible: false, selected: '' });
    const { form } = this.formRef.props;
    form.resetFields();
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Edit
        </Button>
        <WrappedEditFacultyForm
          title="Edit Faculty"
          visible={this.state.visible}
          faculty={this.props.faculty}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          wrappedComponentRef={this.saveFormRef}
          senateDivisions={this.props.senateDivisions}
          departments={this.props.departments}
        />
      </div>
    );
  }
}

export default FacultyHeaderModal;
