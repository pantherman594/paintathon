import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Home from './pages/Home'
import Vote from './pages/Vote'

class App extends Component {
  render() {
    return (
      <Router>
        <div style={styles.body}>
          <nav>
            <ul style={styles.nav}>
              <li>
                <Link to="/">Home</Link>
                <Link to="/vote">Vote</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={Home} />
          <Route path="/vote" exact component={Vote} />
        </div>
      </Router>
    );
  }
}

const styles = {
  body: {
    backgroundColor: "red",
    margin: 0,
    padding: 0,
  },
  nav: {
    margin: 0,
  },
}

export default App;
