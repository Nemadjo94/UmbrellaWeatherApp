/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable linebreak-style */
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

export default class TimeLastUpdated extends React.Component {

  // Validate props passed from Content
  static propTypes = {
      time: PropTypes.number.isRequired,
  };

  // When the component mounts trigger the update every 10 seconds
  componentDidMount() {
    this.interval = setInterval(() => {
      this.forceUpdate();
    }, 10000);
  }

  // Before the component is destroyed we need to unset the timer
  // made in componentDidMount
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <Text style={styles.updateTime} >
          Last update: {moment(this.props.time, 'X').fromNow()}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  updateTime: {
    color: '#fff',
    fontSize: 14,
  },
});
