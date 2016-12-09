// @flow
'use strict'

import React, { PropTypes } from 'react'
import {
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
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

    this._index = parseInt(props.index)

    this.state = {
      orientation: Orientation.getInitialOrientation(),
    }
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
    Orientation.addSpecificOrientationListener(this._orientationChanged.bind(this))
  }

  componentWillUnmount () {
    Orientation.removeSpecificOrientationListener(this._orientationChanged.bind(this))
    Orientation.unlockAllOrientations()
  }

  render () {
    const {width, height} = Dimensions.get('window')
    const isPortrait = this._isPortrait()
    const imageCount = this.props.images.length
    return (
      <ScrollView
        style={styles.scrollView}
        ref={(scrollView) => { this._scrollView = scrollView }}
        horizontal={this._isPortrait()}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onScroll={this._onScroll.bind(this)}
        scrollEventThrottle={8}
        contentContainerStyle={[styles.scrollContent, {
          width: isPortrait ? (width * imageCount) : width,
          height: isPortrait ? height : (height * imageCount)
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

    return this.props.images.map((image, index) => {
      return (
        <PhotoBrowserImage
          key={image.image_id}
          ref={`image_${index}`}
          index={index}
          imageUrl={getImageVersion(image.image)}
          imageWidth={image.width}
          imageHeight={image.height}      
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
