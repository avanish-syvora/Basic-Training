import _ from 'lodash';

export function isValidNumber(value) {
  return _.isNumber(value) && !_.isNaN(value);
}

export function areValidOperands(a, b) {
  return isValidNumber(a) && isValidNumber(b);
}
