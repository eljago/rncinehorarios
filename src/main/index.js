// @flow
'use strict';

const React = require('react');
const ReactNative = require('react-native');

const { Component, PropTypes } = React;
const { NavigationExperimental, StyleSheet, View } = ReactNative;

const {
  CardStack: NavigationCardStack,
  Header: NavigationHeader,
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

import {createAppNavigationState, updateAppNavigationState} from './Navigation/NavigationState';
import createAppNavigationContainer from './Navigation/CreateNavigationContainer'

export default class CineHorariosApp extends Component {

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
    console.log('BEFORE:');
    console.log(this.state);
    const state = updateAppNavigationState(this.state, action);
    console.log('AFTER:');
    console.log(state);
    if (this.state !== state) {
      this.setState(state);
    }
  }
}

// Main Navigator of the app. Receives the whole app navigaiton state passed from props.
const SuperNavigator = createAppNavigationContainer(class extends Component {
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
    const Comp = scenes[index].route.component;
    return (
      <Comp
        navigationState={scenes[index].route}
      />
    );
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
