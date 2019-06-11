/* eslint-disable spaced-comment */
/* eslint-disable linebreak-style */
/* eslint-disable import/prefer-default-export */
import React from 'react';

//Convert weeks number into string
// 0 Sun - 6 Sat
export function dayOfTheWeek(number) {
  if (number === 1) {
    return 'MONDAY';
  }
  if (number === 2) {
    return 'TUESDAY';
  }
  if (number === 3) {
    return 'WEDNESDAY';
  }
  if (number === 4) {
    return 'THURSDAY';
  }
  if (number === 5) {
    return 'FRIDAY';
  }
  if (number === 6) {
    return 'SATURDAY';
  }
  if (number === 0 || number === 7) {
    return 'SUNDAY';
  }
  return '';
}
