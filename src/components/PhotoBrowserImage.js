// @flow
'use strict'

import React, {PropTypes} from 'react'
import {
  Dimensions,
  Animated,
  PixelRatio,
  View
} from 'react-native'

export default class PhotoBrowserImage extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    imageUrl: PropTypes.string,
    imageWidth: PropTypes.number,
    imageHeight: PropTypes.number,
    initialOrientation: PropTypes.string
  }

  constructor (props) {
    super(props)
    this._pixelRatio = PixelRatio.get()
    this.state = {
      orientation: props.initialOrientation
    }
  }

  _isPortrait () {
    return this.state.orientation === 'PORTRAIT' || this.state.orientation === 'PORTRAITUPSIDEDOWN'
  }

  render () {
    const {width, height} = Dimensions.get('window')
    const isPortrait = this._isPortrait()
    const {imageUrl, imageWidth, imageHeight} = this.props

    const imgWidth = imageWidth / this._pixelRatio
    const imgHeight = imageHeight / this._pixelRatio

    const fitHorizontally = isPortrait
      ? (imgWidth / imgHeight) > (width / height) // PORTRAIT
      : (imgWidth / imgHeight) > (height / width) // LANDSCAPE

    const scale = isPortrait
    ? (fitHorizontally ? (width / imgWidth) : (height / imgHeight)) // PORTRAIT
    : (fitHorizontally ? (height / imgWidth) : (width / imgHeight)) // LANDSCAPE

    const left = isPortrait ? width - imgWidth / 2 - width / 2
      : width / 2 - imgWidth / 2
    const top = isPortrait ? height / 2 - imgHeight / 2
      : height - imgHeight / 2 - height / 2

    return (
      <View
        style={{
          backgroundColor: 'black',
          flex: 1,
          width: width,
          height: height
        }}
      >
        <Animated.Image
          style={{
            position: 'absolute',
            left: left,
            top: top,
            backgroundColor: 'black',
            width: imgWidth,
            height: imgHeight,
            transform: [{
              scale: scale
            }, {
              rotate: `${Math.floor(this._isPortrait() ? 0 : 90)}deg`
            }]
          }}
          source={{uri: imageUrl}}
          resizeMode='contain'
        />
      </View>
    )
  }

  changeOrientation (orientation) {
    if (this.state.orientation !== orientation) {
      this.setState({orientation})
    }
  }
}