// @flow
'use strict'

import React, { PropTypes } from 'react';
import ReactNative, {
  NavigationExperimental,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native'

const {
  CardStack: NavigationCardStack,
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

import {createAppNavigationState, updateAppNavigationState} from './Navigation/NavigationState';
import createAppNavigationContainer from './Navigation/CreateNavigationContainer'

export default class CineHorariosApp extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = createAppNavigationState();
    this._navigate = this._navigate.bind(this);
  }

  render(): React.Element {
    return (
      <SuperNavigator
        appNavigationState={this.state}
        navigate={this._navigate}
      />
    );
  }

  // HANDLE BACK ACTION
  handleBackAction(): boolean {
    return this._navigate({type: 'pop'});
  }

  // NAVIGATE
  _navigate(action: Object): void {
    const state = updateAppNavigationState(this.state, action);
    if (this.state !== state) {
      this.setState(state);
    }
  }
}

// Main Navigator of the app. Receives the whole app navigaiton state passed from props.
const SuperNavigator = createAppNavigationContainer(class extends React.Component {
  static propTypes = {
    appNavigationState: NavigationPropTypes.navigationState.isRequired,
    navigate: PropTypes.func.isRequired,
  };

  constructor(props: any, context: any) {
    super(props, context);
    this._back = this._back.bind(this);
    this._renderScene = this._renderScene.bind(this);
  }

  render(): React.Element {
    return (
      <View style={styles.navigator}>
        <NavigationCardStack
          key={'main_stack'}
          onNavigateBack={this._back}
          navigationState={this.props.appNavigationState}
          renderScene={this._renderScene}
          style={styles.navigatorCardStack}
        />
      </View>
    );
  }

  _back() {
    this.props.navigate({type: 'superPull'});
  }

  _renderScene(sceneProps: Object): React.Element {
    const {index} = sceneProps.scene;
    const {scenes} = sceneProps;
    const scene = scenes[index];
    const Comp = scenes[index].route.component;
    return (
      <View style={styles.navigator}>
        {this._getStatusBar(scene.route)}
        <Comp
          navigationState={scene.route}
          {...scene.props}
        />
      </View>
    );
  }

  _getStatusBar(route) {
    return route.getStatusBar ? route.getStatusBar() :
      <StatusBar
        barStyle="light-content"
      />;
  }
});


const styles = StyleSheet.create({
  navigator: {
    flex: 1,
  },
  navigatorCardStack: {
    flex: 20,
  },
});
