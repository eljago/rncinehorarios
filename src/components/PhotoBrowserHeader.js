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
    numberOfImages: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    onClose: PropTypes.func,
    headerVisible: PropTypes.bool
  }

  constructor(props) {
    super(props),
    this.state = {
      headerOpacity: new Animated.Value(0)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    Animated.spring(
      this.state.headerOpacity,
      {
        toValue: this.props.headerVisible ? 1 : 0,
        tension: 50,
        friction: 10
      }
    ).start()
  }

  render () {
    return (
      <Animated.View style={[styles.containerView, {opacity: this.state.headerOpacity}]}>
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
    top: 0, left: 0, right: 0,
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