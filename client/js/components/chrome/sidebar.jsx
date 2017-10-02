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
          selectPage={this.props.selectPage}/>
      );
    });
  }

  render(){
    let sidebarClass = this.props.sidebarOpen
    ? 'c-sidebar c-sidebar--open'
    : 'c-sidebar';

    let buttonToggleClass = this.props.sidebarOpen
    ? 'c-sidebar__toggle-button c-sidebar__toggle-button--open'
    : 'c-sidebar__toggle-button';

    let svgSpinClass = this.props.sidebarOpen
    ? 'c-sidebar__svg c-sidebar__svg--spin'
    : 'c-sidebar__svg';

    if(this.props.sidebarOpen){
      var tableOfContents = this.tableOfContents(this.props);
    }

    return (
      <aside tabIndex='-1' role='complementary' aria-label=''>
        <button
            onClick={() => {this.props.toggleSidebar();}}
            className={buttonToggleClass}>
            {this.props.localizedStrings.sidebar.activityList}
            <svg className={svgSpinClass} version='1.1' width='9.9' height='16' viewBox='0 0 9.9 16'
              enableBackground='new 0 0 9.9 16' xmlSpace='preserve'>
              <g transform='translate(-218.000000, -90.000000)'>
                <g id='chevron-right' transform='translate(218.500000, 90.000000)'>
                  <polygon id='Shape' fill='#FFFFFF' points='0,10.6 1.4,12 7.4,6 1.4,0 0,1.4 4.6,6' />
                </g>
              </g>
            </svg>

        </button>
        <div className={sidebarClass}>
          <div className='unit'>{this.props.tocMeta.gradeUnit}</div>
          <div className='subject'>{this.props.tocMeta.subjectLesson}</div>
          <nav className='c-sidebar__button-list' aria-label='Activity'>
          {tableOfContents}
          </nav>
        </div>
      </aside>
    );
  }
}

export default connect(select, ApplicationActions)(Sidebar);
