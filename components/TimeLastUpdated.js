/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable linebreak-style */
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

export default class TimeLastUpdated extends React.Component {

  static propTypes = {  // validate props passed from Content
      time: PropTypes.number.isRequired,
  };

  componentDidMount() { // when the component mounts trigger the update every 10 seconds
    this.interval = setInterval(() => {
      this.forceUpdate();
    }, 10000);
  }

  // before the component is destroyed we need to unset the timer
  // made in componentDidMount
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <Text style={styles.updateTime} >
          updated {moment(this.props.time, 'X').fromNow()}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  updateTime: {
    fontFamily: 'sans-serif-light',
    color: '#fff',
    fontSize: 14,
    alignSelf: 'center',
  },
});
