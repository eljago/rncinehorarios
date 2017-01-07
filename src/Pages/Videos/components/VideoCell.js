'use strict'

import React, {PropTypes} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native'

import {getImageVersion} from '../../../utils/ImageHelper'
import {getShowRoute} from '../../../../data/routes'
import {goToVideo} from '../../../utils/VideoHelper'

const MARGINCELL = 10
const POSTERWIDTH = 80

export default class VideoCell extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired,
    showId: PropTypes.number,
    showName: PropTypes.string,
    showCoverUrl: PropTypes.string,
    videoName: PropTypes.string,
    videoType: PropTypes.string,
    videoPortraitUrl: PropTypes.string,
    videoCode: PropTypes.string,
    backgroundColor: PropTypes.string
  }

  render () {
    const {width} = Dimensions.get('window')
    const availWidth = width - MARGINCELL * 2
    const posterHeight = availWidth / (8/11 + 2.5)
    const {
      showId,
      showName,
      showCoverUrl,
      videoName,
      videoType,
      videoCode,
      videoPortraitUrl,
      backgroundColor
    } = this.props
    return (
      <View style={[styles.container, {
        width: width,
        backgroundColor: backgroundColor
      }]}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {showName}
          </Text>
          <View style={styles.contentRow}>
            <TouchableOpacity
              style={[styles.buttonPoster, {height: posterHeight}]}
              onPress={this._onGoToMovie.bind(this, showId, showName)}
              activeOpacity={0.85}
            >
              <Image
                source={{uri: getImageVersion(showCoverUrl, 'small')}}
                style={styles.container}
                resizeMode='cover'
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonPortrait}
              onPress={() => {goToVideo(videoCode)}}
              activeOpacity={0.85}
            >
              <Image
                source={{uri: getImageVersion(videoPortraitUrl, 'small')}}
                style={styles.image}
                resizeMode='cover'
              />
              <View style={styles.playContainer}>
                <Image
                  source={require('../../../../assets/VIdeoPlay.png')}
                  resizeMode={'cover'}
                  style={styles.videoPlay}
                />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>
            {videoName}
          </Text>
        </View>
      </View>
    )
  }

  _onGoToMovie (showId, showName) {
    const showRoute = getShowRoute(showId, showName)
    this.props.onPushRoute(showRoute, true)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    margin: MARGINCELL
  },
  contentRow: {
    flexDirection: 'row'
  },
  image: {
    flex: 1
  },
  playContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  videoPlay: {
    tintColor: '#C91800'
  },
  buttonPortrait: {
    flex: 1,
    backgroundColor: 'gray'
  },
  buttonPoster: {
    width: POSTERWIDTH,
    backgroundColor: 'gray'
  },
  title: {
    paddingLeft: 10,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    color: 'white',
    fontSize: 16,
    backgroundColor: '#575757'
  }
})
