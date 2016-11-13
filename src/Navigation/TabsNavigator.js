// @flow
'use strict';

import React, { PropTypes } from 'react'
import ReactNative, {
  NavigationExperimental,
  StyleSheet,
  View,  
} from 'react-native'

const {
  CardStack: NavigationCardStack,
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

import createAppNavigationContainer from './CreateNavigationContainer';
import Header from './Header'
import Tabs from './Tabs'

const TabsNavigator = createAppNavigationContainer(class extends React.Component {
  static propTypes = {
    navigationState: PropTypes.shape({
      tabs: NavigationPropTypes.navigationState.isRequired,
    }),
    navigate: PropTypes.func.isRequired,
  };

  constructor(props: any, context: any) {
    super(props, context);
    this._back = this._back.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this._renderScene = this._renderScene.bind(this);
  }

  render(): React.Element {
    const {navigationState} = this.props;
    const tabs = navigationState.tabs;
    const tabKey = tabs.routes[tabs.index].key;
    const scenes = navigationState[tabKey];

    return (
      <View style={styles.navigator}>
        <NavigationCardStack
          key={'stack_' + tabKey}
          onNavigateBack={this._back}
          navigationState={scenes}
          renderHeader={this._renderHeader}
          renderScene={this._renderScene}
          style={styles.navigatorCardStack}
        />
        <Tabs navigationState={tabs} />
      </View>
    );
  }

  _renderHeader(sceneProps: Object): React.Element {
    return (
      <Header {...sceneProps} />
    );
  }

  _renderScene(sceneProps: Object): React.Element {
    console.log(sceneProps.scene.route.component)
    const Comp = sceneProps.scene.route.component;
    return (
      <Comp {...sceneProps} />
    );
  }

  _back() {
    this.props.navigate({type: 'pop'});
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

export default TabsNavigator;
