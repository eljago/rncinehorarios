// @flow
'use strict';

const React = require('react');
const ReactNative = require('react-native');
import update from 'react/lib/update';

const NavigationStateUtils = ReactNative.NavigationExperimental.StateUtils;

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
  TouchableHighlight
} = ReactNative;

const {
  CardStack: NavigationCardStack,
  Header: NavigationHeader,
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

import createAppNavigationContainer from './CreateNavigationContainer';
import NavigationExampleRow from '../NavigationExampleRow'

const Comp1 = createAppNavigationContainer(class extends React.Component {
  render(){
    return(
      <View  style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
        <TouchableOpacity onPress={() => {
          this.props.navigate({type: 'superPull'});
        }}>
          <Text>
            PULL
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
});

function createAppNavigationState(): Object {
  return {
    index: 0,
    routes: [{
      key: 'tabs',
      component: YourTabsNavigator,
      tabs: {
        index: 0,
        routes: [
        {key: 'apple'},
        {key: 'banana'},
        {key: 'orange'},
        ],
      },

      apple: {
        index: 0,
        routes: [{key: 'Apple Home'}],
      },

      banana: {
        index: 0,
        routes: [{key: 'Banana Home'}],
      },

      orange: {
        index: 0,
        routes: [{key: 'Orange Home'}],
      },
    }]
  };
}


function updateAppNavigationState(state: Object, action: Object): Object {
  let {type} = action;
  if (type === 'BackAction') {
    type = 'pop';
  }

  switch (type) {
    case 'superPush': {
      const route: Object = action.route;
      const nextState = NavigationStateUtils.push(state, route);
      if (state !== nextState) {
        return nextState;
      }
      break;
    }

    case 'superPull': {
      const nextState = NavigationStateUtils.pop(state);
      if (state !== nextState) {
        return nextState;
      }
      break;
    }

    case 'push': {
      const route: Object = action.route;
      const superScenes = state.routes;
      const tabsRoute = superScenes[0];
      const tabs = tabsRoute.tabs;
      const tabKey = tabs.routes[tabs.index].key;
      const scenes = tabsRoute[tabKey];
      const nextScenes = NavigationStateUtils.push(scenes, route);
      if (scenes !== nextScenes) {
        return update(state, {routes: {0: {[tabKey]: {$set: nextScenes}}}});
      }
      break;
    }

    case 'pop': {
      const superScenes = state.routes;
      const tabsRoute = superScenes[0];
      const tabs = tabsRoute.tabs;
      const tabKey = tabs.routes[tabs.index].key;
      const scenes = tabsRoute[tabKey];
      const nextScenes = NavigationStateUtils.pop(scenes);
      if (scenes !== nextScenes) {
        return update(state, {routes: {0: {[tabKey]: {$set: nextScenes}}}});
      }
      break;
    }

    case 'selectTab': {
      const tabKey: string = action.tabKey;
      const superScenes = state.routes;
      const currentTabs = superScenes[0].tabs;
      const tabs = NavigationStateUtils.jumpTo(currentTabs, tabKey);
      if (tabs !== currentTabs) {
        return update(state, {routes: {0: {tabs: {$set: tabs}}}});
      }
    }
  }
  return state;
}

export {createAppNavigationState, updateAppNavigationState};



// Next step.
// Define your own controlled navigator.
const YourTabsNavigator = createAppNavigationContainer(class extends Component {
  static propTypes = {
    navigationState: PropTypes.shape({
      apple: NavigationPropTypes.navigationState.isRequired,
      banana: NavigationPropTypes.navigationState.isRequired,
      orange: NavigationPropTypes.navigationState.isRequired,
      tabs: NavigationPropTypes.navigationState.isRequired,
    }),
    navigate: PropTypes.func.isRequired,
  };

  // This sets up the methods (e.g. Pop, Push) for navigation.
  constructor(props: any, context: any) {
    super(props, context);
    this._back = this._back.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this._renderScene = this._renderScene.bind(this);
  }

  // Now use the `NavigationCardStack` to render the scenes.
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
        <YourTabs
          navigationState={tabs}
        />
      </View>
    );
  }

  // Render the header.
  // The detailed spec of `sceneProps` is defined at `NavigationTypeDefinition`
  // as type `NavigationSceneRendererProps`.
  _renderHeader(sceneProps: Object): React.Element {
    return (
      <YourHeader
        {...sceneProps}
      />
    );
  }

  // Render a scene for route.
  // The detailed spec of `sceneProps` is defined at `NavigationTypeDefinition`
  // as type `NavigationSceneRendererProps`.
  _renderScene(sceneProps: Object): React.Element {
    return (
      <YourScene
        {...sceneProps}
      />
    );
  }

  _back() {
    this.props.navigate({type: 'pop'});
  }
});

// Next step.
// Define your own scene.
const YourScene = createAppNavigationContainer(class extends Component {
  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    navigate: PropTypes.func.isRequired,
  };

  constructor(props: Object, context: any) {
    super(props, context);
    this._superPush = this._superPush.bind(this);
    this._exit = this._exit.bind(this);
    this._popRoute = this._popRoute.bind(this);
    this._pushRoute = this._pushRoute.bind(this);
  }

  render(): React.Element {
    return (
      <ScrollView>
        <NavigationExampleRow
          text="Push Route"
          onPress={this._pushRoute}
        />
        <NavigationExampleRow
          text="Pop Route"
          onPress={this._popRoute}
        />
        <NavigationExampleRow
          text="SUPER PUSH"
          onPress={this._superPush}
        />
        <NavigationExampleRow
          text="Exit Header + Scenes + Tabs Example"
          onPress={this._exit}
        />
      </ScrollView>
    );
  }

  _superPush(): void {
    const route = {
      key: 'kk',
      component: Comp1
    };
    this.props.navigate({type: 'superPush', route});
  }

  _pushRoute(): void {
    // Just push a route with a new unique key.
    const route = {key: '[' + this.props.scenes.length + ']-' + Date.now()};
    this.props.navigate({type: 'push', route});
  }

  _popRoute(): void {
    this.props.navigate({type: 'pop'});
  }

  _exit(): void {
    this.props.navigate({type: 'exit'});
  }
});

// Next step.
// Define your own tabs.
const YourTabs = createAppNavigationContainer(class extends Component {
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
      <YourTab
        key={route.key}
        route={route}
        selected={this.props.navigationState.index === index}
      />
    );
  }
});

// Next step.
// Define your own Tab
const YourTab = createAppNavigationContainer(class extends Component {

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
    if (this.props.selected) {
      style.push(styles.tabSelected);
    }
    return (
      <TouchableOpacity style={styles.tab} onPress={this._onPress}>
        <Text style={style}>
          {this.props.route.key}
        </Text>
      </TouchableOpacity>
    );
  }

  _onPress() {
    this.props.navigate({type: 'selectTab', tabKey: this.props.route.key});
  }
});


// Next step.
// Define your own header.
const YourHeader = createAppNavigationContainer(class extends Component {
  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    navigate: PropTypes.func.isRequired,
  };

  constructor(props: Object, context: any) {
    super(props, context);
    this._back = this._back.bind(this);
    this._renderTitleComponent = this._renderTitleComponent.bind(this);
  }

  render(): React.Element {
    return (
      <NavigationHeader
        {...this.props}
        renderTitleComponent={this._renderTitleComponent}
        onNavigateBack={this._back}
      />
    );
  }

  _back(): void {
    this.props.navigate({type: 'pop'});
  }

  _renderTitleComponent(props: Object): React.Element {
    return (
      <NavigationHeader.Title>
        {props.scene.route.key}
      </NavigationHeader.Title>
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
