'use strict';

import React, { PropTypes } from 'react';
import { TouchableHighlight, StyleSheet, View } from 'react-native'

import RightAccessoryView from './RightAccessoryView';

export default class MyListViewCell extends React.Component {

  static propTypes = {
    rowNumber: PropTypes.number,
    onPress: PropTypes.func
  };

  render() {
    const {rowNumber, onPress, children} = this.props;
    const cellBackgroundColor = rowNumber % 2 == 0 ? 'white' :  '#ECF0F1';

    return (
      <TouchableHighlight
        onPress={onPress}
        underlayColor={'black'}
      >
        <View style={[styles.rowContainer, {backgroundColor: cellBackgroundColor}]}>
          <View style={styles.childrenContainer}>
            {children}
          </View>
          <RightAccessoryView />
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center'
  },
  childrenContainer: {
    flex: 1
  }
});
