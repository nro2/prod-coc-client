import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import './app.css';
import AddFaculty from '../add-faculty';
import AddCommittee from '../add-committee';
import Committees from '../committees';
import GetFaculty from '../get-faculty';
import Committee from '../committee';
import Faculty from '../faculty';
import Home from '../home';
import Reports from '../get-reports';

const { Header, Content, Footer, Sider } = Layout;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
    };
  }

  handleCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    return (
      <Router>
        <Layout className="layout">
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.handleCollapse}
          >
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1">
                <Icon type="home" />
                <span>Home</span>
                <Link to="/home" />
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="usergroup-add" />
                <span>Add Faculty</span>
                <Link to="/add-faculty" />
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="usergroup-add" />
                <span>Add Committee</span>
                <Link to="/add-committee" />
              </Menu.Item>
              <Menu.Item key="4">
                <Icon type="user" />
                <span>Get Faculty</span>
                <Link to="/get-faculty" />
              </Menu.Item>
              <Menu.Item key="5">
                <Icon type="appstore" />
                <span>Committees</span>
                <Link to="/committees" />
              </Menu.Item>
              <Menu.Item key="6">
                <Icon type="user" />
                <span>Faculty Info</span>
                <Link to="/faculty" />
              </Menu.Item>
              <Menu.Item key="7">
                <Icon type="user" />
                <span>Committee Info</span>
                <Link to="/committee" />
              </Menu.Item>
              <Menu.Item key="8">
                <Icon type="appstore" />
                <span>Reports</span>
                <Link to="/reports" />
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header className="header" />
            <Content className="aligner content">
              <Switch>
                <Route path="/home" component={Home} />
                <Route path="/add-faculty" component={AddFaculty} />
                <Route path="/add-committee" component={AddCommittee} />
                <Route path="/get-faculty" component={GetFaculty} />
                <Route path="/committees" component={Committees} />
                <Route path="/committee" component={Committee} />
                <Route path="/faculty" component={Faculty} />
                <Route path="/reports" component={Reports} />
              </Switch>
              <Redirect to="/home" />
            </Content>
            <Footer className="footer">Ant Design ©2016 Created by Ant UED</Footer>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default App;
