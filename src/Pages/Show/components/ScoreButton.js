'use strict'

import React, { PropTypes } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'

export default class ScoreButton extends React.Component {

  static propTypes = {
    source: PropTypes.number,
    text: PropTypes.string,
    color: PropTypes.string,
    onPress: PropTypes.func
  };

  render () {
    return (
      <TouchableOpacity
        style={styles.scoreButton}
        onPress={this.props.onPress}
      >
        {this._getContent()}
      </TouchableOpacity>
    )
  }

  _getContent () {
    const {text, color, source} = this.props
    return (
      <View style={styles.scoreView}>
        <Image
          style={styles.scoreLogo}
          source={source} />
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.scoreText, {color: color}]}>
            {text}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scoreButton: {
    padding: 2,
    marginLeft: 3,
    marginRight: 3
  },
  scoreView: {
    alignItems: 'center'
  },
  scoreLogo: {
    width: 32,
    height: 32,
    margin: 5
  },
  scoreText: {
    fontWeight: '700',
    fontSize: 12
  }
})
