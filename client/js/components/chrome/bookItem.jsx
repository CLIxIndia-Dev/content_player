'use strict';

import React from 'react';

export default (props) => {

  const openPage = (e) => {
    e.preventDefault();
    props.selectPage(`/${props.content.id}`, props.content.navLabel);
  };

  var bookItemClass = 'c-book-item';
  if (props.sidebarOpen && props.selected) {
    bookItemClass = 'c-book-item c-book-item--selected';
  }

  return <li className={bookItemClass} >
    <a href='#' onClick={(e) => openPage(e)}>
      {props.content.navLabel}
    </a>
  </li>;

  // return <button className={bookItemClass} onClick={() => openPage()}><span>
  //   {props.content.navLabel}</span>
  // </button>;
};
