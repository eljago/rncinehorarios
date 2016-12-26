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
        style={[styles.container, this.props.style]}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}
      />
    )
  }

  _renderRow (rowData, sectionID, rowID, highlightRow) {
    const {width} = Dimensions.get('window')
    return (
      <View style={[styles.container, {
        width: width,
        backgroundColor: parseInt(rowID) % 2 === 0 ? 'white' : '#DFE4E5'
      }]}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {rowData.show.name}
          </Text>
          <View style={styles.contentRow}>
            <TouchableOpacity
              style={styles.poster}
              onPress={this._onWatchVideo.bind(this, rowData.code)}
              activeOpacity={0.8}
            >
              <Image
                source={{uri: getImageVersion(rowData.show.cover, 'small')}}
                style={styles.poster}
                resizeMode='cover'
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.image}
              onPress={this._onWatchVideo.bind(this, rowData.code)}
              activeOpacity={0.8}
            >
              <Image
                source={{uri: getImageVersion(rowData.image, 'small')}}
                style={styles.image}
                resizeMode='cover'
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>
            {rowData.name}
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
    flex: 1
  },
  poster: {
    width: 100,
    height: 150
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
