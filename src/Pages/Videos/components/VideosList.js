'use strict'

import React, { PropTypes } from 'react'
import {
  ListView,
  StyleSheet,
  Image,
  Dimensions,
  View,
  Text,
  Linking,
  TouchableOpacity
} from 'react-native'

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
        style={[styles.listView, this.props.style]}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}
      />
    )
  }

  _renderRow (rowData, sectionID, rowID, highlightRow) {
    const {width} = Dimensions.get('window')
    return (
      <View style={[styles.row, {width: width}]}>
        <Image
          source={{uri: getImageVersion(rowData.show.cover, 'small')}}
          style={styles.poster}
          resizeMode='cover'
        />
        <TouchableOpacity
          style={styles.image}
          onPress={this._onWatchVideo.bind(this, rowData.code)}
        >
          <Image
            source={{uri: getImageVersion(rowData.image, 'small')}}
            style={styles.image}
            resizeMode='cover'
          />
        </TouchableOpacity>
        <Text style={[styles.title, styles.titleTop]}>
          {rowData.show.name}
        </Text>
        <Text style={[styles.title, styles.titleBot]}>
          {rowData.name}
        </Text>
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
  listView: {
    height: 180
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    padding: 8
  },
  image: {
    flex: 1
  },
  poster: {
    width: 110
  },
  title: {
    position: 'absolute',
    paddingLeft: 10,
    paddingRight: 8,
    paddingTop: 5,
    paddingBottom: 5,
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    left: 8,
    right: 8
  },
  titleBot: {
    bottom: 8
  },
  titleTop: {
    top: 8
  }
})
