// @flow
'use strict'

import React, { PropTypes } from 'react'
import {
  ListView,
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
    index: PropTypes.string
  };
  static defaultProps = {
    index: '0'
  };

  constructor (props) {
    super(props)
    this._index = parseInt(props.index)
    this._rows = {}
    for (let index = 0; index < props.images.length; index++) {
      props.images[index].index = index
    }

    const orientation = Orientation.getInitialOrientation()
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows(props.images),
      orientation: orientation ? orientation : 'PORTRAIT'
    }
  }

  componentWillMount () {
    const orientation = Orientation.getInitialOrientation()
    this.setState({orientation: orientation ? orientation : 'PORTRAIT'})
  }

  _scrollToIndex (index, animated = false) {
    const {width, height} = Dimensions.get('window')
    const axis = this._isPortrait() ? 'x' : 'y'
    const amount = this._isPortrait() ? width : height
    this._scrollView.scrollTo({[axis]: amount * index, animated: animated})
  }

  componentDidMount () {
    this._scrollToIndex(this._index)
    Orientation.lockToPortrait()
    Orientation.addSpecificOrientationListener(this._orientationChanged.bind(this))
  }

  componentWillUnmount () {
    Orientation.removeSpecificOrientationListener(this._orientationChanged.bind(this))
    Orientation.unlockAllOrientations()
  }

  render () {
    return (
      <ListView
        dataSource={this.state.dataSource}
        style={styles.scrollView}
        ref={(scrollView) => { this._scrollView = scrollView }}
        horizontal={this._isPortrait()}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onScroll={this._onScroll.bind(this)}
        scrollEventThrottle={8}
        scrollRenderAheadDistance={100}
        renderRow={this._renderRow.bind(this)}
      />
    )
  }

  _isPortrait () {
    return this.state.orientation === 'PORTRAIT' || this.state.orientation === 'PORTRAITUPSIDEDOWN'
  }

  _orientationChanged (orientation) {
    if (['PORTRAIT', 'PORTRAITUPSIDEDOWN', 'LANDSCAPE-RIGHT', 'LANDSCAPE-LEFT'].includes(orientation)) {
      if (this.state.orientation !== orientation) {
        this.setState({orientation})
        if (this._scrollView) {
          this._scrollToIndex(this._index)
          for (let index = 0; index < this.props.images.length; index++) {
            const rowView = this._rows[index]
            console.log(rowView);
            if (rowView && rowView.getOrientation() !== orientation) {
              rowView.changeOrientation(orientation, this._index === index)
            }
          }
        }
      }
    }
  }

  _onScroll (e) {
    const {layoutMeasurement, contentOffset} = e.nativeEvent
    if (layoutMeasurement.width === 0 && layoutMeasurement.height === 0) return

    const layoutHorizontal = this._isPortrait() ? layoutMeasurement.width : layoutMeasurement.height
    const neededContentOffset = this._isPortrait() ? contentOffset.x : contentOffset.y

    this._index = Math.floor((neededContentOffset + 0.5 * layoutHorizontal) / layoutHorizontal)
  }

  _renderRow (image: string, sectionID: number, rowID: number) {
    return (
      <PhotoBrowserImage
        key={rowID}
        ref={(row) => this._rows[image.index] = row}
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
