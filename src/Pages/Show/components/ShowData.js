//@flow
'use strict'

import React, { PropTypes } from 'react'
import _ from 'lodash';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native'

export default class ShowData extends React.Component {
  static propTypes = {
    showInformation: PropTypes.string,
    showDuration: PropTypes.number,
    showDebut: PropTypes.string,
    showGenres: PropTypes.string,
  }

  render() {
    const {
      showInformation,
      showDuration,
      showDebut,
      showGenres,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.showData}>
          <Text style={styles.dataText}>{showDuration} minutos</Text>
          <Text style={styles.dataText}>Estreno: {showDebut}</Text>
          <Text style={styles.dataText}>{showGenres}</Text>
          <Text style={styles.information}>{showInformation}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  showData: {
    flex: 1,
    margin: 10,
  },
  dataText: {
    color: 'white',
    fontSize: 16,
    marginTop: 4,
  },
  information: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  }
});