// @flow
'use strict'

import React, {PropTypes} from 'react'
import _ from 'lodash'
import {
  NavigationExperimental,
  StyleSheet,
  View,
  BackAndroid,
  StatusBar
} from 'react-native'

const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils
} = NavigationExperimental

import MyHeader from './MyHeader'

// Main Navigator of the app. Receives the whole app navigaiton state passed from props.
export default class CardNavigator extends React.Component {
  static propTypes = {
    initialNavigationState: PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
    this.state = {
      navigationState: props.initialNavigationState
    }
    _.bindAll(this, ['_onPushRoute', '_onPopRoute'])
    BackAndroid.addEventListener('hardwareBackPress', this._onPopRoute)
  }

  render () {
    return (
      <View style={styles.navigator}>
        <NavigationCardStack
          key={'super_stack'}
          onNavigateBack={this._onPopRoute}
          navigationState={this.state.navigationState}
          renderScene={renderScene.bind(this)}
          renderHeader={renderHeader.bind(this)}
          style={styles.navigatorCardStack}
        />
      </View>
    )
  }

  _onPushRoute (route) {
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

function renderHeader (sceneProps: Object): React.Element {
  const route = sceneProps.scene.route
  if (route.navBarHidden) {return null}
  return (
    <MyHeader
      ref={(header) => { this.header = header }}
      {...sceneProps}
      onPopRoute={this._onPopRoute}
    />
  )
}

function renderScene (sceneProps: Object): React.Element {
  const route = sceneProps.scene.route
  const Component = route.component
  return (
    <View style={styles.navigator}>
      {getStatusBar(route)}
      <Component
        {...sceneProps}
        onPushRoute={this._onPushRoute}
        onPopRoute={this._onPopRoute}
        getHeader={() => this.header}
        {...route.props}
      />
    </View>
  )
}

function getStatusBar (route: Object): React.Element {
  return route.getStatusBar ? route.getStatusBar() : <StatusBar barStyle='light-content' />
}

const styles = StyleSheet.create({
  navigator: {
    flex: 1
  },
  navigatorCardStack: {
    flex: 20
  }
})
