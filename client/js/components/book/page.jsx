'use strict';

import _                     from 'lodash';
import React                 from 'react';
import { connect }           from 'react-redux';
import { Helmet }            from 'react-helmet';

import * as ContentActions   from '../../actions/content';
import * as AnalyticsActions from '../../actions/analytics';
import assets                from '../../libs/assets';
import getAVSrc              from '../../utils/audio_video_src';

const select = (state) => {
  let lang = state.content.tocMeta.language;
  return {
    tableOfContents:  state.content.tableOfContents,
    contentName:      state.settings.contentName,
    tocMeta:          state.content.tocMeta,
    contentPath:      state.content.contentPath,
    locale:           lang
  };
};

export class Page extends React.Component {

  scrollToAssessment(){
    var pubFrame = document.getElementsByTagName('iframe')[0];
    var epubBody = pubFrame.contentDocument.body;
    if(!epubBody){ return; }

    var quizIframe = pubFrame.contentDocument.getElementById('openassessments_container');
    if(!quizIframe){ return; }

    var quizTop = quizIframe.getBoundingClientRect().top;
    epubBody.scrollTop += quizTop;
  }


  onMessage(message) {
    // Inconveniently, we don't seem to be able to locate the
    // assessment-player's iframe inside the content's iframe.  Conventiently,
    // the assessment-player sends a message up to us to indicate its available
    // locales.  Although we ignore the available locales, we use that message's
    // source to target a message back down to the assessment-player.
    var data = message.data;
    if(_.isString(message.data)){
      data = JSON.parse(message.data);
    }
    const type = data.open_assessments_msg;

    switch(type) {
      case 'open_assessments_available_locales':
        message.source.postMessage({
          open_assessments_msg: 'open_assessments_set_locale',
          locale: this.props.locale
        }, '*');
        break;
      case 'scrollToTop':
        this.scrollToAssessment();
        break;
    }
  }

  componentDidMount() {
    window.addEventListener('message', (e) => this.onMessage(e), false);
  }

  componentDidUpdate() {
    // Check if the iframe has reloaded, and focus to top of wrapping section
    setTimeout(() => {
      this.section.focus();
    }, 250);
  }

  addVideoEventListeners(iframeDocument) {
    let videoElements = iframeDocument.querySelectorAll('video');
    _.each(videoElements, (element) => {
      element.addEventListener('play', (e) => {
        this.props.videoPlay(
          e.target.id,
          getAVSrc(e.target),
          e.target.currentTime,
        );
      }, false);

      element.addEventListener('pause', (e) => {
        if(!e.target.ended) {
          this.props.videoPause(
            e.target.id,
            getAVSrc(e.target),
            e.target.currentTime,
          );
        }
      }, false);

      element.addEventListener('seeked', (e) => {
        this.props.videoSeeked(
          e.target.id,
          getAVSrc(e.target),
          e.target.currentTime,
        );
      }, false);

      element.addEventListener('ended', (e) => {
        this.props.videoEnded(e.target.id, getAVSrc(e.target));
      }, false);
    });
  }

  addAudioEventListeners(iframeDocument) {
    let audioElements = iframeDocument.querySelectorAll('audio');
    _.each(audioElements, (element) => {
      element.addEventListener('play', (e) => {
        this.props.audioPlay(
          e.target.id,
          getAVSrc(e.target),
          e.target.currentTime,
        );
      }, false);

      element.addEventListener('pause', (e) => {
        if(!e.target.ended) {
          this.props.audioPause(
            e.target.id,
            getAVSrc(e.target),
            e.target.currentTime,
          );
        }
      }, false);

      element.addEventListener('seeked', (e) => {
        this.props.audioSeeked(
          e.target.id,
          getAVSrc(e.target),
          e.target.currentTime,
        );
      }, false);

      element.addEventListener('ended', (e) => {
        this.props.audioEnded(e.target.id, getAVSrc(e.target));
      }, false);
    });
  }

  addImageEventListeners(iframeDocument) {
    let imgElements = iframeDocument.querySelectorAll('img.zoom-but-sm, img.zoom-but-md');
    _.each(imgElements, (element) => {
      element.addEventListener('click', (e) => {
        this.props.imageClick(e.target.id, e.target.src);
      }, false);
    });
  }

  addLinkEventListeners(iframeDocument) {
    let linkElements = iframeDocument.querySelectorAll('a');
    _.each(linkElements, (element) => {
      element.addEventListener('click', (e) => {
        this.props.linkClick(e.target.id, e.target.src);
      }, false);
    });
  }

  addButtonEventListeners(iframeDocument) {
    let buttonElements = iframeDocument.querySelectorAll('figure button');
    _.each(buttonElements, (element) => {
      element.addEventListener('click', (e) => {
        this.props.buttonClick(e.target.id);
      }, false);
    });
  }

  addTranscriptButtonEventListeners(iframeDocument) {
    let transcriptButtons = iframeDocument.querySelectorAll('.trans-form input');
    _.each(transcriptButtons, (element) => {
      let label = element.parentElement.querySelector('label');
      let labelName = label ? label.textContent : '';

      element.addEventListener('change', (e) => {
        if(e.target.checked) {
          this.props.openTranscript(labelName);
        } else {
          this.props.closeTranscript(labelName);
        }
      }, false);
    });
  }

  /* We need to listen to video/audio play and pause events and click events on
   * images inside the iframe.
   */
  addIframeEventListeners() {
    let iframeDocument = this.contentIframe.contentDocument ||
        this.contentIframe.contentWindow.document;

    this.addVideoEventListeners(iframeDocument);
    this.addAudioEventListeners(iframeDocument);
    this.addImageEventListeners(iframeDocument);
    this.addLinkEventListeners(iframeDocument);
    this.addButtonEventListeners(iframeDocument);
    this.addTranscriptButtonEventListeners(iframeDocument);
  }

  iframe(props) {
    var current = _.find(
      props.tableOfContents,
      (item) => item.id == props.params.pageId
    );
    if(!current) { return; }

    const iframeTitle = this.props.tocMeta.gradeUnit + ' ' + this.props.tocMeta.subjectLesson;
    return <iframe
      onLoad={() => this.addIframeEventListeners()}
      ref={(iframe) => this.contentIframe = iframe }
      src={`${props.contentPath}/${current.content}`}
      title={iframeTitle}
      allowFullScreen='true' />;
  }

  render() {
    var lastModified = this.props.tocMeta.lastModified;
    var footerText = lastModified ? `CLIx release date: ${lastModified}` : undefined;
    return (
      <section className='c-page' tabIndex='-1' ref={(section) => this.section = section}>
        <Helmet>
          <html lang={this.props.locale} />
        </Helmet>
        {this.iframe(this.props)}
        <div className='c-release'>
          {footerText}
        </div>
      </section>
    );
  }
}

export default connect(select, {...ContentActions, ...AnalyticsActions})(Page);
