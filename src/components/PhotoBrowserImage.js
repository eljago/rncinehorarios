// @flow
'use strict'

import React, {PropTypes} from 'react'
import {
  Dimensions,
  Animated,
  PixelRatio,
  TouchableOpacity
} from 'react-native'
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';

export default class PhotoBrowserImage extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    imageUrl: PropTypes.string,
    imageWidth: PropTypes.number,
    imageHeight: PropTypes.number,
    initialOrientation: PropTypes.string,
    onPress: PropTypes.func,
    getDimensions: PropTypes.func
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

  componentDidUpdate (prevProps, prevState) {
    if (this.state.orientation !== prevState.orientation) {
      if (this._animateRotation) {
        Animated.spring(
          this.state.rotationValue,
          {
            toValue: 0,
            tension: 50,
            friction: 10
          }
        ).start()
        Animated.spring(
          this.state.scaleValue,
          {
            toValue: this._getTransformScale(this.state.orientation),
            tension: 50,
            friction: 10
          }
        ).start()
      }
    }
  }

  render () {
    const {width, height} = this.props.getDimensions()
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'black',
          width: width,
          height: height,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onPress={this.props.onPress}
        activeOpacity={1}
      >
        <Animated.View
          style={{
            position: 'absolute',
            left: (width / 2) - (this._imageWidth / 2),
            top: (height / 2) - (this._imageHeight / 2),
            backgroundColor: 'black',
            width: this._imageWidth,
            height: this._imageHeight,
            transform: [{
              scale: this.state.scaleValue
            }, {
              rotate: this.state.rotationValue.interpolate({
                inputRange: [-3600, 3600],
                outputRange: ['-3600deg', '3600deg']
              })
            }]
          }}
        >
          <Image
            indicator={ProgressBar}
            indicatorProps={{
              color: 'white',
              width: 100,
              height: 5
            }}
            style={{flex: 1}}
            source={{uri: this.props.imageUrl}}
            resizeMode='contain'
          />
        </Animated.View>
      </TouchableOpacity>
    )
  }

  _getTransformScale (orientation: string) {
    const {width, height} = this.props.getDimensions()
    const fitHorizontally = (this._imageWidth / this._imageHeight) > (width / height)
    return fitHorizontally ? (width / this._imageWidth) : (height / this._imageHeight)
  }

  changeOrientation (orientation, animated = false) {
    if (this.state.orientation !== orientation) {
      const startRot = getRotationInitialValue(this.state.orientation, orientation)
      if (startRot != null) {
        if (animated) {
          this._animateRotation = true
          this.state.rotationValue.setValue(startRot)
        } else {
          this._animateRotation = false
          this.state.rotationValue.setValue(0)
          this.state.scaleValue.setValue(this._getTransformScale(orientation))
        }
        this.setState({orientation})
      }
    }
  }
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
