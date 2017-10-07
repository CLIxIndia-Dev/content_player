'use strict';

import {Constants as ApplicationConstants} from '../actions/application';

const initialState =  {
  sidebarOpen: true,
  currentPage: null,
  pageFocus: null
};

export default (state = initialState, action) => {

  switch(action.type){
    case ApplicationConstants.TOGGLE_SIDEBAR:
      var toggled = Object.assign({}, state);
      toggled.sidebarOpen = !toggled.sidebarOpen;
      return toggled;

    case ApplicationConstants.SELECT_PAGE:
      var selectedPage = Object.assign({}, state);
      selectedPage.currentPage = action.pageId;
      selectedPage.currentPageName = action.pageName;
      return selectedPage;

    case ApplicationConstants.FOCUS_PAGE:
      var focusedPage = Object.assign({}, state);
      focusedPage.pageFocus = true;
      return focusedPage;

    default:
      return state;
  }
};
