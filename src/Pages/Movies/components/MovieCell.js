'use strict'

import React, { PropTypes } from 'react'
import { StyleSheet, View, Image, Text } from 'react-native'
import moment from 'moment'
import _ from 'lodash'

import Colors from '../../../../data/Colors'
import MyListViewCell from '../../../components/MyListViewCell'
import {getImdbView, getRottenTomatoesView, getMetacriticView} from './GetScoreViews'
import {getImageVersion} from '../../../utils/ImageHelper'

export default class MovieCell extends React.Component {

  static propTypes = {
    rowNumber: PropTypes.number,
    onPress: PropTypes.func,
    isBillboard: PropTypes.bool,
    showName: PropTypes.string,
    showDebut: PropTypes.string,
    showGenres: PropTypes.string,
    showDuration: PropTypes.number,
    showRating: PropTypes.string,
    showCover: PropTypes.string,
    showImdbCode: PropTypes.string,
    showImdbScore: PropTypes.number,
    showMetacriticUrl: PropTypes.string,
    showMetacriticScore: PropTypes.number,
    showRottenTomatoesUrl: PropTypes.string,
    showRottenTomatoesScore: PropTypes.number,
    showingScores: PropTypes.bool
  };

  render () {
    const {
      rowNumber,
      onPress,
      showCover
    } = this.props

    return (
      <MyListViewCell
        rowNumber={rowNumber}
        onPress={onPress}
      >
        <View style={styles.rowContainer}>
          <View style={styles.imageContainer}>
            <Image
              resizeMode='stretch'
              style={styles.image}
              source={{uri: getImageVersion(showCover, 'smaller')}}
            />
          </View>
          {this._getDynamicView()}
        </View>
      </MyListViewCell>
    )
  }

  _getDynamicView () {
    const {showName, showingScores} = this.props
    if (showingScores) {
      const {
        showImdbCode,
        showImdbScore,
        showMetacriticUrl,
        showMetacriticScore,
        showRottenTomatoesUrl,
        showRottenTomatoesScore
      } = this.props
      return (
        <View style={styles.textContainer}>
          <Text style={styles.name}>{showName}</Text>
          <View style={styles.scoresView}>
            {getImdbView(showImdbCode, showImdbScore)}
            {getMetacriticView(showMetacriticUrl, showMetacriticScore)}
            {getRottenTomatoesView(showRottenTomatoesUrl, showRottenTomatoesScore)}
          </View>
        </View>
      )
    } else {
      const {
        isBillboard,
        showGenres,
        showDuration,
        showRating,
        showDebut
      } = this.props
      const debut = showDebut ? moment(showDebut, "YYYY-MM-DD").format('D [de] MMMM, YYYY') : null
      const duration = showDuration ? showDuration.toString() : null
      const specificContent = isBillboard ? [
        getDataText(duration, {suffix: ' minutos', key: 'duration'}),
        getDataText(showRating, {key: 'rating'})
      ] : [
        getDataText(debut, {prefix: 'Estreno: ', key: 'genres'})
      ]
      return (
        <View style={styles.textContainer}>
          <Text key='name' style={styles.name}>{showName}</Text>
          {getDataText(showGenres, {key: 'genres'})}
          {specificContent}
        </View>
      )
    }
  }
}

function getDataText (text, options = {}) {
  if (_.isString(text) && !_.isEmpty(text)) {
    return (
      <Text key={options.key} style={styles.subtitle}>
        {`${options.prefix ? options.prefix : ''}${text}${options.suffix ? options.suffix : ''}`}
      </Text>
    )
  }
  return null
}

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  imageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'gray',
    shadowColor: 'black',
    shadowRadius: 3,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0, height: 0
    }
  },
  image: {
    width: 80,
    height: 120
  },
  scoresView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    alignSelf: 'flex-start'
  },
  name: {
    fontSize: 20,
    color: Colors.navBar,
    fontWeight: '500',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 4
  }
})
