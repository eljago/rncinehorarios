// @flow
'use strict';

import React, { PropTypes } from 'react';
import _ from 'lodash';
import ReactNative, {
  NavigationExperimental,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';

const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

import MyHeader from './MyHeader'
import Tabs from './Tabs'

import TabsRoutes from './routes';

export default class TabsNavigator extends React.Component {

  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      navigationState: TabsRoutes.initialRoute,
    }
    _.bindAll(this,[
      '_onPushRoute',
      '_onPopRoute',
      '_onSelectTab',
      '_renderHeader',
      '_renderScene',
    ]);
  }

  render(): React.Element {
    const {navigationState} = this.state;
    const tabs = navigationState.tabs;
    const tabKey = tabs.routes[tabs.index].key;
    const scenes = navigationState[tabKey];

    return (
      <View style={styles.navigator}>
        <NavigationCardStack
          key={'stack_' + tabKey}
          onNavigateBack={this._onPopRoute}
          navigationState={scenes}
          renderHeader={this._renderHeader}
          renderScene={this._renderScene}
          style={styles.navigatorCardStack}
        />
        <Tabs navigationState={tabs} onSelectTab={this._onSelectTab}/>
      </View>
    );
  }

  _onPushRoute(route) {
    const {navigationState} = this.state;
    const {tabs} = navigationState;
    const tabKey = tabs.routes[tabs.index].key;
    const scenes = navigationState[tabKey];
    const nextScenes = NavigationStateUtils.push(scenes, route);
    if (scenes !== nextScenes) {
      this.setState({
        navigationState: {
          ...navigationState,
          [tabKey]: nextScenes,
        }
      });
    }
  }

  _onPopRoute() {
    const {navigationState} = this.state;
    const {tabs} = navigationState;
    const tabKey = navigationState.routes[tabs.index].key;
    const scenes = state[tabKey];
    const nextScenes = NavigationStateUtils.pop(scenes);
    if (scenes !== nextScenes) {
      this.setState({
        navigationState: {
          ...navigationState,
          [tabKey]: nextScenes,
        }
      });
    }
  }

  _onSelectTab(tabKey: String) {
    const {navigationState} = this.state;
    const tabs = NavigationStateUtils.jumpTo(navigationState.tabs, tabKey);
    if (tabs !== navigationState.tabs) {
      this.setState({
        navigationState: {
          ...navigationState,
          tabs,
        }
      });
    }
  }

  _renderHeader(sceneProps: Object): React.Element {
    return (
      <MyHeader {...sceneProps} onPopRoute={this._onPopRoute}/>
    );
  }

  _renderScene(sceneProps: Object): React.Element {
    const route = sceneProps.scene.route;
    const Component = route.component;
    return (
      <View style={styles.navigator}>
        {this._getStatusBar(route)}
        <Component
          {...sceneProps}
          onPushRoute={this._onPushRoute}
          onPopRoute={this._onPopRoute}
        />
      </View>
    );
  }

  _getStatusBar(route: Object): React.Element {
    return route.getStatusBar ? route.getStatusBar() :
      <StatusBar barStyle="light-content" />;
  }
}

const styles = StyleSheet.create({
  navigator: {
    flex: 1,
  },
  navigatorCardStack: {
    flex: 20,
  },
});

