'use strict'

import React, {PropTypes} from 'react'
import {
  WebView
} from 'react-native'

import {getVideoHtml} from '../components/VideoHtml.js'

export default class Video extends React.Component {
  static propTypes = {
    video: PropTypes.object.isRequired
  }

  render () {
    return (
      <WebView
        source={{html: getVideoHtml(this.props.video)}}
        bounces={false}
        scalesPageToFit
      />
    )
  }
}