'use strict'

import React, { PropTypes } from 'react'
import {
  ListView,
  StyleSheet,
  Image,
  Dimensions,
  View,
  Text
} from 'react-native'
import _ from 'lodash'

import {getImageVersion} from '../../../utils/ImageHelper'

export default class VideosList extends React.Component {
  static propTypes = {
    videos: PropTypes.array
  };

  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    const dataRows = props.videos ? props.videos : []
    this.state = {
      dataSource: dataSource.cloneWithRows(dataRows)
    }
  }

  componentWillReceiveProps (nextProps) {
    const dataRows = nextProps.videos ? nextProps.videos : []
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(dataRows)
    })
  }

  render () {
    return (
      <ListView
        horizontal
        enableEmptySections
        pagingEnabled
        style={styles.listView}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
      />
    )
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    const {width, height} = Dimensions.get('window')
    return (
      <View style={[styles.row, {width: width}]}>
        <Image
          source={{uri: getImageVersion(rowData.show.cover, 'small')}}
          style={styles.poster}
          resizeMode='cover'
        />
        <Image
          source={{uri: getImageVersion(rowData.image, 'small')}}
          style={styles.image}
          resizeMode='cover'
        />
        <Text
          style={[styles.title, {width: width}]}
        >
          {`${rowData.show.name}\n${rowData.name}`}
        </Text>
      </View>
    );
  } 
}

const styles = StyleSheet.create({
  listView: {
    height: 180,
    backgroundColor: 'black'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  image: {
    flex: 1,
  },
  poster: {
    width: 120
  },
  title: {
    position: 'absolute',
    paddingLeft: 10,
    paddingRight: 8,
    paddingTop: 5,
    paddingBottom: 5,
    left: 0,
    right: 0,
    bottom: 0,
    color: 'white',
    fontSize: 18,
    lineHeight: 26,
    backgroundColor: 'rgba(0,0,0,0.45)'
  }
})