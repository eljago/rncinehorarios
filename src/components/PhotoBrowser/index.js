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
  StyleSheet,
  ScrollView
} from 'react-native'

import Orientation from 'react-native-orientation'
import {getImageVersion} from '../../utils/ImageHelper'
import PhotoBrowserImage from './PhotoBrowserImage'
import PhotoBrowserHeader from './PhotoBrowserHeader'

import {reportEvent} from '../../utils/Analytics'

type Orientations = 'PORTRAIT' | 'PORTRAITUPSIDEDOWN' | 'LANDSCAPE-LEFT' | 'LANDSCAPE-RIGHT'

type Props = {
  data: Array<Object>,
  onOpen: () => void,
  onClose: () => void,
  allowedOrientations: Array<Orientations>,
  initialOrientation: Orientations,
  hideTopHeader: boolean,
  hideBottomHeader: boolean
}

type State = {
  visible: boolean,
  headerVisible: boolean,
  page: number,
  dataSource: ListView.DataSource,
  orientation: Orientations,
  rotationValue: Animated.Value,
  backgroundColorAlpha: number
}

export default class PhotoBrowser extends React.Component {
  static defaultProps: {
    allowedOrientations: Array<Orientations>,
    initialOrientation: Orientations,
    hideTopHeader: boolean,
    hideBottomHeader: boolean
  }
  _rows: Object
  _scrollView: React.Component<ScrollView, Object, Object>
  _listView: React.Component<ListView, Object, Object>
  static defaultProps = {
    allowedOrientations: [
      'PORTRAIT',
      'PORTRAITUPSIDEDOWN',
      'LANDSCAPE-RIGHT',
      'LANDSCAPE-LEFT'
    ],
    initialOrientation: 'PORTRAIT',
    hideTopHeader: false,
    hideBottomHeader: false
  }
  // Where listView's cells refs are kept. Used to change orientation after rotation
  _rows = {}
  state: State

