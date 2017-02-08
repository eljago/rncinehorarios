//@flow
'use strict'

import React, {PropTypes} from 'react'
import {
  View,
  StyleSheet,
  PixelRatio,
  Platform,
  Dimensions,
  ActivityIndicator
} from 'react-native'

import Orientation from 'react-native-orientation'
import YouTube from 'react-native-youtube'

import config from '../../../data/config'

type Video = {
  code: string,
  video_type: string
}
type Props = {
  video: Video
}
type State = {
  isReady: bool,
  status: string,
  quality: string,
  error: string,
  isPlaying: bool,
  isLooping: bool,
  duration: number,
  currentTime: number,
}

export default class VideoPlayer extends React.Component {
  static propTypes: Props
  state = {
    isReady: false,
    status: null,
    quality: null,
    error: null,
    isPlaying: true,
    isLooping: true,
    duration: 0,
    currentTime: 0,
  };

  constructor (props: Props) {
    super(props)
  }

  componentDidMount () {
    Orientation.unlockAllOrientations()
  }

  componentWillUnmount () {
    Orientation.lockToPortrait()
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.playerContainer}>
          {this._getPlayer()}
          {this._getLoadingIndicator()}
        </View>
      </View>
    )
  }

  _getPlayer () {
    if (this.props.video) {
      const {
        code,
        video_type: videoType,
      } = this.props.video

      return (
        <YouTube
          style={styles.player}
          apiKey={config.googleApiKey}
          videoId={code}
          play={this.state.isPlaying}
          loop={this.state.isLooping}
          playsInline={false}
          controls={1}
          onError={e => {
            this.setState({error: e.error })
          }}
          onReady={e => {
            this.setState({ isReady: true })
          }}
          onChangeState={e => {
            this.setState({status: e.state })
          }}
          onChangeQuality={e => {
            this.setState({ quality: e.quality})
          }}
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

  _getLoadingIndicator () {
    if (Platform.OS === 'ios' && this.state.status == null) {
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  playerContainer: {
    height: PixelRatio.roundToNearestPixel(Dimensions.get('window').width / (16 / 9)),
    alignSelf: 'stretch',
    marginVertical: 10,
    backgroundColor: 'black'
  },
  player: {
    flex: 1
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
