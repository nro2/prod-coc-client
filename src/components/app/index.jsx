import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import './app.css';
import AddFaculty from '../add-faculty';
import AddCommittee from '../add-committee';
import Committee from '../committee';
import Faculty from '../faculty';
import Home from '../home';
import Reports from '../get-reports';
import LinkMenu from './Menu.jsx';

const { Header, Content, Footer, Sider } = Layout;

console.debug = function() {
  if (!console.debugging) return;
  console.log.apply(this, arguments);
};
console.debugging = process.env.NODE_ENV !== 'production';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
    };
  }

  handleCollapse = collapsed => {
    console.log('Action', { collapsed });
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
            <LinkMenu location={this.location} />
          </Sider>
          <Layout>
            <Header className="header" />
            <Content className="aligner content">
              <Switch>
                <Route path="/home" component={Home} />
                <Route path="/add-faculty" component={AddFaculty} />
                <Route path="/add-committee" component={AddCommittee} />
                <Route path="/committee" component={Committee} />
                <Route path="/faculty" component={Faculty} />
                <Route path="/reports" component={Reports} />
              </Switch>
            </Content>
            <Footer className="footer">Ant Design ©2016 Created by Ant UED</Footer>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default App;
