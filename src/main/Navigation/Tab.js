// @flow
'use strict';

import React, { PropTypes } from 'react'
import ReactNative, {
  StyleSheet,
  TouchableOpacity,
  NavigationExperimental,
  Text,
} from 'react-native'

const {
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

import createAppNavigationContainer from './CreateNavigationContainer';
import Colors from '../../../data/Colors'

export default createAppNavigationContainer(class extends React.Component {

  static propTypes = {
    navigate: PropTypes.func.isRequired,
    route: NavigationPropTypes.navigationRoute.isRequired,
    selected: PropTypes.bool.isRequired,
  };

  constructor(props: Object, context: any) {
    super(props, context);
    this._onPress = this._onPress.bind(this);
  }

  render(): React.Element {
    const style = [styles.tabText];
    const styleTab = [styles.tab];
    if (this.props.selected) {
      style.push(styles.tabTextSelected);
      styleTab.push(styles.tabSelected);
    }
    const route = this.props.route;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styleTab}
        onPress={this._onPress}
      >
        <Text style={style}>
          {route.title ? route.title : route.key}
        </Text>
      </TouchableOpacity>
    );
  }

  _onPress() {
    this.props.navigate({type: 'selectTab', tabKey: this.props.route.key});
  }
});

const styles = StyleSheet.create({
  tab: {
    alignItems: 'center',
    backgroundColor: Colors.tabBar,
    flex: 1,
    justifyContent: 'center',
  },
  tabSelected: {
    backgroundColor: Colors.tabBarSelected,
  },
  tabText: {
    color: Colors.tabBarIcon,
    fontWeight: '500',
  },
  tabTextSelected: {
    color: Colors.tabBarIconSelected,
  },
});