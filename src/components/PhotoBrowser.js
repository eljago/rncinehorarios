// @flow
'use strict'

import React, { PropTypes } from 'react'
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native'

import Orientation from 'react-native-orientation'
import {getImageVersion} from '../utils/ImageHelper'
import PhotoBrowserImage from './PhotoBrowserImage'

export default class PhotoBrowser extends React.Component {
  static propTypes = {
    images: PropTypes.array,
    index: PropTypes.string,
    activeImages: PropTypes.number
  };
  static defaultProps = {
    index: '0',
    activeImages: 5
  };

  constructor (props) {
    super(props)

    this._index = parseInt(props.index)
    this.state = {
      orientation: Orientation.getInitialOrientation(),
      currentIndexes: this._getCurrentIndexes()
    }
  }

  componentWillMount () {
    var initial = Orientation.getInitialOrientation()
    this._orientationChanged(initial)
  }

  _scrollToIndex (index, animated = false) {
    const {width, height} = Dimensions.get('window')
    const axis = this._isPortrait() ? 'x' : 'y'
    const amount = this._isPortrait() ? width : height
    this._scrollView.scrollTo({[axis]: amount * index, animated: animated})
  }

  componentDidMount () {
    this._scrollToIndex(this._index)
    if (Platform.OS === 'ios') {
      Orientation.lockToPortrait()
    }
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
        {this._getImagesElements()}
      </ScrollView>
    )
  }

  _isPortrait () {
    return this.state.orientation === 'PORTRAIT' || this.state.orientation === 'PORTRAITUPSIDEDOWN'
  }

  _orientationChanged (orientation) {
    console.log(orientation);
    this.setState({orientation})
    if (this._scrollView) {
      this._scrollToIndex(this._index)

      for (let index of this.state.currentIndexes) {
        if (this.refs[`image_${index}`]) {
          this.refs[`image_${index}`].changeOrientation(orientation, this._index === index)
        }
      }
    }
  }

  _onScroll (e) {
    const {layoutMeasurement, contentOffset} = e.nativeEvent
    if (layoutMeasurement.width === 0 && layoutMeasurement.height === 0) return

    const layoutHorizontal = this._isPortrait() ? layoutMeasurement.width : layoutMeasurement.height
    const neededContentOffset = this._isPortrait() ? contentOffset.x : contentOffset.y

    const newIndex = Math.floor((neededContentOffset + 0.5 * layoutHorizontal) / layoutHorizontal)
    if (this._index !== newIndex) {
      this._index = newIndex
      const currentIndexes = this._getCurrentIndexes()
      if (currentIndexes !== this.state.currentIndexes) {
        this.setState({currentIndexes})
      }
    }
  }

  _getCurrentIndexes () {
    const {images, activeImages} = this.props
    const startIndex = Math.max(0, this._index - Math.floor(activeImages / 2))
    const finalIndex = Math.min(images.length - 1, this._index + Math.floor(activeImages / 2))
    let indexes = []
    for (let i = startIndex; i <= finalIndex; i++) {
      indexes.push(i)
    }
    return indexes
  }

  _getImagesElements () {
    return this.state.currentIndexes.map((index) => {
      return this._getImageElement(index)
    })
  }

  _getImageElement (index) {
    const image = this.props.images[index]
    return (
      <PhotoBrowserImage
        key={image.image_id}
        ref={`image_${index}`}
        index={index}
        imageUrl={getImageVersion(image.image)}
        imageWidth={image.width}
        imageHeight={image.height}
        initialOrientation={this.state.orientation}
      />
    )
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
