//@flow
'use strict'

import React, {PropTypes} from 'react'
import {ListView, TouchableOpacity, Image, StyleSheet} from 'react-native'
import _ from 'lodash'

import {getImageVersion} from '../../../utils/ImageHelper'

export default class ShowImagesRow extends React.Component {
  static propTypes = {
    images: PropTypes.array,
  };

  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows(props.images)
    }
    _.bindAll(this,[
      '_renderRow'
    ]);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.images)
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

  _renderRow(image) {
    return (
      <TouchableOpacity style={styles.cellContainer}>
        <Image
          style={styles.image}
          source={{uri: getImageVersion(image.image, 'smaller')}}
          resizeMode='cover'
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
    width: 100,
    height: 100,
  },
  image: {
    flex: 1,
    margin: 3,
  }
});