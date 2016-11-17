// @flow
'use strict';

import React, { PropTypes } from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  View,
  NavigationExperimental,
} from 'react-native';

const {
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;


export default class Billboard extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Billboard</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
