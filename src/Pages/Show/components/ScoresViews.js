'use strict'

import React, {PropTypes} from 'react'
import {
  View,
  StyleSheet
} from 'react-native'

import {getImdbView, getRottenTomatoesView, getMetacriticView} from './GetScoreViews'

export default class ScoresViews extends React.Component {
  static propTypes = {
    imdbCode: PropTypes.string,
    imdbScore: PropTypes.number,
    metacriticUrl: PropTypes.string,
    metacriticScore: PropTypes.number,
    rottenTomatoesUrl: PropTypes.string,
    rottenTomatoesScore: PropTypes.number
  }

  render () {
    const {
      imdbCode, imdbScore,
      metacriticUrl, metacriticScore,
      rottenTomatoesUrl, rottenTomatoesScore
    } = this.props
    return (
      <View
        style={styles.container}
      >
        {getImdbView(imdbCode, imdbScore)}
        {getMetacriticView(metacriticUrl, metacriticScore)}
        {getRottenTomatoesView(rottenTomatoesUrl, rottenTomatoesScore)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around'

  }
})