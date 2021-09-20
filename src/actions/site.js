// action for updating search.

export const UPDATE_SITE_SEARCH = "UPDATE_SITE_SEARCH";

export const updateSearch = (search) => {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_SITE_SEARCH,
      search
    })
  }
}

// action for updating the date.

export const UPDATE_SITE_DATE = "UPDATE_SITE_DATE";

export const updateDate = (date) => {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_SITE_DATE,
      date
    })
  }
}

// action for updating view.

export const UPDATE_SITE_VIEW = "UPDATE_SITE_VIEW";

export const updateView = (view) => {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_SITE_VIEW,
      view
    })
  }
}

// action for updating tags.

export const UPDATE_SITE_TAGS = "UPDATE_SITE_TAGS";

export const updateTags = (id, tags) => {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_SITE_TAGS,
      payload: {
        id,
        tags
      }
    })
  }
}