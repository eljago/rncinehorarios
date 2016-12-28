'use strict'

import React, {PropTypes} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
  Dimensions
} from 'react-native'

import {getImageVersion} from '../../../utils/ImageHelper'
import Colors from '../../../../data/Colors'

export default class VideoCell extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired,
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
    const {
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
              style={styles.buttonPoster}
              onPress={this._onWatchVideo.bind(this, videoCode)}
              activeOpacity={0.85}
            >
              <Image
                source={{uri: getImageVersion(showCoverUrl, 'small')}}
                style={styles.container}
                resizeMode='cover'
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.container}
              onPress={this._onWatchVideo.bind(this, videoCode)}
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

  _onWatchVideo (videoCode) {
    const url = `http://www.youtube.com/watch?v=${videoCode}`
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log('Don\'t know how to open URI: ' + url);
      }
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    margin: 10
  },
  contentRow: {
    flexDirection: 'row'
  },
  image: {
    flex: 1,
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
  buttonPoster: {
    width: 80,
    height: 110
  },
  title: {
    paddingLeft: 10,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    color: 'white',
    fontSize: 16,
    backgroundColor: '#575757',
  }
})