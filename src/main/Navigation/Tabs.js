// @flow
'use strict';

import React, { PropTypes } from 'react'
import ReactNative, {
  StyleSheet,
  View,
  NavigationExperimental,
} from 'react-native'

const {
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

import createAppNavigationContainer from './CreateNavigationContainer';
import Tab from './Tab'

export default createAppNavigationContainer(class extends React.Component {
  static propTypes = {
    navigationState: NavigationPropTypes.navigationState.isRequired,
    navigate: PropTypes.func.isRequired,
  };

  constructor(props: Object, context: any) {
    super(props, context);
  }

  render(): React.Element {
    return (
      <View style={styles.tabs}>
        {this.props.navigationState.routes.map(this._renderTab, this)}
      </View>
    );
  }

  _renderTab(route: Object, index: number): React.Element {
    return (
      <Tab
        key={route.key}
        route={route}
        selected={this.props.navigationState.index === index}
      />
    );
  }
});

const styles = StyleSheet.create({
  tabs: {
    flex: 1,
    flexDirection: 'row',
  },
});