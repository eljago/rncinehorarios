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
import PhotoBrowserImage from './PhotoBrowserImage'

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
    }
    _.bindAll(this, ['_orientationChanged', '_onScroll'])
  }

  componentWillMount () {
    var initial = Orientation.getInitialOrientation()
    this._orientationChanged(initial)
  }

  _scrollToIndex(index, animated = false) {
    const {width, height} = Dimensions.get('window')
    const axis = this._isPortrait() ? 'x' : 'y';
    const amount = this._isPortrait() ? width : height;
    this._scrollView.scrollTo({[axis]: amount * index, animated: animated})
  }

  componentDidMount () {
    this._scrollToIndex(this._index);
    Orientation.lockToPortrait()
    Orientation.addSpecificOrientationListener(this._orientationChanged)
  }

  componentWillUnmount () {
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

  _onScroll (e) {
    const event = e.nativeEvent
    const layoutHorizontal = this._isPortrait()
      ? event.layoutMeasurement.width : event.layoutMeasurement.height
    const contentOffset = this._isPortrait()
      ? event.contentOffset.x : event.contentOffset.y
    this._index = Math.floor((contentOffset + 0.5 * layoutHorizontal) / layoutHorizontal)
  }

  _orientationChanged (orientation) {
    this.setState({orientation})
    if (this._scrollView) {
      this._scrollToIndex(this._index);

      for (var i = 0; i < this.props.images.length; i++) {
        this.refs[`image_${i}`].changeOrientation(orientation, this._index === i);
      }
    }
  }

  _isPortrait () {
    return this.state.orientation === 'PORTRAIT' || this.state.orientation === 'PORTRAITUPSIDEDOWN'
  }

  _getImageViews () {
    const {width, height} = Dimensions.get('window')
    const isPortrait = this._isPortrait()

    return this.props.images.map((image, index) => {
      const imageWidth = image.width / this._pixelRatio
      const imageHeight = image.height / this._pixelRatio
      const left = isPortrait ? width * index - imageWidth / 2 + width / 2
        : width / 2 - imageWidth / 2
      const top = isPortrait ? height / 2 - imageHeight / 2
        : height * index - imageHeight / 2 + height / 2
      
      return (
        <PhotoBrowserImage
          key={image.image_id}
          ref={`image_${index}`}
          imageUrl={getImageVersion(image.image)}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          style={{
            position: 'absolute',
            left: left,
            top: top
          }}         
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
  }
})
