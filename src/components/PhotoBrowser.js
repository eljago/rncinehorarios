//@flow
'use strict'

import React, { PropTypes } from 'react';
import {
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

import {getImageVersion} from '../utils/ImageHelper'

export default class PhotoBrowser extends React.Component {
  static propTypes = {
    images: PropTypes.array,
  };

  render() {
    const formattedImages = this.props.images.map((image) => {
      return {url: getImageVersion(image.image)}
    });
    const {width, height} = Dimensions.get('window');
    return (
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {
          width: width * this.props.images.length,
          height: height,
        }]}
      >
        {this._getImageViews()}
      </ScrollView>
    )
  }

  _getImageViews() {
    const {width, height} = Dimensions.get('window');
    return this.props.images.map((image) => {
      return (
        <Image
          key={image.image_id}
          style={[styles.image, {
            transform: [{
              rotate: image.width > image.height ? '-90deg' : '0deg',
            }, {
              scale: image.width > image.height ? image.width / image.height : 1,
            }]
          }]}
          source={{uri: getImageVersion(image.image)}}
          resizeMode='contain'
        />
      );
    });
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'black',
  },
  scrollContent: {
    backgroundColor: 'black',
  },
  image: {
    flex: 1,
  }
})