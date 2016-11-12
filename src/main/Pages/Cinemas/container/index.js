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
  TouchableHighlight,
  NavigationExperimental
} = ReactNative;

const {
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

import createAppNavigationContainer from '../../../Navigation/CreateNavigationContainer';
import GetRoute from '../../../Navigation/GetRoute'

export default createAppNavigationContainer(class extends Component {
  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    navigate: PropTypes.func.isRequired,
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={() => {
          const route = GetRoute('Billboard');
          this.props.navigate({type: 'push',route});
        }}>
          <Text>Cartelera</Text>
        </TouchableHighlight>
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
