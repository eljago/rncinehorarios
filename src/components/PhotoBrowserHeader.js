'use strict'

import React, {PropTypes} from 'react'
import {
  Animated,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native'

export default class PhotoBrowserHeader extends React.Component {
  static propTypes = {
    initialOrientation: PropTypes.string,
    numberOfImages: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    getDimensions: PropTypes.func
  }

  constructor(props) {
    super(props),
    this.state = {
      orientation: props.initialOrientation,
      headerOpacity: new Animated.Value(0),
      rotationValue: '0deg'
    }
  }

  componentDidUpdate (prevProps, prevState) {
    Animated.spring(
      this.state.headerOpacity,
      {
        toValue: this.props.visible ? 1 : 0,
        tension: 50,
        friction: 10
      }
    ).start()
    if (this.state.orientation !== prevState.orientation) {
      if (this.state.orientation === 'PORTRAIT') {
        this.setState({rotationValue: '0deg'})
      }
      if (this.state.orientation === 'PORTRAITUPSIDEDOWN') {
        this.setState({rotationValue: '180deg'})
      }
      if (this.state.orientation === 'LANDSCAPE-LEFT') {
        this.setState({rotationValue: '90deg'})
      }
      if (this.state.orientation === 'LANDSCAPE-RIGHT') {
        this.setState({rotationValue: '-90deg'})
      }
    }
  }

  render () {
    const {width, height} = this.props.getDimensions()
    return (
      <Animated.View style={[styles.containerView, {
        opacity: this.state.headerOpacity,
        transform: [{rotate: this.state.rotationValue}],
        top: height > width ? 0 : (width - height) / 2
      }]}>
        <Text style={styles.textPages}>
          {`${this.props.page + 1} / ${this.props.numberOfImages}`}
        </Text>
        <TouchableOpacity
          onPress={this.props.onClose}
          style={styles.closeButton}
          >
          <Text style={styles.textClose}>
            Cerrar
          </Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  setVisible (visible) {
    Animated.spring(
      this.state.headerOpacity,
      {
        toValue: visible ? 1 : 0,
        tension: 50,
        friction: 10
      }
    ).start()
  }
}

const styles = StyleSheet.create({
  containerView: {
    position: 'absolute',
    left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50
  },
  textPages: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 16
  },
  closeButton: {
    paddingRight: 10,
    position: 'absolute',
    right: 0,
    top: 15
  },
  textClose: {
    fontSize: 16,
    color: 'white'
  }
})