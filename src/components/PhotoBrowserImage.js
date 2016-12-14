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
    const {imageWidth, imageHeight, initialOrientation} = props

    this._pixelRatio = PixelRatio.get()
    this._imageWidth = imageWidth / this._pixelRatio
    this._imageHeight = imageHeight / this._pixelRatio

    this.state = {
      orientation: initialOrientation,
      rotationValue: new Animated.Value(0),
      scaleValue: new Animated.Value(this._getTransformScale(initialOrientation))
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.orientation !== prevState.orientation) {
      if (this._animateRotation) {
        Animated.spring(
          this.state.rotationValue,
          {
            toValue: 0,
            tension: 10,
            friction: 5
          }
        ).start()
        Animated.spring(
          this.state.scaleValue,
          {
            toValue: this._getTransformScale(this.state.orientation)
          }
        ).start()
      }
    }
  }

  render () {
    const {width, height} = Dimensions.get('window')
    const {scaleValue, rotationValue, orientation} = this.state

    const isPortrait = getIsPortrait(orientation)
    const rotationWidth = isPortrait ? width : height
    const rotationHeight = isPortrait ? height : width
    const left = (rotationWidth / 2) - (this._imageWidth / 2)
    const top = (rotationHeight / 2) - (this._imageHeight / 2)

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'black',
          width: rotationWidth,
          height: rotationHeight,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Animated.Image
          style={{
            position: 'absolute',
            left: left,
            top: top,
            backgroundColor: 'black',
            width: this._imageWidth,
            height: this._imageHeight,
            transform: [{
              scale: scaleValue
            }, {
              rotate: rotationValue.interpolate({
                inputRange: [-3600, 3600],
                outputRange: ['-3600deg', '3600deg']
              })
            }]
          }}
          source={{uri: this.props.imageUrl}}
          resizeMode='contain'
        />
      </View>
    )
  }

  _getTransformScale (orientation: string) {
    const {width, height} = Dimensions.get('window')
    const isPortrait = getIsPortrait(orientation)
    const rotationWidth = isPortrait ? width : height
    const rotationHeight = isPortrait ? height : width
    const fitHorizontally = (this._imageWidth / this._imageHeight) > (rotationWidth / rotationHeight)
    return fitHorizontally ? (rotationWidth / this._imageWidth) : (rotationHeight / this._imageHeight)
  }

  changeOrientation (orientation, animated = false) {
    if (this.state.orientation !== orientation) {
      const startRot = getRotationInitialValue(this.state.orientation, orientation)
      if (startRot != null) {
        if (animated) {
          this._animateRotation = true
          this.state.rotationValue.setValue(startRot)
        }
        else {
          this._animateRotation = false
          this.state.rotationValue.setValue(0)
          this.state.scaleValue.setValue(this._getTransformScale(orientation))
        }
        this.setState({orientation})
      }
    }
  }
}

function getIsPortrait (orientation: string): boolean {
  return orientation === 'PORTRAIT' || orientation === 'PORTRAITUPSIDEDOWN'
}

function getRotationInitialValue (oldOrientation: string, newOrientation: string): boolean {
  if (oldOrientation === 'PORTRAIT') {
    if (newOrientation === 'LANDSCAPE-LEFT') {
      return -90
    } else if (newOrientation === 'LANDSCAPE-RIGHT') {
      return 90
    } else if (newOrientation === 'PORTRAITUPSIDEDOWN') {
      return 180
    }
  } else if (oldOrientation === 'LANDSCAPE-LEFT') {
    if (newOrientation === 'PORTRAIT') {
      return 90
    } else if (newOrientation === 'LANDSCAPE-RIGHT') {
      return 180
    } else if (newOrientation === 'PORTRAITUPSIDEDOWN') {
      return -90
    }
  } else if (oldOrientation === 'LANDSCAPE-RIGHT') {
    if (newOrientation === 'PORTRAIT') {
      return -90
    } else if (newOrientation === 'LANDSCAPE-LEFT') {
      return 180
    } else if (newOrientation === 'PORTRAITUPSIDEDOWN') {
      return 90
    }
  } else if (oldOrientation === 'PORTRAITUPSIDEDOWN') {
    if (newOrientation === 'PORTRAIT') {
      return 180
    } else if (newOrientation === 'LANDSCAPE-LEFT') {
      return 90
    } else if (newOrientation === 'LANDSCAPE-RIGHT') {
      return -90
    }
  }
  return null
}
