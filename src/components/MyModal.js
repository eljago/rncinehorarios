'use strict'

import React, {PropTypes} from 'react'
import {
  Modal,
  StatusBar,
  ScrollView
} from 'react-native'


export default class MyModal extends React.Component {
  static propTypes = {
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      backgroundColorAlpha: 1
    }
  }

  render () {
    return (
      <Modal
        animationType={"fade"}
        transparent={false}
        visible={this.state.visible}
        onRequestClose={this.close.bind(this)}
      >
        <StatusBar hidden={true}/>
        <ScrollView
          style={{
            backgroundColor: 'black',
            flex: 1,
            opacity: this.state.backgroundColorAlpha
          }}
          contentContainerStyle={{
            flex: 1,
            backgroundColor: 'black'
          }}
          ref={(comp) => { this._scrollView = comp }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onScroll={this._onScroll.bind(this)}
          scrollEventThrottle={8}
        >
          {this.props.children}
        </ScrollView>
      </Modal>
    )
  }


  _onScroll (e) {
    const offset = Math.abs(e.nativeEvent.contentOffset.y)
    if (offset >= 80) {
      this._onClose()
    }
    else {
      this.setState({backgroundColorAlpha: 1 - (offset / 80)})
    }
  }

  close () {
    if (this.state.visible === true) {
      this.setState({visible: false})
    }
    this.props.onClose()
  }

  open () {
    this.setState({
      visible: true,
      backgroundColorAlpha: 1
    })
    this.props.onOpen()
  }
}