import React, { Component } from 'react';

class Home extends Component {
  render() {
    return (
      <div style={styles.body}>
        <p>Hello</p>
      </div>
    );
  }
}

const styles = {
  body: {
    backgroundColor: "green",
  },
}

export default Home;
