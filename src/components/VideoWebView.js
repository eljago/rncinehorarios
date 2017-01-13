'use strict'

import React from 'react'
import {
  Modal,
  WebView,
  StyleSheet
} from 'react-native'

import {getVideoHtml} from './VideoHtml.js'

export default class VideoWebView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      videoProps: {}
    }
  }

  render () {
    return (
      <Modal
        animationType={"fade"}
        transparent={false}
        visible={this.state.visible}
        onRequestClose={this._onClose.bind(this)}
      >
        <WebView
          source={{html: getVideoHtml(this.state.videoProps)}}
          style={styles.container}
        />
      </Modal>
    )
  }

  open (videoProps) {
    this.setState({
      visible: true,
      videoProps: videoProps
    })
  }

  _onClose () {
    this.setState({
      visible: false
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})