"use strict";

import React                    from 'react';
import assets                   from '../libs/assets';
import Navbar                   from './chrome/navbar.jsx';
import TableOfContents          from './chrome/table_of_contents.jsx';
import BookOverview             from './book/book_overview';

class Home extends React.Component {

  getStyles(){
    return{
      body: {
        position: 'fixed',
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100%',
      },
      logo: {
        position: 'absolute',
        bottom: '20px',
        right: '20px'
      },
      content: {
        position: 'absolute',
        top: '72px',
        left: '250px',
        width: 'calc(100% - 250px)',
        height: 'calc(100% - 72px)',
      }
    }
  }

  render(){
    const img = assets("./images/atomicjolt.jpg");
    const styles = this.getStyles();

    return<div style={styles.body}>
      <Navbar/>
      <TableOfContents />
      <div style={styles.content}>
        <BookOverview />
      </div>
      <img src={img} style={styles.logo}/>
    </div>;
  }

}

export { Home as default };