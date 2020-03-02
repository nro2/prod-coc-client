import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Icon } from 'antd';

const Linkmenu = withRouter(props => {
  const { location } = props;
  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      defaultSelectedKeys={['/home']}
    >
      <Menu.Item key="/home">
        <Icon type="home" />
        <span>Home</span>
        <Link to="/home" />
      </Menu.Item>
      <Menu.Item key="/add-faculty">
        <Icon type="user-add" />
        <span>Add Faculty</span>
        <Link to="/add-faculty" />
      </Menu.Item>
      <Menu.Item key="/add-committee">
        <Icon type="usergroup-add" />
        <span>Add Committee</span>
        <Link to="/add-committee" />
      </Menu.Item>
      <Menu.Item key="/faculty">
        <Icon type="user" />
        <span>Faculty Info</span>
        <Link to="/faculty" />
      </Menu.Item>
      <Menu.Item key="/committee">
        <Icon type="team" />
        <span>Committee Info</span>
        <Link to="/committee" />
      </Menu.Item>
      <Menu.Item key="/reports">
        <Icon type="appstore" />
        <span>Reports</span>
        <Link to="/reports" />
      </Menu.Item>
    </Menu>
  );
});

export default Linkmenu;
