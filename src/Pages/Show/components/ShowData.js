// @flow
'use strict'

import React, { PropTypes } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class ShowData extends React.Component {
  static propTypes = {
    showInformation: PropTypes.string,
    showDuration: PropTypes.number,
    showDebut: PropTypes.string,
    showGenres: PropTypes.string
  }

  render () {
    const {
      showInformation,
      showDuration,
      showDebut,
      showGenres
    } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.showData}>
          {getDataText(showDuration, {suffix: ' minutos'})}
          {getDataText(showDebut, {prefix: 'Estreno: '})}
          {getDataText(showGenres)}
          {getDataText(showInformation, {style: styles.information})}
        </View>
      </View>
    )
  }
}

function getDataText (text, options = {}) {
  if (typeof text === 'string') {
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
