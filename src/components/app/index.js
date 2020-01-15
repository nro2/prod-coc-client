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
import Committees from '../committees';
import GetFaculty from '../get-faculty';
import Home from '../home';

const { Header, Content, Footer, Sider } = Layout;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
    };
  }

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    return (
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
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
                <Icon type="user" />
                <span>Get Faculty</span>
                <Link to="/get-faculty" />
              </Menu.Item>
              <Menu.Item key="4">
                <Icon type="appstore" />
                <span>Committees</span>
                <Link to="/committees" />
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0, paddingLeft: 16 }} />
            <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                background: '#fff',
                minHeight: 280,
              }}
            >
              <Switch>
                <Route path="/home" component={Home} />
                <Route path="/add-faculty" component={AddFaculty} />
                <Route path="/get-faculty" component={GetFaculty} />
                <Route path="/committees" component={Committees} />
              </Switch>
              <Redirect to="/home" />
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Ant Design ©2016 Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default App;
