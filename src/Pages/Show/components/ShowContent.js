//@flow
'use strict'

import React, { PropTypes } from 'react'
import _ from 'lodash';
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native'

export default class ShowContent extends React.Component {
  static propTypes = {
    showName: PropTypes.string,
    showOriginalName: PropTypes.string,
    showYear: PropTypes.number,
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.marginView}>
          {this._getShowName()}
          {this._getShowOriginalNameAndYear()}
        </View>
      </View>
    );
  }

  _getShowName() {
    if (!_.isEmpty(this.props.showName)) {
      return(
        <Text style={styles.showName}>
          {this.props.showName}
        </Text>
      );
    }
    return null;
  }

  _getShowOriginalNameAndYear() {
    const {showOriginalName, showYear} = this.props;
    if (!_.isEmpty(showOriginalName) ||
      !_.isEmpty(showYear)) {
      return(
        <Text style={styles.showOriginalName}>
          {`${showOriginalName}`}
        </Text>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginView: {
    flex: 1,
    margin: 10,
  },
  showName: {
    color: 'white',
    fontSize: 24,
  },
  showOriginalName: {
    color: 'white',
    fontSize: 18,
  },
});