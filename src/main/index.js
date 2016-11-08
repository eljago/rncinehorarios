// @flow
'use strict';

const React = require('react');
const ReactNative = require('react-native');

/**
 * Basic example that shows how to use <NavigationCardStack /> to build
 * an app with composite navigation system.
 */

const {
  Component,
  PropTypes,
} = React;

const {
  NavigationExperimental,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = ReactNative;

const {
  CardStack: NavigationCardStack,
  Header: NavigationHeader,
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

import {createAppNavigationState, updateAppNavigationState} from './Navigation/NavigationState';
import createAppNavigationContainer from './Navigation/CreateNavigationContainer'

// Next step.
// Define a component for your application that owns the navigation state.
export default class YourApplication extends Component {

  static propTypes = {
    onExampleExit: PropTypes.func,
  };

  // This sets up the initial navigation state.
  constructor(props, context) {
    super(props, context);
    // This sets up the initial navigation state.
    this.state = createAppNavigationState();
    this._navigate = this._navigate.bind(this);
  }

  render(): React.Element {
    // User your own navigator (see next step).
    return (
      <SuperNavigator
        appNavigationState={this.state}
        navigate={this._navigate}
      />
    );
  }

  // This public method is optional. If exists, the UI explorer will call it
  // the "back button" is pressed. Normally this is the cases for Android only.
  handleBackAction(): boolean {
    return this._navigate({type: 'pop'});
  }

  // This handles the navigation state changes. You're free and responsible
  // to define the API that changes that navigation state. In this exmaple,
  // we'd simply use a `updateAppNavigationState` to update the navigation
  // state.
  _navigate(action: Object): void {
    if (action.type === 'exit') {
      // Exits the example. `this.props.onExampleExit` is provided
      // by the UI Explorer.
      this.props.onExampleExit && this.props.onExampleExit();
      return;
    }

    console.log('BEFORE:');
    console.log(this.state);

    const state = updateAppNavigationState(
      this.state,
      action,
    );
    console.log('AFTER:');
    console.log(state);

    // `updateAppNavigationState` (which uses NavigationStateUtils) gives you
    // back the same `state` if nothing has changed. You could use
    // that to avoid redundant re-rendering.
    if (this.state !== state) {
      this.setState(state);
    }
  }
}

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
  tabs: {
    flex: 1,
    flexDirection: 'row',
  },
  tab: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  tabText: {
    color: '#222',
    fontWeight: '500',
  },
  tabSelected: {
    color: 'blue',
  },
});
