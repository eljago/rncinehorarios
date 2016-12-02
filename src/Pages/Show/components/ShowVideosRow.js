//@flow
'use strict'

import React, {PropTypes} from 'react'
import {ListView, TouchableOpacity, Image, StyleSheet} from 'react-native'
import _ from 'lodash'

import {getImageVersion} from '../../../utils/ImageHelper'

export default class ShowVideosRow extends React.Component {
  static propTypes = {
    videos: PropTypes.array,
  };

  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows(props.videos)
    }
    _.bindAll(this,[
      '_renderRow'
    ]);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.videos)
    });
  }

  render() {
    return (
      <ListView
        style={styles.listView}
        horizontal={true}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
      />
    );
  }

  _renderRow(video) {
    return (
      <TouchableOpacity style={styles.cellContainer}>
        <Image
          style={styles.video}
          source={{uri: getImageVersion(video.image, 'smaller')}}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  listView: {
    margin: 7,
  },
  cellContainer: {
    width: 256,
    height: 144,
  },
  video: {
    flex: 1,
    margin: 3,
  }
});