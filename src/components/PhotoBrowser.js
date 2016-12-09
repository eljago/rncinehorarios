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
  Animated
} from 'react-native'
import Orientation from 'react-native-orientation'
import {getImageVersion} from '../utils/ImageHelper'

export default class PhotoBrowser extends React.Component {
  static propTypes = {
    images: PropTypes.array,
    index: PropTypes.string
  };
  static defaultProps = {
    index: '0'
  };

  constructor (props) {
    super(props)

    this._pixelRatio = PixelRatio.get()
    this._index = parseInt(props.index)

    this.state = {
      orientation: Orientation.getInitialOrientation(),
      rotate: new Animated.Value(0)
    }
    _.bindAll(this, ['_orientationChanged', '_onScroll'])
  }

  componentWillMount () {
    var initial = Orientation.getInitialOrientation()
    this._orientationChanged(initial)
  }

  componentDidMount () {
    const {width} = Dimensions.get('window')
    this._scrollView.scrollTo({
      x: width * this._index,
      animated: false
    })
    Orientation.lockToPortrait()
    Orientation.addSpecificOrientationListener(this._orientationChanged)
  }

  componentWillUnmount () {
    Orientation.getOrientation((err, orientation) => {
      console.log('Current Device Orientation: ', orientation)
    })
    Orientation.removeSpecificOrientationListener(this._orientationChanged)
    Orientation.unlockAllOrientations()
  }

  render () {
    const {width, height} = Dimensions.get('window')
    const isPortrait = this._isPortrait()
    return (
      <ScrollView
        style={styles.scrollView}
        ref={(scrollView) => { this._scrollView = scrollView }}
        horizontal={this._isPortrait()}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onScroll={this._onScroll}
        scrollEventThrottle={8}
        contentContainerStyle={[styles.scrollContent, {
          width: isPortrait ? width * this.props.images.length : width,
          height: isPortrait ? height : height * this.props.images.length,
          transform: [{
            scale: 1
          }]
        }]}
      >
        {this._getImageViews()}
      </ScrollView>
    )
  }

  _orientationChanged (orientation) {
    this.setState({orientation})
    if (this._scrollView) {
      const {width, height} = Dimensions.get('window')
      if (this._isPortrait()) {
        this._scrollView.scrollTo({
          x: width * this._index,
          animated: false
        })
      } else {
        this._scrollView.scrollTo({
          y: height * this._index,
          animated: false
        })
      }

      let rotate = 0
      if (orientation === 'PORTRAITUPSIDEDOWN') {
        rotate = 180
      } else if (orientation === 'LANDSCAPE-LEFT') {
        rotate = 90
      } else if (orientation === 'LANDSCAPE-RIGHT') {
        rotate = 270
      }
        
      Animated.spring(
        this.state.rotate,
        {
          toValue: rotate,
          tension: 10,
          friction: 5
        }
      ).start();
    }
  }

  _isPortrait () {
    return this.state.orientation === 'PORTRAIT' || this.state.orientation === 'PORTRAITUPSIDEDOWN'
  }

  _onScroll (e) {
    const event = e.nativeEvent
    const layoutHorizontal = this._isPortrait()
      ? event.layoutMeasurement.width : event.layoutMeasurement.height
    const contentOffset = this._isPortrait()
      ? event.contentOffset.x : event.contentOffset.y
    this._index = Math.floor((contentOffset + 0.5 * layoutHorizontal) / layoutHorizontal)
  }

  _getImageViews () {
    const {width, height} = Dimensions.get('window')
    const isPortrait = this._isPortrait()

    return this.props.images.map((image, index) => {
      const imageWidth = image.width / this._pixelRatio
      const imageHeight = image.height / this._pixelRatio
      const imageWidthHeightRatio = imageWidth / imageHeight
      const scale = isPortrait
      ? (imageWidthHeightRatio > (width / height)
        ? (width / imageWidth) : (height / imageHeight))
      : (imageWidthHeightRatio > (width / height)
        ? (height / imageWidth) : (width / imageHeight))
      
      return (
        <Animated.Image
          key={image.image_id}
          style={[styles.image, {
            position: 'absolute',
            left: isPortrait
              ? width * index - imageWidth / 2 + width / 2
              : width / 2 - imageWidth / 2,
            top: isPortrait
              ? height / 2 - imageHeight / 2
              : height * index - imageHeight / 2 + height / 2,
            width: imageWidth,
            height: imageHeight,
            transform: [{
              scale: scale
            }, {
              rotate: this.state.rotate.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg']
              })
            }]
          }]}
          source={{uri: getImageVersion(image.image)}}
          resizeMode='cover'
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
