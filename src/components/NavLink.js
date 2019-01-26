import React from 'react';
import { Link } from 'react-router-dom';

const NavLink = props => (
  <Link style={styles.navlink} to={props.to}>{props.text}</Link>
);

const styles = {
  navlink: {
    padding: 20,
    backgroundColor: "green",
    display: "inline-block",
  },
};

export default NavLink;
