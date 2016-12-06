// @flow
'use strict'

import React, { PropTypes } from 'react'
import _ from 'lodash'
import {
  NavigationExperimental,
  StyleSheet,
  View,
  BackAndroid
} from 'react-native'

const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils
} = NavigationExperimental

import Tabs from './Tabs'

import {getTabBarRoute} from '../../../data/routes'
import {renderHeader, renderScene} from '../NavigatorHelpers/CardStackHelpers'

export default class TabsNavigator extends React.Component {

  static propTypes = {
    onPushRoute: PropTypes.func,
    onPopRoute: PropTypes.func
  };

  constructor (props: any, context: any) {
    super(props, context)
    this.state = {
      navigationState: getTabBarRoute()
    }
    _.bindAll(this, [
      '_onPushRoute',
      '_onPopRoute',
      '_onSelectTab'
    ])
    BackAndroid.addEventListener('hardwareBackPress', this._onPopRoute)
  }

  render (): React.Element {
    const {navigationState} = this.state
    const tabs = navigationState.tabs
    const tabKey = tabs.routes[tabs.index].key
    const scenes = navigationState[tabKey]

    return (
      <View style={styles.navigator}>
        <NavigationCardStack
          key={'stack_' + tabKey}
          onNavigateBack={this._onPopRoute}
          navigationState={scenes}
          renderHeader={renderHeader.bind(this)}
          renderScene={renderScene.bind(this)}
          style={styles.navigatorCardStack}
        />
        <View style={{height: 40}}>
          <Tabs navigationState={tabs} onSelectTab={this._onSelectTab} />
        </View>
      </View>
    )
  }

  _onPushRoute (route, superPush = false) {
    if (superPush) {
      this.props.onPushRoute(route)
    } else {
      const {navigationState} = this.state
      const {tabs} = navigationState
      const tabKey = tabs.routes[tabs.index].key
      const scenes = navigationState[tabKey]
      const nextScenes = NavigationStateUtils.push(scenes, route)
      if (scenes !== nextScenes) {
        this.setState({
          navigationState: {
            ...navigationState,
            [tabKey]: nextScenes
          }
        })
      }
    }
  }

  _onPopRoute (superPop = false) {
    if (superPop) {
      this.props.onPopRoute()
    } else {
      const {navigationState} = this.state
      const {tabs} = navigationState
      const tabKey = tabs.routes[tabs.index].key
      const scenes = navigationState[tabKey]
      const nextScenes = NavigationStateUtils.pop(scenes)
      if (scenes !== nextScenes) {
        this.setState({
          navigationState: {
            ...navigationState,
            [tabKey]: nextScenes
          }
        })
        return true
      }
    }
    return false
  }

  _onSelectTab (tabKey: String) {
    const {navigationState} = this.state
    const tabs = NavigationStateUtils.jumpTo(navigationState.tabs, tabKey)
    if (tabs !== navigationState.tabs) {
      this.setState({
        navigationState: {
          ...navigationState,
          tabs
        }
      })
    }
  }
}

const styles = StyleSheet.create({
  navigator: {
    flex: 1
  },
  navigatorCardStack: {
    flex: 20
  }
})

