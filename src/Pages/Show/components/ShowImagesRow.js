// @flow
'use strict'

import React, {PropTypes} from 'react'
import {
  ListView,
  TouchableOpacity,
  Image,
  StyleSheet,
  View
} from 'react-native'
import _ from 'lodash'

import {getImageVersion} from '../../../utils/ImageHelper'
import {getImageViewerRoute} from '../../../../data/routes'
import PhotoBrowser from '../../../components/PhotoBrowser'

export default class ShowImagesRow extends React.Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    setDrawerLockMode: PropTypes.func.isRequired
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
      <View>
        <ListView
          style={styles.container}
          horizontal
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
        />
        <PhotoBrowser
          ref={(comp) => {this._photoBrowser = comp}}
          images={this.props.images}
          onOpen={this._onOpenPhotoBrowser.bind(this)}
          onClose={this._onClosePhotoBrowser.bind(this)}
        />
      </View>
    )
  }

  _renderRow (image, sectionID, rowID) {
    return (
      <TouchableOpacity
        style={styles.cellContainer}
        onPress={this._onPress.bind(this, rowID)}
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

  _onPress (index) {
    this._photoBrowser.open(parseInt(index))
  }

  _onOpenPhotoBrowser () {
    this.props.setDrawerLockMode('locked-closed')
  }

  _onClosePhotoBrowser () {
    this.props.setDrawerLockMode('unlocked')
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
