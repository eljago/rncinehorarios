'use strict';

import React, { PropTypes } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native'

export default class MenuItem extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    selected: PropTypes.bool,
    title: PropTypes.string,
  }

  render() {
    const textStyle = [styles.text, {
      color: this.props.selected ? 'white' : '#909090'
    }];
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        activeOpacity={0.6}
        style={styles.container}
      >
        <Text style={textStyle}>
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 50,
  },
  text: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  }
});