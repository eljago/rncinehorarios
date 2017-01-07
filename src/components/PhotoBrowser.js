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
    this._rows = {}
    for (let index = 0; index < props.images.length; index++) {
      props.images[index].index = index
    }
    const orientation = Orientation.getInitialOrientation()
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this._headerVisible = false
    this.state = {
      dataSource: ds.cloneWithRows(props.images),
      orientation: orientation != null ? orientation : 'PORTRAIT',
      rotationValue: new Animated.Value(0),
      page: parseInt(props.index),
      headerOpacity: new Animated.Value(this._headerVisible ? 1 : 0)
    }
  }

  componentWillMount () {
    const orientation = Orientation.getInitialOrientation()
    this.setState({orientation: orientation != null ? orientation : 'PORTRAIT'})
  }

  componentDidMount () {
    this._scrollToIndex(this.props.index)
    Orientation.addSpecificOrientationListener(this._orientationChanged.bind(this))
  }

  componentWillUnmount () {
    Orientation.removeSpecificOrientationListener(this._orientationChanged.bind(this))
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.orientation !== prevState.orientation) {
      if (this._scrollView) {
        this._scrollToIndex(this.state.page)
        for (let index = 0; index < this.props.images.length; index++) {
          const rowView = this._rows[index]
          if (rowView) {
            rowView.changeOrientation(this.state.orientation, this.state.page === index)
          }
        }
      }
    }
  }

  render () {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={true}
        onRequestClose={() => {alert("Modal has been closed.")}}
      >
        <ListView
          dataSource={this.state.dataSource}
          ref={(scrollView) => { this._scrollView = scrollView }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={8}
          initialListSize={1}
          renderRow={this._renderRow.bind(this)}
          style={[this._getListViewOrientationStyles(), {
            backgroundColor: 'black',
            alignSelf: 'center'
          }]}
          contentContainerStyle={{
            backgroundColor: 'black',
            alignItems: 'center'
          }}
          onScroll={this._onScroll.bind(this)}
        />
        <Animated.Text
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            padding: 10,
            paddingTop: 15,
            textAlign: 'center',
            opacity: this.state.headerOpacity,
            width: this._getDimensions().width,
            transform: [{
              rotate: this._isPortrait() ? '0deg' : '90deg'
            }]
          }}
        >
          {`${this.state.page + 1} / ${this.props.images.length}`}
        </Animated.Text>
      </Modal>
    )
  }

  _isPortrait () {
    return this.state.orientation === 'PORTRAIT' || this.state.orientation === 'PORTRAITUPSIDEDOWN'
  }
  _getDimensions () {
    const {width, height} = Dimensions.get('window')
    const isPortrait = this._isPortrait()
    const bigger = width > height ? width : height
    const smaller = width > height ? smaller : width
    return {
      width: isPortrait ? smaller : bigger,
      height: isPortrait ? bigger : smaller
    }
  }

  _onScroll (e) {
    const page = this._getCurrentIndex()
    if (this.state.page !== page) {
      this.setState({page})
    }
  }

  _scrollToIndex (index, animated = false) {
    const pageWidth = this._getDimensions().width
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

  _onPressImage () {
    this._headerVisible = !this._headerVisible
    Animated.spring(
      this.state.headerOpacity,
      {
        toValue: this._headerVisible ? 1 : 0,
        tension: 50,
        friction: 10
      }
    ).start()
  }

  _getListViewOrientationStyles () {
    const {orientation} = this.state
    const dimensions = this._getDimensions()
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
}