  constructor (props: Props) {
    super(props)
    for (let index = 0; index < props.data.length; index++) {
      props.data[index].index = index
    }
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      visible: false,
      headerVisible: false,
      page: 0,
      dataSource: dataSource.cloneWithRows(props.data),
      orientation: props.initialOrientation,
      rotationValue: new Animated.Value(0),
      backgroundColorAlpha: 1
    }
  }

  componentWillMount () {

  }

  componentDidMount () {
    Orientation.addSpecificOrientationListener(this._orientationChanged.bind(this))
  }

  componentWillUnmount () {
    Orientation.removeSpecificOrientationListener(this._orientationChanged.bind(this))
  }

  componentDidUpdate (prevProps: Props, prevState: State) {
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
    const {width, height} = this._getDimensions()
    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={this.state.visible}
        onRequestClose={this._onClose.bind(this)}
      >
        <StatusBar hidden={true}/>
        <ScrollView
          style={[styles.scrollView, getListViewOrientationStyles(this.state.orientation), {
            backgroundColor: 'black',
            opacity: this.state.backgroundColorAlpha
          }]}
          contentContainerStyle={[styles.scrollViewContentStyle, {
            width: width,
            height: height
          }]}
          ref={(comp) => { this._scrollView = comp }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onScroll={this._onScrollVertical.bind(this)}
          scrollEventThrottle={8}
        >
          <ListView
            style={styles.listView}
            contentContainerStyle={styles.listViewContentStyle}
            dataSource={this.state.dataSource}
            ref={(comp) => { this._listView = comp }}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={8}
            initialListSize={1}
            renderRow={this._renderRow.bind(this)}
            onScroll={this._onScroll.bind(this)}
          />
          {this._getTopHeader()}
          {this._getBottomHeader()}
        </ScrollView>
      </Modal>
    )
  }

  _getTopHeader() {
    if (this.props.hideTopHeader) {
      return null
    }
    return (
      <PhotoBrowserHeader
        initialOrientation={this.state.orientation}
        text={`${this.state.page + 1} / ${this.props.data.length}`}
        visible={this.state.headerVisible}
        onClose={this._onClose.bind(this)}
        getDimensions={this._getDimensions.bind(this)}
        position='top'
        showCloseButton
      />
    )
  }

  _getBottomHeader () {
    if (this.props.hideBottomHeader) {
      return null
    }
    return (
      <PhotoBrowserHeader
        initialOrientation={this.state.orientation}
        text={this.props.data[this.state.page].text}
        visible={this.state.headerVisible}
        onClose={this._onClose.bind(this)}
        getDimensions={this._getDimensions.bind(this)}
        position='bottom'
      />
    )
  }

  _onScrollVertical (e) {
    const offset = Math.abs(e.nativeEvent.contentOffset.y)
    if (offset >= 80) {
      this._onClose()
    }
    else {
      this.setState({backgroundColorAlpha: 1- (offset / 80)})
    }
  }

  _onScroll (e) {
    const page = this._getCurrentIndex()
    if (this.state.page !== page) {
      this.setState({page})
    }
  }

  _scrollToIndex (index: number, animated: boolean = false) {
    if (this.state.visible) {
      const pageWidth = this._getDimensions().width
      this._listView.scrollTo({x: pageWidth * index, animated: animated})
    }
  }

  _orientationChanged (orientation: Orientations) {
    if (this.props.allowedOrientations.includes(orientation)) {
      if (this.state.orientation !== orientation) {
        this.setState({orientation})
      }
    }
  }

  _getCurrentIndex () {
    const pageWidth = this._getDimensions().width
    const {offset} = this._listView.scrollProperties
    return Math.floor((offset + 0.5 * pageWidth) / pageWidth)
  }

  _renderRow (dataObject: Object, sectionID: string, rowID: string) {
    const {image} = dataObject
    return (
      <PhotoBrowserImage
        key={rowID}
        ref={(row) => { this._rows[dataObject.index] = row }}
        imageUrl={image.url}
        imageWidth={image.width ? image.width : this._getDimensions().smaller}
        imageHeight={image.height ? image.height : this._getDimensions().bigger}
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
    reportEvent('PhotoBrowser', 'closed')
  }

  _changeImagesOrientation(newOrientation: Orientations) {
    if (this._listView) {
      this._scrollToIndex(this.state.page)
      for (let index = 0; index < this.props.data.length; index++) {
        const rowView = this._rows[index]
        if (rowView) {
          rowView.changeOrientation(newOrientation, this.state.page === index)
        }
      }
    }
  }

  open (page: number) {
    this.setState({
      visible: true,
      headerVisible: false,
      page: page,
      backgroundColorAlpha: 1
    })
    this.props.onOpen()
    reportEvent('PhotoBrowser', 'opened')
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'transparent',
    alignSelf: 'center'
  },
  scrollViewContentStyle: {
    flex: 1,
  },
  listView: {
    alignSelf: 'center'
  },
  listViewContentStyle: {
    alignItems: 'center'
  }
})

function isPortrait (orientation: Orientations) {
  return orientation === 'PORTRAIT' || orientation === 'PORTRAITUPSIDEDOWN'
}

function getDimensions (orientation: Orientations) {
  const {width, height} = Dimensions.get('window')
  const portrait = isPortrait(orientation)
  const bigger = width > height ? width : height
  const smaller = width > height ? smaller : width
  return {
    width: portrait ? smaller : bigger,
    height: portrait ? bigger : smaller,
    bigger: bigger,
    smaller: smaller
  }
}

function getListViewOrientationStyles (orientation: Orientations): Object | null {
    const {width, height} = getDimensions(orientation)
    let style = {width: width, height: height}
    if (orientation === 'PORTRAIT') {
      return {...style, transform: [{rotate: '0deg'}]}
    }
    if (orientation === 'PORTRAITUPSIDEDOWN') {
      return {...style, transform: [{rotate: '180deg'}]}
    }
    if (orientation === 'LANDSCAPE-LEFT') {
      return {...style, transform: [{rotate: '90deg'}]}
    }
    if (orientation === 'LANDSCAPE-RIGHT') {
      return {...style, transform: [{rotate: '-90deg'}]}
    }
    return null
  }
