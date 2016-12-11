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
    this.targetRotationValue = getRotationValue(props.initialOrientation)
    this.state = {
      orientation: props.initialOrientation,
      rotationValue: new Animated.Value(this.targetRotationValue)
    }
  }

  _isPortrait () {
    return this.state.orientation === 'PORTRAIT' || this.state.orientation === 'PORTRAITUPSIDEDOWN'
  }

  render () {
    const {width, height} = Dimensions.get('window')
    const {imageUrl, imageWidth, imageHeight} = this.props
    const isPortrait = this._isPortrait()

    const imgWidth = imageWidth / this._pixelRatio
    const imgHeight = imageHeight / this._pixelRatio

    const imageWidthHeightRatio = imgWidth / imgHeight
    const scale = isPortrait
    ? (imageWidthHeightRatio > (width / height)
      ? (width / imgWidth) : (height / imgHeight))
    : (imageWidthHeightRatio > (width / height)
      ? (height / imgWidth) : (width / imgHeight))

    const left = isPortrait ? width - imgWidth / 2 - width / 2
      : width / 2 - imgWidth / 2
    const top = isPortrait ? height / 2 - imgHeight / 2
      : height - imgHeight / 2 - height / 2

    return (
      <View
        style={{
          backgroundColor: 'black',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
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
              rotate: this.state.rotationValue.interpolate({
                inputRange: [-36000, 36000],
                outputRange: ['-36000deg', '36000deg']
              })
            }]
          }}
          source={{uri: imageUrl}}
          resizeMode='contain'
        />
      </View>
    )
  }

  changeOrientation (orientation, animated = false) {
    const rotationToAdd = getRotationOrientationToAdd(this.state.orientation, orientation)
    if (rotationToAdd !== 0 || this.state.orientation !== orientation) {

      this.setState({orientation})

      this.targetRotationValue = this.targetRotationValue + rotationToAdd

      if (animated) {
        Animated.spring(
          this.state.rotationValue,
          {
            toValue: this.targetRotationValue,
            tension: 10,
            friction: 5
          }
        ).start()
      } else {
        this.state.rotationValue.setValue(this.targetRotationValue)
      }
    }
  }

  getOrientation() {
    return this.state.orientation
  }
}

function getRotationValue(orientation) {
  if (orientation === 'PORTRAIT') {
      return 0
  }
  if (orientation === 'PORTRAITUPSIDEDOWN') {
      return 180
  }
  if (orientation === 'LANDSCAPE-LEFT') {
      return +90
  }
  if (orientation === 'LANDSCAPE-RIGHT') {
      return -90
  }
  return 0
}

function getRotationOrientationToAdd(oldOrientation, newOrientation) {
  console.log(newOrientation);
  if (oldOrientation === 'PORTRAIT') {
    if (newOrientation === 'PORTRAIT') {
      return 0
    } else if (newOrientation === 'LANDSCAPE-LEFT') {
      return +90
    } else if (newOrientation === 'LANDSCAPE-RIGHT') {
      return -90
    } else if (newOrientation === 'PORTRAITUPSIDEDOWN') {
      return 180
    }
  }
  else if (oldOrientation === 'LANDSCAPE-LEFT') {
    if (newOrientation === 'PORTRAIT') {
      return -90
    } else if (newOrientation === 'LANDSCAPE-LEFT') {
      return 0
    } else if (newOrientation === 'LANDSCAPE-RIGHT') {
      return 180
    } else if (newOrientation === 'PORTRAITUPSIDEDOWN') {
      return +90
    }
  }
  else if (oldOrientation === 'LANDSCAPE-RIGHT') {
    if (newOrientation === 'PORTRAIT') {
      return +90
    } else if (newOrientation === 'LANDSCAPE-LEFT') {
      return 180
    } else if (newOrientation === 'LANDSCAPE-RIGHT') {
      return 0
    } else if (newOrientation === 'PORTRAITUPSIDEDOWN') {
      return -90
    }
  }
  else if (oldOrientation === 'PORTRAITUPSIDEDOWN') {
    if (newOrientation === 'PORTRAIT') {
      return 0
    } else if (newOrientation === 'LANDSCAPE-LEFT') {
      return -90
    } else if (newOrientation === 'LANDSCAPE-RIGHT') {
      return +90
    } else if (newOrientation === 'PORTRAITUPSIDEDOWN') {
      return 0
    }
  }
  return 0
}
