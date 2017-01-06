// @flow
'use strict'

import React, {PropTypes} from 'react'
import {
  View,
  ListView,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native'
import _ from 'lodash'

import {getImageVersion} from '../../../utils/ImageHelper'
import {goToVideo} from '../../../utils/VideoHelper'

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
      <ListView
        style={styles.listView}
        horizontal
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
      />
    )
  }

  _renderRow (video) {
    return (
      <TouchableOpacity
        style={styles.cellContainer}
        onPress={() => {goToVideo(video.code)}}
        activeOpacity={0.85}
      >
        <Image
          style={styles.video}
          source={{uri: getImageVersion(video.image, 'small')}}
        />
        <View style={styles.playContainer}>
          <Image
            source={require('../../../../assets/VIdeoPlay.png')}
            resizeMode={'cover'}
            style={styles.videoPlay}
          />
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  listView: {
    margin: 7
  },
  cellContainer: {
    width: VIDEOROWHEIGHT * 2.5,
    height: VIDEOROWHEIGHT
  },
  video: {
    flex: 1,
    margin: 3
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
  }
})
