'use strict';

import React from 'react';

export default (props) => {

  const openPage = (e) => {
    e.preventDefault();
    props.selectPage(`/${props.content.id}`, props.content.navLabel);
  };

  let bookItemClass = 'c-book-item';
  let ariaCurr;
  if (props.sidebarOpen && props.selected) {
    bookItemClass = 'c-book-item c-book-item--selected';
    ariaCurr = 'page';
  }

  return <li className={bookItemClass} >
    <a href='#' aria-current={ariaCurr} onClick={(e) => openPage(e)}>
      {props.content.navLabel}
    </a>
  </li>;
};
