import React        from 'react';
import TestUtils    from 'react-dom/test-utils';
import Drawer       from 'material-ui/Drawer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Page }     from './page';

describe('page', () => {
  let page;
  let props;
  const renderResult = () => {
    page = TestUtils.renderIntoDocument(<Page tocMeta={{}} />);
  };

  beforeEach(() => {
    props = {
      tableOfContents: [{ id:1 }, { id:2 }],
      contentPath:'FakeUrl',
      params:{ pageId:1 },
    };
    renderResult();
  });

  it('renders iframe of selected item', () => {
    const result = page.iframe(props);
    expect(result.type).toEqual('iframe');
  });

  it('returns div if no item is selected', () => {
    props.params.pageId = 3;
    const result = page.iframe(props);
    expect(result.type).toEqual('div');
  });

  it('renders navigation buttons', () => {
    const pageProps = {
      tocMeta: {},
      tableOfContents: [{ id:'1' }, { id:'2' }, { id:'3' }],
      params: {
        pageId: '1'
      },
      localizedStrings: {
        footer: {
          next: 'Next',
          previous: 'Previous'
        }
      }
    };

    page = TestUtils.renderIntoDocument(<Page {...pageProps} />);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(page, 'c-btn-footer--next-page').length).toEqual(1);
    expect(TestUtils.findRenderedDOMComponentWithClass(page, 'c-btn-footer--next-page').disabled).toEqual(false);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(page, 'c-btn-footer--prev-page').length).toEqual(1);
    expect(TestUtils.findRenderedDOMComponentWithClass(page, 'c-btn-footer--prev-page').disabled).toEqual(true);

    pageProps.params.pageId = '2';
    page = TestUtils.renderIntoDocument(<Page {...pageProps} />);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(page, 'c-btn-footer--next-page').length).toEqual(1);
    expect(TestUtils.findRenderedDOMComponentWithClass(page, 'c-btn-footer--next-page').disabled).toEqual(false);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(page, 'c-btn-footer--prev-page').length).toEqual(1);
    expect(TestUtils.findRenderedDOMComponentWithClass(page, 'c-btn-footer--prev-page').disabled).toEqual(false);

    pageProps.params.pageId = '3';
    page = TestUtils.renderIntoDocument(<Page {...pageProps} />);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(page, 'c-btn-footer--next-page').length).toEqual(1);
    expect(TestUtils.findRenderedDOMComponentWithClass(page, 'c-btn-footer--next-page').disabled).toEqual(true);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(page, 'c-btn-footer--prev-page').length).toEqual(1);
    expect(TestUtils.findRenderedDOMComponentWithClass(page, 'c-btn-footer--prev-page').disabled).toEqual(false);
  });

  it('renders bibliography button when appropriate', () => {
    const pageProps = {
      tocMeta: {},
      tableOfContents: [{ id:'1' }, { id:'2' }, { id:'3' }],
      params: {
        pageId: '1'
      },
      localizedStrings: {
        footer: {
          next: 'Next',
          previous: 'Previous',
          bibliography: 'bib'
        }
      },
      styles: {}
    };

    let wrappedPage = (
      <MuiThemeProvider>
        <Page {...pageProps} />
      </MuiThemeProvider>
    );

    page = TestUtils.renderIntoDocument(wrappedPage);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(page, 'c-btn-footer--bibliography').length).toEqual(0);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(page, 'c-drawer-btn-close').length).toEqual(0);
    expect(TestUtils.scryRenderedComponentsWithType(page, Drawer).length).toEqual(0);

    pageProps.bibliography = {
      content: 'fakeUrl'
    };

    wrappedPage = (
      <MuiThemeProvider>
        <Page {...pageProps} />
      </MuiThemeProvider>
    );

    page = TestUtils.renderIntoDocument(wrappedPage);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(page, 'c-btn-footer--bibliography').length).toEqual(1);
    expect(TestUtils.scryRenderedDOMComponentsWithClass(page, 'c-drawer-btn-close').length).toEqual(1);
    const drawerBtn = TestUtils.findRenderedDOMComponentWithClass(page, 'c-btn-footer--bibliography');

    expect(TestUtils.scryRenderedComponentsWithType(page, Drawer).length).toEqual(1);
    let drawer = TestUtils.findRenderedComponentWithType(page, Drawer);
    expect(drawer.props.open).toEqual(false);

    TestUtils.Simulate.click(drawerBtn);

    expect(TestUtils.scryRenderedDOMComponentsWithClass(page, 'c-drawer-btn-close').length).toEqual(1);
    expect(TestUtils.scryRenderedComponentsWithType(page, Drawer).length).toEqual(1);
    drawer = TestUtils.findRenderedComponentWithType(page, Drawer);
    expect(drawer.props.open).toEqual(true);
  });
});
