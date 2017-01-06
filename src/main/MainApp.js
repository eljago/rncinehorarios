'use strict'

import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  NavigationExperimental
} from 'react-native'
import update from 'react/lib/update'

import CardNavigator from './CardNavigator'
import {getMenuRoutes} from '../../data/routes'
import DrawerLayout from 'react-native-drawer-layout'
import Colors from '../../data/Colors'

const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils
} = NavigationExperimental

export default class MainApp extends React.Component {

  constructor(props) {
    super(props)
    const menuRoutes = getMenuRoutes()
    let navigationState = {
      menuItems: {
        index: 0,
        routes: menuRoutes.map((route) => {
          return {key: route.key}
        })
      }
    }
    for (const route of menuRoutes) {
      navigationState[route.key] = {
        index: 0,
        routes: [route]
      }
    }
    this.state = {navigationState: navigationState};
  }

  render () {
    const {navigationState} = this.state;
    const {menuItems} = navigationState;
    const menuItemKey = menuItems.routes[menuItems.index].key;
    const scenes = navigationState[menuItemKey];
    return (
      <DrawerLayout
        ref={(comp) => { this._drawer = comp }}
        drawerWidth={200}
        drawerPosition={DrawerLayout.positions.Right}
        renderNavigationView={this._getNavigationView.bind(this)}
      >
        <CardNavigator
          key={'stack_' + menuItemKey}
          navigationState={scenes}
          onPushRoute={this._onPushRoute.bind(this)}
          onPopRoute={this._onPopRoute.bind(this)}
          onPressMenu={() => {
            this._drawer.openDrawer()
          }}
        />
      </DrawerLayout>
    )
  }

  _onPushRoute (route) {
    let {navigationState} = this.state;
    const {menuItems} = navigationState;
    const menuItemKey = menuItems.routes[menuItems.index].key;
    const scenes = navigationState[menuItemKey];
    const newScenes = NavigationStateUtils.push(scenes, route)
    if (scenes !== newScenes) {
      navigationState = update(navigationState, {[menuItemKey]: {$set: newScenes}})
      this.setState({navigationState})
    }
  }

  _onPopRoute () {
    let {navigationState} = this.state;
    const {menuItems} = navigationState;
    const menuItemKey = menuItems.routes[menuItems.index].key;
    const scenes = navigationState[menuItemKey];
    const newScenes = NavigationStateUtils.pop(scenes)
    if (scenes !== newScenes) {
      navigationState = update(navigationState, {[menuItemKey]: {$set: newScenes}})
      this.setState({navigationState})
      return true
    }
    return false
  }

  _getNavigationView () {
    return (
      <View style={styles.menu}>
        {getMenuRoutes().map((route) => {
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.menuButton}
              onPress={this._onPressMenuitem.bind(this, route.key)}
            >
              <Text style={styles.menuText}>{route.title}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  _onPressMenuitem (menuItemKey) {
    const {menuItems} = this.state.navigationState
    const newMenuItems = NavigationStateUtils.jumpTo(menuItems, menuItemKey);
    const menuItem = this.state.navigationState[menuItemKey]
    const scenes = NavigationStateUtils.reset(menuItem, [menuItem.routes[0]])
    if (menuItems !== newMenuItems) {
      const navigationState = update(this.state.navigationState, {
        menuItems: {$set: newMenuItems},
        [menuItemKey]: {$set: scenes}
      })
      this.setState({navigationState})
    }
    this._drawer.closeDrawer()
  }
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    backgroundColor: Colors.menuBackground,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  menuButton: {

  },
  menuText: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10
  }
})