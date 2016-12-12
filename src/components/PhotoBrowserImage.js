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
      rotationValue: new Animated.Value(getRotateValue(initialOrientation)),
      scaleValue: new Animated.Value(this._getTransformScale(initialOrientation))
    }
  }

  render () {
    const {width, height} = Dimensions.get('window')
    const {scaleValue, rotationValue, orientation} = this.state

    const left = (width / 2) - (this._imageWidth / 2)
    const top = (height / 2) - (this._imageHeight / 2)

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
            width: this._imageWidth,
            height: this._imageHeight,
            transform: [{
              scale: scaleValue
            }, {
              rotate: rotationValue.interpolate({
                inputRange: [-36000, 36000],
                outputRange: ['-36000deg', '36000deg']
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
      const rotTransition = getRotTransition(this.state.orientation, orientation)
      if (rotTransition != null) {
        const nextScale = this._getTransformScale(orientation)
        this.setState({orientation})

        if (animated) {
          this.state.rotationValue.setValue(rotTransition.prevRot)
          Animated.spring(
            this.state.rotationValue,
            {
              toValue: rotTransition.nextRot,
              tension: 10,
              friction: 5
            }
          ).start()
          Animated.spring(
            this.state.scaleValue,
            {
              toValue: nextScale
            }
          ).start()
        } else {
          this.state.rotationValue.setValue(rotTransition.nextRot)
          this.state.scaleValue.setValue(nextScale)
        }
      }
    }
  }
}

function getIsPortrait (orientation: string): boolean {
  return orientation === 'PORTRAIT' || orientation === 'PORTRAITUPSIDEDOWN'
}

function getRotateValue (orientation) {
  if (orientation === 'PORTRAIT') {
    return 0
  }
  if (orientation === 'PORTRAITUPSIDEDOWN') {
    return 180
  }
  if (orientation === 'LANDSCAPE-LEFT') {
    return -90
  }
  if (orientation === 'LANDSCAPE-RIGHT') {
    return 90
  }
  return 0
}

function getRotTransition (oldOrientation: string, newOrientation: string): boolean {
  console.log(oldOrientation);
  console.log(newOrientation);
  if (oldOrientation === 'PORTRAIT') {
    if (newOrientation === 'LANDSCAPE-LEFT') {
      return {prevRot: 0, nextRot: 90}
    } else if (newOrientation === 'LANDSCAPE-RIGHT') {
      return {prevRot: 180, nextRot: 90}
    } else if (newOrientation === 'PORTRAITUPSIDEDOWN') {
      return {prevRot: 180, nextRot: 0}
    }
  } else if (oldOrientation === 'LANDSCAPE-LEFT') {
    if (newOrientation === 'PORTRAIT') {
      return {prevRot: 90, nextRot: 0}
    } else if (newOrientation === 'LANDSCAPE-RIGHT') {
      return {prevRot: -90, nextRot: 90}
    } else if (newOrientation === 'PORTRAITUPSIDEDOWN') {
      return {prevRot: -90, nextRot: 0}
    }
  } else if (oldOrientation === 'LANDSCAPE-RIGHT') {
    if (newOrientation === 'PORTRAIT') {
      return {prevRot: -90, nextRot: 0}
    } else if (newOrientation === 'LANDSCAPE-LEFT') {
      return {prevRot: -90, nextRot: 90}
    } else if (newOrientation === 'PORTRAITUPSIDEDOWN') {
      return {prevRot: 90, nextRot: 0}
    }
  } else if (oldOrientation === 'PORTRAITUPSIDEDOWN') {
    if (newOrientation === 'PORTRAIT') {
      return {prevRot: 180, nextRot: 0}
    } else if (newOrientation === 'LANDSCAPE-LEFT') {
      return {prevRot: 180, nextRot: 90}
    } else if (newOrientation === 'LANDSCAPE-RIGHT') {
      return {prevRot: 0, nextRot: 90}
    }
  }
  return null
}
