//@flow
'use strict'

import React, {PropTypes} from 'react'
import {
  Dimensions,
  Animated,
  PixelRatio
} from 'react-native'

export default class PhotoBrowserImage extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    imageUrl: PropTypes.string,
    imageWidth: PropTypes.number,
    imageHeight: PropTypes.number
  }

  constructor(props) {
    super(props)
    this._pixelRatio = PixelRatio.get()
    this.state = {
      orientation: 'PORTRAIT',
      rotateValue: new Animated.Value(0)
    }
  }

  _isPortrait() {
    return this.state.orientation === 'PORTRAIT' || this.state.orientation === 'PORTRAITUPSIDEDOWN'
  }

  render () {
    const {width, height} = Dimensions.get('window')
    const {imageUrl, imageWidth, imageHeight, index} = this.props
    const isPortrait = this._isPortrait()

    const imgWidth = imageWidth / this._pixelRatio
    const imgHeight = imageHeight / this._pixelRatio

    const imageWidthHeightRatio = imgWidth / imgHeight
    const scale = isPortrait
    ? (imageWidthHeightRatio > (width / height)
      ? (width / imgWidth) : (height / imgHeight))
    : (imageWidthHeightRatio > (width / height)
      ? (height / imgWidth) : (width / imgHeight))
    const left = isPortrait ? width * index - imgWidth / 2 + width / 2
      : width / 2 - imgWidth / 2
    const top = isPortrait ? height / 2 - imgHeight / 2
      : height * index - imgHeight / 2 + height / 2

    return (
      <Animated.Image
        style={{
          backgroundColor: 'black',
          position: 'absolute',
          left: left,
          top: top,
          width: imgWidth,
          height: imgHeight,
          transform: [{
            scale: scale
          }, {
            rotate: this.state.rotateValue.interpolate({
              inputRange: [-90, 180],
              outputRange: ['-90deg', '180deg']
            })
          }]
        }}
        source={{uri: imageUrl}}
        resizeMode='cover'
      />
    );
  }

  changeOrientation(orientation, animated = false) {
    this.setState({orientation})

    let rotate = 0
    if (orientation === 'PORTRAITUPSIDEDOWN') {
      rotate = 180
    } else if (orientation === 'LANDSCAPE-LEFT') {
      rotate = 90
    } else if (orientation === 'LANDSCAPE-RIGHT') {
      rotate = -90
    }

    if (animated) {
      Animated.spring(
        this.state.rotateValue,
        {
          toValue: rotate,
          tension: 10,
          friction: 5
        }
      ).start()
    }
    else {
      this.state.rotateValue.setValue(rotate);
    }
  }
}