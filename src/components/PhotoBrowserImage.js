//@flow
'use strict'

import React, {PropTypes} from 'react'
import {
  Dimensions,
  Animated
} from 'react-native'

export default class PhotoBrowserImage extends React.Component {
  static propTypes = {
    imageUrl: PropTypes.string,
    imageWidth: PropTypes.number,
    imageHeight: PropTypes.number
  }

  constructor(props) {
    super(props)
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
    const {imageUrl, imageWidth, imageHeight, style} = this.props
    const isPortrait = this._isPortrait()

    const imageWidthHeightRatio = imageWidth / imageHeight
    const scale = isPortrait
    ? (imageWidthHeightRatio > (width / height)
      ? (width / imageWidth) : (height / imageHeight))
    : (imageWidthHeightRatio > (width / height)
      ? (height / imageWidth) : (width / imageHeight))

    return (
      <Animated.Image
        style={[style, {
          backgroundColor: 'black',
          width: imageWidth,
          height: imageHeight,
          transform: [{
            scale: scale
          }, {
            rotate: this.state.rotateValue.interpolate({
              inputRange: [-90, 180],
              outputRange: ['-90deg', '180deg']
            })
          }]
        }]}
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