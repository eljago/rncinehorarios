// @flow
'use strict'

import React from 'react'
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

import TabsNavigator from '../TabsNavigator'
import {renderScene} from '../NavigatorHelpers/CardStackHelpers'

// Main Navigator of the app. Receives the whole app navigaiton state passed from props.
export default class SuperNavigator extends React.Component {

  constructor (props: any, context: any) {
    super(props, context)
    this.state = {
      navigationState: {
        index: 0,
        routes: [{
          key: 'super_tabs',
          component: TabsNavigator
        }]
      }
    }
    _.bindAll(this, [
      '_onPushRoute',
      '_onPopRoute'
    ])
    BackAndroid.addEventListener('hardwareBackPress', this._onPopRoute)
  }

  render (): React.Element {
    return (
      <View style={styles.navigator}>
        <NavigationCardStack
          key={'super_stack'}
          onNavigateBack={this._onPopRoute}
          navigationState={this.state.navigationState}
          renderScene={renderScene.bind(this)}
          style={styles.navigatorCardStack}
        />
      </View>
    )
  }

  _onPushRoute (route: Object): void {
    const navigationState = NavigationStateUtils.push(this.state.navigationState, route)
    if (this.state.navigationState !== navigationState) {
      this.setState({navigationState})
    }
  }

  _onPopRoute () {
    const navigationState = NavigationStateUtils.pop(this.state.navigationState)
    if (this.state.navigationState !== navigationState) {
      this.setState({navigationState})
      return true
    }
    return false
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
