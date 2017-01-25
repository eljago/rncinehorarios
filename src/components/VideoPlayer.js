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
  ActivityIndicator
} from 'react-native'

import Orientation from 'react-native-orientation'
import YouTube from 'react-native-youtube'
import MyModal from './MyModal'
import {getVideoHtml} from './VideoHtml.js'
import {reportEvent} from '../utils/Analytics'

import config from '../../data/config'

export default class VideoPlayer extends React.Component {
  static propTypes = {
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
  }

  state = {
    video: null,
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
    return (
      <MyModal
        ref={(comp) => {this._modal = comp}}
        onOpen={this._onOpen.bind(this)}
        onClose={this._onClose.bind(this)}
      >
        <View
          style={styles.container}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={this._closeModal.bind(this)}
            >
              <Text style={styles.closeText}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.playerContainer}>
            {this._getPlayer()}
            {this._getLoadingIndicator()}
          </View>
        </View>
      </MyModal>
    )
  }

  _getPlayer () {
    if (this.state.video) {
      const {
        name,
        code,
        video_type: videoType,
      } = this.state.video

      return (
        <YouTube
          style={styles.player}
          apiKey={config.googleApiKey}
          ref={(component) => { this._youTubePlayer = component }}
          videoId={code}           // The YouTube video ID
          play={this.state.isPlaying}
          loop={this.state.isLooping}
          playsInline={false}
          controls={1}
          onError={e => this.setState({ error: e.error })}
          onReady={e => this.setState({ isReady: true })}
          onChangeState={e => {
            this.setState({status: e.state })
          }}
          onChangeQuality={e => this.setState({ quality: e.quality })}
          onProgress={Platform.OS === 'ios'
            ? e => this.setState({ duration: e.duration, currentTime: e.currentTime })
            : undefined}
        />
      )
    }
    else {
      return null
    }
  }

  open (video) {
    Orientation.unlockAllOrientations()
    this.setState({
      video: video
    })
    this._modal.open()
  }

  _onOpen () {
    reportEvent('Video', 'opened')
    if (this.props.onOpen) {
      this.props.onOpen()
    }
  }

  _onClose() {
    Orientation.lockToPortrait()
    reportEvent('Video', 'closed')
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  _closeModal () {
    this._modal.close()
  }

  _getLoadingIndicator () {
    if (this.state.status == null) {
      return (
        <View style={styles.activityContainer}>
          <ActivityIndicator
            style={styles.activityIndicator}
            size='large'
            color='white'
          />
        </View>
      )
    }
    return null
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  playerContainer: {
    height: PixelRatio.roundToNearestPixel(Dimensions.get('window').width / (16 / 9)),
    alignSelf: 'stretch',
    marginVertical: 10,
  },
  player: {
    flex: 1
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
    top: 0, left: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
  },
  closeText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },
  activityContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  activityIndicator: {
    width: 36,
    height: 36
  }
})
