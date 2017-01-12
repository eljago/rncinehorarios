// @flow
'use strict'

import React, { PropTypes } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import moment from 'moment'
import _ from 'lodash'

export default class ShowData extends React.Component {
  static propTypes = {
    showInformation: PropTypes.string,
    showDuration: PropTypes.number,
    showDebut: PropTypes.string,
    showGenres: PropTypes.string,
    showRating: PropTypes.string
  }

  constructor(props) {
    super(props)
    moment.locale('es');
  }

  render () {
    const {
      showInformation,
      showDuration,
      showDebut,
      showGenres,
      showRating
    } = this.props
    const debut = showDebut ? moment(showDebut, "YYYY-MM-DD").format('D [de] MMMM, YYYY') : null
    const duration = showDuration ? showDuration.toString() : null
    return (
      <View style={styles.container}>
        <View style={styles.showData}>
          {getDataText(debut, {prefix: 'Estreno: '})}
          {getDataText(showGenres)}
          {getDataText(duration, {prefix: 'Duracion: ', suffix: ' minutos'})}
          {getDataText(showRating)}
          {getDataText(showInformation, {style: styles.information})}
        </View>
      </View>
    )
  }
}

function getDataText (text, options = {}) {
  if (_.isString(text) && !_.isEmpty(text)) {
    return (
      <Text style={options.style ? options.style : styles.dataText}>
        {`${options.prefix ? options.prefix : ''}${text}${options.suffix ? options.suffix : ''}`}
      </Text>
    )
  }
  return null
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  showData: {
    flex: 1,
    margin: 10
  },
  dataText: {
    color: 'white',
    fontSize: 16,
    marginTop: 4
  },
  information: {
    color: 'white',
    fontSize: 16,
    marginTop: 10
  }
})
