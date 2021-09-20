import { combineReducers } from "redux";
import actionTypes from "actions";
import moment from "moment";

// handle search for screen.
const search = (state = "", action) => {
  switch (action.type) {
    case actionTypes.UPDATE_SITE_SEARCH:
      return action.search;
    default:
      return state;
  }
}

// handle view ["Standard" || "List"].
const view = (state = "Standard View", action) => {
  switch (action.type) {
    case actionTypes.UPDATE_SITE_VIEW:
      return action.view;
    default:
      return state;
  }
}

// default State object for date.
const dateObj = {
  date: moment().startOf("day"),
  range: { from: moment().startOf("week").startOf("day"), to: moment().endOf("week").endOf("day") }
};

// handle date change.
const date = (state = dateObj, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_SITE_DATE:
      return action.date;
    default:
      return state;
  }
}

// handle tags change.
const selectedTags = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_SITE_TAGS:
      const { id, tags } = action.payload;

      return { ...state, [id]: tags };
    default:
      return state;
  }
}

const filters = combineReducers({
  search,
  view,
  date,
  selectedTags
});

// final reducer object export.
export default {
  site: combineReducers({
    filters
  })
};