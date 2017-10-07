'use strict';

import React          from 'react';
import BookItem       from './bookItem.jsx';
import {connect}      from 'react-redux';
import * as ApplicationActions  from '../../actions/application';
import { localizeStrings }      from '../../selectors/locale';

const select = (state) => {
  return {
    tableOfContents: state.content.tableOfContents,
    title: state.content.title,
    tocMeta: state.content.tocMeta,
    sidebarOpen: state.application.sidebarOpen,
    localizedStrings: localizeStrings(state)
  };
};

export class Sidebar extends React.Component{

  tableOfContents(props){
    if(!props.tableOfContents){return;}
    return _.map(props.tableOfContents, (item)=>{
      return (
        <BookItem
          key={`bookItem_${item.id}`}
          content={item}
          selected={this.props.pageId == item.id}
          sidebarOpen={this.props.sidebarOpen}
          selectPage={this.props.selectPage}
          focusPage={this.props.focusPage}
        />
      );
    });
  }

  render(){
    const tableOfContents = this.tableOfContents(this.props);
    let btnToggleClass = 'c-sidebar__toggle-button';
    let svgSpinClass = 'c-sidebar__svg';
    let sidebarClass = 'c-sidebar domhidden';
    let btnAriaPressed = 'false';
    let btnAriaExpanded = 'false';

    if(this.props.sidebarOpen){
      btnToggleClass = 'c-sidebar__toggle-button c-sidebar__toggle-button--open';
      svgSpinClass = 'c-sidebar__svg c-sidebar__svg--spin';
      sidebarClass = 'c-sidebar c-sidebar--open';
      btnAriaPressed = 'true';
      btnAriaExpanded = 'true';
    }

    return (
      <nav aria-labelledby='activityToggle'>
        <button
          id='activityToggle'
          onClick={() => {this.props.toggleSidebar();}}
          className={btnToggleClass}
          aria-pressed={btnAriaPressed}
          aria-expanded={btnAriaExpanded}
          aria-haspopup
          aria-controls='activityList'
        >
          <span>{this.props.localizedStrings.sidebar.activityList}</span>
          <svg className={svgSpinClass} aria-hidden version='1.1' width='9.9' height='16' viewBox='0 0 9.9 16'
            enableBackground='new 0 0 9.9 16' xmlSpace='preserve'>
            <g transform='translate(-218.000000, -90.000000)'>
              <g id='chevron-right' transform='translate(218.500000, 90.000000)'>
                <polygon id='Shape' fill='#FFFFFF' points='0,10.6 1.4,12 7.4,6 1.4,0 0,1.4 4.6,6' />
              </g>
            </g>
          </svg>

        </button>
        <div id='activityList' className={sidebarClass}>
          <div className='unit'>{this.props.tocMeta.gradeUnit}</div>
          <div className='subject'>{this.props.tocMeta.subjectLesson}</div>
          <ul>
            {tableOfContents}
          </ul>
        </div>
      </nav>
    );
  }
}
export default connect(select, ApplicationActions)(Sidebar);
