"use strict";

import _                              from "lodash";

import { Constants as ContentConstants } from "../actions/content";

const initialState = {
  tocMeta: {},
  printAction: () => {}
};

export default (state = initialState, action) => {
  var nextState = _.merge({}, {...state});
  switch (action.type) {
    case ContentConstants.LOAD_CONTENT_DONE:
      nextState.tableOfContents = action.tableOfContents;
      nextState.title = action.tocDoc.docTitle;
      nextState.contentPath = action.contentPath;
      nextState.tocMeta = action.tocMeta;
      nextState.bibliography = action.bibliography;
      return nextState;

    case ContentConstants.SET_PRINT_ACTION:
      nextState.printAction = action.printFunc;
      return nextState;

    default:
      return state;
  }
};
