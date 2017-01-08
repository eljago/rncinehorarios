'use strict'

import React, {PropTypes} from 'react'
import {
  Animated,
  TouchableOpacity,
  Text
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
      <Animated.View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            opacity: this.state.headerOpacity,
            flexDirection: 'row',
            alignItems: 'center',
            height: 50
          }}
        >
          <Text style={{
            flex: 1,
            textAlign: 'center',
            color: 'white',
            fontSize: 16
          }}>
            {`${this.props.page + 1} / ${this.props.numberOfImages}`}
          </Text>
          <TouchableOpacity
            onPress={this.props.onClose}
            style={{
              paddingRight: 10,
              position: 'absolute',
              right: 0,
              top: 15
            }}
            >
            <Text style={{
              fontSize: 16,
              color: 'white'
            }}>
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