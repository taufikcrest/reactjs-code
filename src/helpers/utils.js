import React from 'react';
import Responsive from 'react-responsive';
import moment from 'moment';
import _ from 'lodash';

export const getGreeting = (hours) => {
  let time = hours || moment().hours();
  let greeting = '';

  switch (time) {
    case time < 10:
      greeting = 'Good morning';
      break;
    case time < 20:
      greeting = 'Good day';
      break;
    default:
      greeting = 'Good evening';
  }

  return greeting;
};

export const requireAll = (requireContext) => requireContext.keys().map(requireContext);

export const requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function (f) { return setTimeout(f, 1000 / 60) } // simulate calling code 60 

export const cancelAnimationFrame = window.cancelAnimationFrame
  || window.mozCancelAnimationFrame
  || function (requestID) { clearTimeout(requestID) } //fall back

export const Desktop = props => <Responsive {...props} minWidth={1200} />;
export const Tablet = props => <Responsive {...props} minWidth={768} maxWidth={1199} />;
export const Mobile = props => <Responsive {...props} maxWidth={767} />;
export const Default = props => <Responsive {...props} minWidth={768} />;

export default {
  getGreeting,
  requireAll,
};
