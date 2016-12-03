//@flow
'use strict'

import React, { PropTypes } from 'react';
import {
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  PixelRatio,
} from 'react-native';

import {getImageVersion} from '../utils/ImageHelper'

export default class PhotoBrowser extends React.Component {
  static propTypes = {
    images: PropTypes.array,
    index: PropTypes.string,
  };
  static defaultProps = {
    index: "0",
  };
  _pixelRatio = PixelRatio.get();

  componentDidMount() {
    const {width} = Dimensions.get('window');
    this._scrollView.scrollTo({
      x: width * parseInt(this.props.index),
      animated: false,
    })
  }

  render() {
    const formattedImages = this.props.images.map((image) => {
      return {url: getImageVersion(image.image)}
    });
    const {width, height} = Dimensions.get('window');
    return (
      <ScrollView
        ref={(scrollView) => {this._scrollView = scrollView;}}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
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
    const windowWidthHeightRatio = width / height;

    return this.props.images.map((image, index) => {
      const imageWidth = image.width / this._pixelRatio;
      const imageHeight = image.height / this._pixelRatio;
      const imageWidthHeightRatio = imageWidth / imageHeight;
      const scale = imageWidthHeightRatio > (width / height) ?
        (width / imageWidth) : (height / imageHeight);

      return (
        <Image
          key={image.image_id}
          style={[styles.image, {
            position: 'absolute',
            left: width * index - imageWidth / 2 + width / 2,
            top: height / 2 - imageHeight / 2,
            width: imageWidth,
            height: imageHeight,
            transform: [{
              scale: scale,
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
    backgroundColor: 'black',
  }
})