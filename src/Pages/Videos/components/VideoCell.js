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
import MyListViewCell from '../../../components/MyListViewCell'

const POSTERWIDTH = 80

export default class VideoCell extends React.Component {
  static propTypes = {
    rowNumber: PropTypes.number,
    onPressPoster: PropTypes.func,
    onPressVideo: PropTypes.func,
    showId: PropTypes.number,
    showName: PropTypes.string,
    showCoverUrl: PropTypes.string,
    videoName: PropTypes.string,
    videoType: PropTypes.string,
    videoPortraitUrl: PropTypes.string,
    videoCode: PropTypes.string
  }

  render () {
    const {width} = Dimensions.get('window')
    const availWidth = width
    const posterHeight = availWidth / (8/11 + 2.5)
    const {
      rowNumber,
      onPressPoster,
      onPressVideo,
      showId,
      showName,
      showCoverUrl,
      videoName,
      videoType,
      videoCode,
      videoPortraitUrl
    } = this.props
    return (
      <MyListViewCell
        rowNumber={rowNumber}
        hideAccessoryView
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            {showName}
          </Text>
          <View style={styles.contentRow}>
            <TouchableOpacity
              style={[styles.buttonPoster, {height: posterHeight}]}
              onPress={onPressPoster}
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
              onPress={onPressVideo}
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
      </MyListViewCell>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    shadowRadius: 3,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0, height: 0
    }
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
    backgroundColor: '#373737'
  }
})
