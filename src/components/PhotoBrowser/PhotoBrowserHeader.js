//@flow
'use strict'

import React, {PropTypes} from 'react'
import {
  Animated,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  NativeModules
} from 'react-native'
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;

type Props = {
  initialOrientation: string,
  text: string,
  onClose: () => void,
  visible: boolean,
  getDimensions: () => {
    width: number,
    height: number,
    bigger: number,
    smaller: number
  },
  showCloseButton: boolean,
  position: string
};


export default class PhotoBrowserHeader extends React.Component {
  props: Props
  static defaultProps: {
    showCloseButton: boolean,
    position: string
  }
  state: {
    orientation: 'PORTRAIT' | 'PORTRAITUPSIDEDOWN' | 'LANDSCAPE-LEFT' | 'LANDSCAPE-RIGHT',
    headerOpacity: Animated.Value,
    rotationValue: string
  }

  static defaultProps = {
    showCloseButton: false,
    position: 'top'
  }

  constructor(props: Object) {
    super(props),
    this.state = {
      orientation: props.initialOrientation,
      headerOpacity: new Animated.Value(0),
      rotationValue: '0deg'
    }
  }

  componentDidUpdate (prevProps: Props, prevState: Object) {
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
    const {width, height} = this.props.getDimensions()
    return (
      <Animated.View style={[styles.containerView, {
        opacity: this.state.headerOpacity,
        transform: [{rotate: this.state.rotationValue}],
        [this.props.position]: height > width ? 0 : (width - height - STATUSBAR_HEIGHT) / 2
      }]}>
        <Text style={styles.text}>
          {this.props.text}
        </Text>
        {this._getCloseButton()}
      </Animated.View>
    )
  }

  _getCloseButton () {
    if (this.props.showCloseButton) {
      return(
        <TouchableOpacity
          onPress={this.props.onClose}
          style={styles.closeButton}
          >
          <Text style={styles.textClose}>
            Cerrar
          </Text>
        </TouchableOpacity>
      )
    }
  }
}

const styles = StyleSheet.create({
  containerView: {
    position: 'absolute',
    left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    height: 60
  },
  text: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 16
  },
  closeButton: {
    paddingRight: 10 + STATUSBAR_HEIGHT,
    paddingLeft: 10,
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textClose: {
    fontSize: 16,
    color: 'white'
  }
})
