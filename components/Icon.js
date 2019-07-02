/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable prefer-template */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-global-assign */
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
import { iconHandler } from './util';

Icon.defaultProps = { // set the default image size
    size: 'small',
};

Icon.propTypes = { // these props are passed from Content.js
  size: PropTypes.oneOf(['small', 'large']),
  icon: PropTypes.string,
};

const sizes = { // declare constant image sizes
    large: {
        width: 100,
        height: 100,
        marginBottom: 20,
        alignSelf: 'center',
    },
    small: {
        width: 50,
        height: 50,
    }
};

export default function Icon(props) {
  const style = sizes[props.size];
  return (
    <Image
        source={iconHandler(props.icon)}
        style={style}
    />);
}
