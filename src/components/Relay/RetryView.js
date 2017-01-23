'use strict'

import React, {PropTypes} from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text
} from 'react-native'


export default class RetryView extends React.Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired
  }

  render () {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.props.onPress}>
        <Text style={styles.text}>
          Presiona para reintentar
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 24,
    textAlign: 'center'
  }
})