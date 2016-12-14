// @flow
'use strict'

import React, { PropTypes } from 'react'
import {
  ListView,
  StyleSheet,
  Dimensions
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
    this._rows = {}
    for (let index = 0; index < props.images.length; index++) {
      props.images[index].index = index
    }
    const orientation = Orientation.getInitialOrientation()
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows(props.images),
      orientation: orientation != null ? orientation : 'PORTRAIT'
    }
  }

  componentWillMount () {
    const orientation = Orientation.getInitialOrientation()
    this.setState({orientation: orientation != null ? orientation : 'PORTRAIT'})
  }

  componentDidMount () {
    this._scrollToIndex(this.props.index)
    Orientation.lockToPortrait()
    Orientation.addSpecificOrientationListener(this._orientationChanged.bind(this))
  }

  componentWillUnmount () {
    Orientation.removeSpecificOrientationListener(this._orientationChanged.bind(this))
    Orientation.unlockAllOrientations()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.orientation !== prevState.orientation) {
      if (this._scrollView) {
        this._scrollToIndex(this._index) // use index saved before changing orientation
        for (let index = 0; index < this.props.images.length; index++) {
          const rowView = this._rows[index]
          if (rowView) {
            rowView.changeOrientation(this.state.orientation, this._index === index)
          }
        }
      }
    }
  }

  render () {
    return (
      <ListView
        dataSource={this.state.dataSource}
        ref={(scrollView) => { this._scrollView = scrollView }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={8}
        renderRow={this._renderRow.bind(this)}
        style={[{
          backgroundColor: 'black',
          alignSelf: 'center'
        }, getListViewOrientationStyles(this.state.orientation)]}
        contentContainerStyle={{
          backgroundColor: 'black',
          alignItems: 'center'
        }}
      />
    )
  }

  _isPortrait () {
    return this.state.orientation === 'PORTRAIT' || this.state.orientation === 'PORTRAITUPSIDEDOWN'
  }

  _scrollToIndex (index, animated = false) {
    const {width, height} = Dimensions.get('window')
    const pageWidth = this._isPortrait() ? width : height
    this._scrollView.scrollTo({x: pageWidth * index, animated: animated})
  }

  _orientationChanged (orientation: string) {
    if ([
      'PORTRAIT',
      'PORTRAITUPSIDEDOWN',
      'LANDSCAPE-RIGHT',
      'LANDSCAPE-LEFT'
    ].includes(orientation)) {
      if (this.state.orientation !== orientation) {
        this._index = this._getCurrentIndex() // save index before changing orientation
        this.setState({orientation})
      }
    }
  }

  _getCurrentIndex() {
    if (this._scrollView) {
      const {width, height} = Dimensions.get('window')
      const pageWidth = this._isPortrait() ? width : height
      const {offset} = this._scrollView.scrollProperties
      return Math.floor((offset + 0.5 * pageWidth) / pageWidth)
    }
    return this.props.index
  }

  _renderRow (image: string, sectionID: number, rowID: number) {
    return (
      <PhotoBrowserImage
        key={rowID}
        ref={(row) => { this._rows[image.index] = row }}
        imageUrl={getImageVersion(image.image)}
        imageWidth={image.width}
        imageHeight={image.height}
        initialOrientation={this.state.orientation}
      />
    )
  }
}

function getListViewOrientationStyles (orientation) {
  const {width, height} = Dimensions.get('window')
  const orientationStyles = orientation === 'PORTRAIT' || orientation === 'PORTRAITUPSIDEDOWN'
    ? {width: width, height: height} : {width: height, height: width}
  if (orientation === 'PORTRAIT') {
    return {...orientationStyles, transform: [{rotate: '0deg'}]}
  }
  if (orientation === 'PORTRAITUPSIDEDOWN') {
    return {...orientationStyles, transform: [{rotate: '180deg'}]}
  }
  if (orientation === 'LANDSCAPE-LEFT') {
    return {...orientationStyles, transform: [{rotate: '90deg'}]}
  }
  if (orientation === 'LANDSCAPE-RIGHT') {
    return {...orientationStyles, transform: [{rotate: '-90deg'}]}
  }
  return null
}