'use strict'

import React, {PropTypes} from 'react'
import {NavigationExperimental} from 'react-native'
import update from 'react/lib/update'

import CardNavigator from './CardNavigator'
import {getMenuRoutes} from '../../data/routes'
import DrawerLayout from 'react-native-drawer-layout'
import Menu from './Menu'

import {reportScreenView} from '../utils/Analytics'

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
    this.state = {
      navigationState: navigationState,
      drawerLockMode: 'unlocked'
    };
  }

  componentDidMount() {
    const route = this._getTopRoute()
    if (route) {
      reportScreenView(route.screenView)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.navigationState !== prevState.navigationState) {
      const route = this._getTopRoute()
      if (route) {
        reportScreenView(route.screenView)

        // call OnFOcusChanged on Card Navigator, which will call onFocus() on the top Component
        if (this._cardNav && route.key) {
          this._cardNav.onFocusChanged(route.key)
        }
      }
    }
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
        renderNavigationView={this._getMenuView.bind(this)}
        drawerLockMode={this.state.drawerLockMode}
      >
        <CardNavigator
          ref={(comp) => { this._cardNav = comp }}
          key={'stack_' + menuItemKey}
          navigationState={scenes}
          onPushRoute={this._onPushRoute.bind(this)}
          onPopRoute={this._onPopRoute.bind(this)}
          setDrawerLockMode={this._setDrawerLockMode.bind(this)}
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

  _getMenuView () {
    const {navigationState} = this.state
    const {menuItems} = navigationState
    const menuItemKey = menuItems.routes[menuItems.index].key
    return (
      <Menu
        selectedMenuKey={menuItemKey}
        onPressMenuItem={this._onPressMenuitem.bind(this)}
      />
    )
  }

  _onPressMenuitem (menuItemKey) {
    let {navigationState} = this.state
    const {menuItems} = navigationState
    const oldMenuItemKey = menuItems.routes[menuItems.index].key
    const scenes = navigationState[oldMenuItemKey]
    const newScenes = NavigationStateUtils.reset(scenes, [scenes.routes[0]])
    const newMenuItems = NavigationStateUtils.jumpTo(menuItems, menuItemKey)
    let updateNavState = false
    if (newScenes !== scenes) {
      navigationState = update(navigationState, {
        [oldMenuItemKey]: {$set: newScenes}
      })
      updateNavState = true
    }
    if (menuItems !== newMenuItems) {
      navigationState = update(navigationState, {
        menuItems: {$set: newMenuItems}
      })
      updateNavState = true
    }
    if (updateNavState) {
      this.setState({navigationState})
    }
    this._drawer.closeDrawer()
  }

  _setDrawerLockMode (drawerLockMode) {
    this.setState({drawerLockMode})
  }

  _getTopRoute() {
    const {navigationState} = this.state
    const {menuItems} = navigationState
    const {key} = menuItems.routes[menuItems.index]
    const {routes} = navigationState[key]
    return routes[routes.length - 1]
  }
}