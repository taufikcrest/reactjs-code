import { combineReducers } from 'redux';
import { reducer as notifications } from 'reapop';

import { requireAll } from '../helpers/utils';

const objModules = {};
// default value for notifications
const defaultNotification = {
  status: 'default',
  position: 'tr',
  dismissAfter: 3000,
  allowHTML: true
};

// require all files in the current directory, except index.js
requireAll(require.context('.', true, /^((?!index).)*\.js$/)).forEach(module => Object.assign(objModules, module.default));

// registering reducer for handling the `Reapop ( React-Notification-System )` 's action calls.
export default combineReducers({ ...objModules, ...{ notifications: notifications(defaultNotification) } });