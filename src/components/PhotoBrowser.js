// @flow
'use strict'

import React, { PropTypes } from 'react'
import {
  ListView,
  Dimensions,
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
  StyleSheet
} from 'react-native'

import Orientation from 'react-native-orientation'
import {getImageVersion} from '../utils/ImageHelper'
import PhotoBrowserImage from './PhotoBrowserImage'
import PhotoBrowserHeader from './PhotoBrowserHeader'

export default class PhotoBrowser extends React.Component {
  static propTypes = {
    images: PropTypes.array,
    onOpen: PropTypes.func,
    onClose: PropTypes.func
  };
  // Where listView's cells refs are kept. Used to change orientation after rotation
  _rows = {}

  constructor (props) {
    super(props)
    for (let index = 0; index < props.images.length; index++) {
      props.images[index].index = index
    }
    const orientation = Orientation.getInitialOrientation()
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

    this.state = {
      visible: false,
      headerVisible: false,
      page: 0,
      dataSource: ds.cloneWithRows(props.images),
      orientation: orientation != null ? orientation : 'PORTRAIT',
      rotationValue: new Animated.Value(0)
    }
  }

  componentWillMount () {
    const orientation = Orientation.getInitialOrientation()
    this.setState({
      orientation: orientation ? orientation : 'PORTRAIT'
    })
  }

  componentDidMount () {
    Orientation.addSpecificOrientationListener(this._orientationChanged.bind(this))
  }

  componentWillUnmount () {
    Orientation.removeSpecificOrientationListener(this._orientationChanged.bind(this))
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.visible) {
      if (this.state.orientation !== prevState.orientation) {
        this._changeImagesOrientation(this.state.orientation)
      }
      if (prevState.visible !== this.state.visible && this.state.page !== prevState.page) {
        this._scrollToIndex(this.state.page)
      }
    }
  }

  render () {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.visible}
        onRequestClose={() => {alert("Modal has been closed.")}}
      >
        <StatusBar hidden={true}/>
        <ListView
          dataSource={this.state.dataSource}
          ref={(comp) => { this._scrollView = comp }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={8}
          initialListSize={1}
          renderRow={this._renderRow.bind(this)}
          style={[styles.listView, getListViewOrientationStyles(this.state.orientation)]}
          contentContainerStyle={styles.listViewContentStyle}
          onScroll={this._onScroll.bind(this)}
        />
        <PhotoBrowserHeader
          numberOfImages={this.props.images.length}
          page={this.state.page}
          headerVisible={this.state.headerVisible}
          onClose={this._onClose.bind(this)}
        />
      </Modal>
    )
  }

  _onScroll (e) {
    const page = this._getCurrentIndex()
    if (this.state.page !== page) {
      this.setState({page})
    }
  }

  _scrollToIndex (index, animated = false) {
    if (this.state.visible) {
      const pageWidth = this._getDimensions().width
      this._scrollView.scrollTo({x: pageWidth * index, animated: animated})
    }
  }

  _orientationChanged (orientation: string) {
    if ([
      'PORTRAIT',
      'PORTRAITUPSIDEDOWN',
      'LANDSCAPE-RIGHT',
      'LANDSCAPE-LEFT'
    ].includes(orientation)) {
      if (this.state.orientation !== orientation) {
        this.setState({orientation})
      }
    }
  }

  _getCurrentIndex () {
    if (this._scrollView) {
      const pageWidth = this._getDimensions().width
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
        onPress={this._onPressImage.bind(this)}
        getDimensions={this._getDimensions.bind(this)}
      />
    )
  }

  _getDimensions () {
    return getDimensions(this.state.orientation)
  }

  _onPressImage () {
    this.setState({headerVisible: !this.state.headerVisible})
  }

  _onClose () {
    if (this.state.visible === true) {
      this.setState({visible: false})
    }
    this.props.onClose()
  }

  _changeImagesOrientation(newOrientation) {
    if (this._scrollView) {
      this._scrollToIndex(this.state.page)
      for (let index = 0; index < this.props.images.length; index++) {
        const rowView = this._rows[index]
        if (rowView) {
          rowView.changeOrientation(newOrientation, this.state.page === index)
        }
      }
    }
  }

  open (page) {
    this.setState({
      visible: true,
      headerVisible: false,
      page: page
    })
  }
}

const styles = StyleSheet.create({
  listView: {
    backgroundColor: 'black',
    alignSelf: 'center'
  },
  listViewContentStyle: {
    backgroundColor: 'black',
    alignItems: 'center'
  }
})

function isPortrait (orientation) {
  return orientation === 'PORTRAIT' || orientation === 'PORTRAITUPSIDEDOWN'
}

function getDimensions (orientation) {
  const {width, height} = Dimensions.get('window')
  const portrait = isPortrait(orientation)
  const bigger = width > height ? width : height
  const smaller = width > height ? smaller : width
  return {
    width: portrait ? smaller : bigger,
    height: portrait ? bigger : smaller
  }
}

function getListViewOrientationStyles (orientation) {
    const dimensions = getDimensions(orientation)
    if (orientation === 'PORTRAIT') {
      return {...dimensions, transform: [{rotate: '0deg'}]}
    }
    if (orientation === 'PORTRAITUPSIDEDOWN') {
      return {...dimensions, transform: [{rotate: '180deg'}]}
    }
    if (orientation === 'LANDSCAPE-LEFT') {
      return {...dimensions, transform: [{rotate: '90deg'}]}
    }
    if (orientation === 'LANDSCAPE-RIGHT') {
      return {...dimensions, transform: [{rotate: '-90deg'}]}
    }
    return null
  }