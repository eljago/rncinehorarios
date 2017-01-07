'use strict'
import React, {PropTypes} from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

export default class MediaRowWithTitle extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
        {this.props.children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 7,
    marginTop: 0
  },
  title: {
    padding: 3,
    color: 'white',
    fontSize: 24
  }
})