import React, { Component } from 'react';

class Vote extends Component {
  render() {
    return (
      <div style={styles.body}>
        <p>Vote</p>
      </div>
    );
  }
}

const styles = {
  body: {
    backgroundColor: "yellow",
  },
}

export default Vote;
