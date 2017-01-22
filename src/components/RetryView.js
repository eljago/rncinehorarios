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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 24,
    textAlign: 'center'
  }
})