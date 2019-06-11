/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-equals-spacing */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable indent */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-typos */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

// Set the default image size
Icon.defaultProps = {
  size: 'small',
};

// These props are passed from Content.js
Icon.propTypes = {
  size: PropTypes.oneOf(['small', 'large']),
  icon: PropTypes.string,
};

// Declare constant image sizes
const sizes = {
    large: {
        width: 150,
        height: 150,
        marginTop: -20,
    },
    small: {
        width: 50,
        height: 50,
    }
};

function Icon(props) {
  const style = sizes[props.size];
  return (
    <Image
      source=
      {{
        uri: `http://openweathermap.org/img/w/${props.icon}.png`
      }}
        style={style}
    />);
}

export default Icon;
