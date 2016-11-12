// @flow
'use strict';

const React = require('react');
const ReactNative = require('react-native');
import update from 'react/lib/update';

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
  View
} = ReactNative;

const {
  CardStack: NavigationCardStack,
  Header: NavigationHeader,
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

import createAppNavigationContainer from './CreateNavigationContainer';
import NavigationExampleRow from '../NavigationExampleRow'


const TabsNavigator = createAppNavigationContainer(class extends Component {
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
        <YourTabs
          navigationState={tabs}
        />
      </View>
    );
  }

  _renderHeader(sceneProps: Object): React.Element {
    return (
      <YourHeader
        {...sceneProps}
      />
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

export default TabsNavigator;
