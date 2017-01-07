// @flow
'use strict'

import React, {PropTypes} from 'react'
import {ListView, TouchableOpacity, Image, StyleSheet} from 'react-native'
import _ from 'lodash'

import {getImageVersion} from '../../../utils/ImageHelper'
import {getImageViewerRoute} from '../../../../data/routes'

export default class ShowImagesRow extends React.Component {
  static propTypes = {
    images: PropTypes.array,
    onPushRoute: PropTypes.func
  };

  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: dataSource.cloneWithRows(props.images)
    }
    _.bindAll(this, [
      '_renderRow',
      '_onPress'
    ])
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.images)
    })
  }

  render () {
    return (
      <ListView
        style={styles.container}
        horizontal
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
      />
    )
  }

  _renderRow (image: string, sectionID: number, rowID: number) {
    return (
      <TouchableOpacity
        style={styles.cellContainer}
        onPress={() => { this._onPress(rowID) }}
        activeOpacity={0.85}
      >
        <Image
          style={styles.image}
          source={{uri: getImageVersion(image.image, 'smaller')}}
          resizeMode='cover'
        />
      </TouchableOpacity>
    )
  }

  _onPress (index: number) {
    const photoBrowserRoute = getImageViewerRoute(this.props.images, index)
    this.props.onPushRoute(photoBrowserRoute)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cellContainer: {
    width: 100,
    height: 100
  },
  image: {
    flex: 1,
    margin: 3,
    backgroundColor: '#2F2F2F'
  }
})
