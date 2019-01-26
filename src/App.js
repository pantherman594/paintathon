import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import NavLink from './components/NavLink';

import Home from './pages/Home';
import Vote from './pages/Vote';

class App extends Component {
  render() {
    return (
      <Router>
        <div style={styles.body}>
          <div style={styles.nav}>
            <span style={styles.navLeft}>
              <NavLink to='/' text='Home' />
            </span>
            <span style={styles.navRight}>
              <NavLink to='/vote' text='Vote' />
            </span>
          </div>

          <Route path='/' exact component={Home} />
          <Route path='/vote' exact component={Vote} />
        </div>
      </Router>
    );
  }
}

const styles = {
  body: {
    backgroundColor: 'red',
    margin: 0,
    padding: 0,
  },
  nav: {
    padding: '10px 10%',
    backgroundColor: 'black',
  },
  navLeft: {},
  navRight: {
    float: "right",
  },
};

export default App;
