// @flow
'use strict';

const React = require('react');
const ReactNative = require('react-native');

const {
  Component,
  PropTypes,
} = React;

const {
  StyleSheet,
  Text,
  View,
  NavigationExperimental,
} = ReactNative;

const {
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

import createAppNavigationContainer from '../../../Navigation/CreateNavigationContainer';

export default createAppNavigationContainer(class extends Component {
  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    navigate: PropTypes.func.isRequired,
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Billboard</Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
