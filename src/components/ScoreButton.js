'use strict';

import React, { PropTypes } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, Image } from 'react-native';

export class ScoreButton extends React.Component {

  static propTypes = {
    source: PropTypes.number,
    text: PropTypes.string,
    color: PropTypes.string
  };

  render() {
    return(
      <TouchableHighlight
        style={styles.scoreButton}
        underlayColor={'transparent'}
        onPress={this._onPress.bind(this)}
      >
        {this._getContent()}
      </TouchableHighlight>
    );
  }

  _onPress() {

  }

  _getContent() {
    return(
      <View style={styles.scoreView}>
        <Image
          style={styles.scoreLogo}
          source={this.props.source}/>
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.scoreText, {color: this.props.color}]}>
            {this.props.text}
          </Text>
        </View>
      </View>
    );
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
});