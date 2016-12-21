'use strict'

import React, { PropTypes } from 'react'
import {ListView, StyleSheet, Image} from 'react-native'
import _ from 'lodash'

import {getImageVersion} from '../../../utils/ImageHelper'

export default class Theaters extends React.Component {
  static propTypes = {
    latestVideos: PropTypes.array
  };

  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    const dataRows = props.latestVideos ? props.latestVideos : []
    this.state = {
      dataSource: dataSource.cloneWithRows(dataRows)
    }
  }

  render () {
    return (
      <ListView
        horizontal
        enableEmptySections
        style={styles.listView}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
      />
    )
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <Image
        source={{uri: getImageVersion(rowData.image, 'smaller')}}
        style={styles.image}
      />
    );
  } 
}

const styles = StyleSheet.create({
  listView: {
    height: 100,
    backgroundColor: 'black'
  },
  image: {
    height: 100,
    width: 100
  }
})