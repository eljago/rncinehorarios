'use strict'

import React, {PropTypes} from 'react'
import {
  View,
  StyleSheet,
  PixelRatio,
  Modal,
  Platform,
  Dimensions,
  TouchableOpacity,
  Text,
  StatusBar
} from 'react-native'

import Orientation from 'react-native-orientation'

import YouTube from 'react-native-youtube'
import {getVideoHtml} from './VideoHtml.js'

export default class VideoPlayer extends React.Component {
  static propTypes = {
    video: PropTypes.object,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
  }

  state = {
    video: null,
    visible: false,
    isReady: false,
    status: null,
    quality: null,
    error: null,
    isPlaying: true,
    isLooping: true,
    duration: 0,
    currentTime: 0,
  };

  render () {
    if (!this.state.video) {
      return null
    }
    const {
      name,
      code,
      video_type: videoType,
    } = this.state.video

    return (
      <Modal
        animationType={"fade"}
        transparent={false}
        visible={this.state.visible}
        onRequestClose={this._onClose.bind(this)}
      >
        <StatusBar hidden={true}/>
        <View
          style={styles.container}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={this._onClose.bind(this)}
            >
              <Text style={styles.closeText}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
          <YouTube
            style={styles.player}
            ref={(component) => { this._youTubePlayer = component }}
            videoId={code}           // The YouTube video ID
            play={this.state.isPlaying}
            loop={this.state.isLooping}
            playsInline={false}
            controls={1}
            style={styles.player}
            onError={e => this.setState({ error: e.error })}
            onReady={e => this.setState({ isReady: true })}
            onChangeState={e => this.setState({ status: e.state })}
            onChangeQuality={e => this.setState({ quality: e.quality })}
            onProgress={Platform.OS === 'ios'
              ? e => this.setState({ duration: e.duration, currentTime: e.currentTime })
              : undefined}
          />
        </View>
      </Modal>
    )
  }

  open (video) {
    Orientation.unlockAllOrientations()
    this.setState({
      video: video,
      visible: true,
      backgroundColorAlpha: 1
    })
    this.props.onOpen()
  }

  _onClose() {
    Orientation.lockToPortrait()
    if (this.state.visible === true) {
      this.setState({visible: false})
    }
    this.props.onClose()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center'
  },
  player: {
    height: PixelRatio.roundToNearestPixel(Dimensions.get('window').width / (16 / 9)),
    alignSelf: 'stretch',
    backgroundColor: 'black',
    marginVertical: 10,
  },
  header: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 50,
    alignItems: 'center',
    flexDirection: 'row'
  },
  closeButton: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
  },
  closeText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
})