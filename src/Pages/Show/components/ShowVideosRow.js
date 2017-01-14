// @flow
'use strict'

import React, {PropTypes} from 'react'
import {
  View,
  ListView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text
} from 'react-native'
import _ from 'lodash'

import {getImageVersion} from '../../../utils/ImageHelper'
import {goToVideo} from '../../../utils/VideoHelper'
import VideoPlayer from '../../../components/VideoPlayer'

const VIDEOROWHEIGHT = 100

export default class ShowVideosRow extends React.Component {
  static propTypes = {
    videos: PropTypes.array
  };

  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: dataSource.cloneWithRows(props.videos)
    }
    _.bindAll(this, [
      '_renderRow'
    ])
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.videos)
    })
  }

  render () {
    return (
      <View style={styles.container}>
        <VideoPlayer
          ref={(comp) => {this._videoPlayer = comp}}
          onOpen={() => {

          }}
          onClose={() => {
            
          }}
        />
        <ListView
          style={styles.container}
          horizontal
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
        />
      </View>
    )
  }

  _renderRow (video) {
    return (
      <TouchableOpacity
        style={styles.cellContainer}
        onPress={this._goToVideo.bind(this, video)}
        activeOpacity={0.85}
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.video}
            source={{uri: getImageVersion(video.image, 'small')}}
          />
          <View style={styles.videoOverlay}>
            <Text style={styles.textVideoName}>
              {video.name}
            </Text>
            <View style={styles.playImageContainer}>
              <Image
                source={require('../../../../assets/VIdeoPlay.png')}
                resizeMode={'cover'}
                style={styles.imagePlay}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _goToVideo (video) {
    this._videoPlayer.open(video)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cellContainer: {
    flex: 1,
    margin: 3,
    backgroundColor: '#2F2F2F'
  },
  imageContainer: {
    width: VIDEOROWHEIGHT * 2.5,
    height: VIDEOROWHEIGHT
  },
  video: {
    flex: 1,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'stretch'
  },
  playImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imagePlay: {
    tintColor: '#C5BEC9',
    height: VIDEOROWHEIGHT * 0.8,
    width: VIDEOROWHEIGHT * 0.8
  },
  textVideoName: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    padding: 2,
    fontSize: 18
  }
})
