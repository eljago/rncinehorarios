// @flow
'use strict'

import React, { PropTypes } from 'react'
import _ from 'lodash'
import {
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  PixelRatio,
} from 'react-native'
import Orientation from 'react-native-orientation';
import {getImageVersion} from '../utils/ImageHelper'

export default class PhotoBrowser extends React.Component {
  static propTypes = {
    images: PropTypes.array,
    index: PropTypes.string
  };
  static defaultProps = {
    index: '0'
  };
  _pixelRatio = PixelRatio.get();

  constructor(props) {
    super(props);
    const {width, height} = Dimensions.get('window')
    this.state = {
      portrait: width < height,
    }
    _.bindAll(this, '_orientationDidChange')
  }

  componentWillMount() {
    var initial = Orientation.getInitialOrientation();
    this._orientationChanged(initial);
  }

  componentDidMount () {
    const {width} = Dimensions.get('window')
    this._scrollView.scrollTo({
      x: width * parseInt(this.props.index),
      animated: false
    })
    Orientation.lockToPortrait();
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  componentWillUnmount () {
    Orientation.getOrientation((err,orientation)=> {
      console.log("Current Device Orientation: ", orientation);
    });
    Orientation.removeOrientationListener(this._orientationDidChange);
    Orientation.unlockAllOrientations()
  }

  _orientationDidChange (o) {
    this._orientationChanged(o);
  }

  _orientationChanged(o) {
    this.setState({
      portrait: o === 'PORTRAIT'
    })
  }

  render () {
    const {width, height} = Dimensions.get('window')
    return (
      <ScrollView
        ref={(scrollView) => { this._scrollView = scrollView }}
        horizontal={this.state.portrait}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {
          width: this.state.portrait ? width * this.props.images.length : width,
          height: this.state.portrait ? height : height * this.props.images.length,
          transform: [{
            scale: 1
          }]
        }]}
      >
        {this._getImageViews()}
      </ScrollView>
    )
  }

  _getImageViews () {
    const {width, height} = Dimensions.get('window')

    return this.props.images.map((image, index) => {
      const imageWidth = image.width / this._pixelRatio
      const imageHeight = image.height / this._pixelRatio
      const imageWidthHeightRatio = imageWidth / imageHeight
      const scale = this.state.portrait
      ? (imageWidthHeightRatio > (width / height)
        ? (width / imageWidth) : (height / imageHeight))
      : (imageWidthHeightRatio > (width / height)
        ? (height / imageWidth) : (width / imageHeight))

      return (
        <Image
          key={image.image_id}
          style={[styles.image, {
            position: 'absolute',
            left: this.state.portrait
              ? width * index - imageWidth / 2 + width / 2
              : width / 2 - imageWidth / 2,
            top: this.state.portrait
              ? height / 2 - imageHeight / 2
              : height * index - imageHeight / 2 + height / 2,
            width: imageWidth,
            height: imageHeight,
            transform: [{
              scale: scale
            },{
              rotate: this.state.portrait ? '0deg' : '90deg'
            }]
          }]}
          source={{uri: getImageVersion(image.image)}}
          resizeMode='contain'
        />
      )
    })
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'black'
  },
  scrollContent: {
    backgroundColor: 'black'
  },
  image: {
    backgroundColor: 'black'
  }
})
