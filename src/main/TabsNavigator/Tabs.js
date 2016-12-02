// @flow
'use strict';

import React, { PropTypes } from 'react';
import _ from 'lodash';
import ReactNative, {
  StyleSheet,
  View,
  NavigationExperimental,
} from 'react-native';

const {
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

import Colors from '../../../data/Colors'

import Tab from './Tab';

export default class extends React.Component {
  static propTypes = {
    navigationState: NavigationPropTypes.navigationState.isRequired,
    onSelectTab: PropTypes.func.isRequired,
  };

  constructor(props: Object, context: any) {
    super(props, context);
    _.bindAll(this, '_renderTab')
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
        onSelectTab={this.props.onSelectTab}
      />
    );
  }
}

const styles = StyleSheet.create({
  tabs: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    backgroundColor: Colors.tabBar,
  },
});