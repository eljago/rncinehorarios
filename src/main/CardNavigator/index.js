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
    navigationState: PropTypes.object.isRequired,
    onPressMenu: PropTypes.func.isRequired,
    onPushRoute: PropTypes.func.isRequired,
    onPopRoute: PropTypes.func.isRequired,
    setDrawerLockMode: PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context)
    BackAndroid.addEventListener('hardwareBackPress', this.props.onPopRoute)
  }

  render () {
    return (
      <View style={styles.container}>
        <NavigationCardStack
          key={'super_stack'}
          onNavigateBack={this.props.onPopRoute}
          navigationState={this.props.navigationState}
          renderScene={renderScene.bind(this)}
          renderHeader={renderHeader.bind(this)}
          style={styles.navigatorCardStack}
        />
      </View>
    )
  }
}

function renderHeader (sceneProps: Object): React.Element {
  const route = sceneProps.scene.route
  if (route.navBarHidden) { return null }
  return (
    <MyHeader
      ref={(header) => { this.header = header }}
      {...sceneProps}
      onPopRoute={this.props.onPopRoute}
      onPressMenu={this.props.onPressMenu}
    />
  )
}

function renderScene (sceneProps: Object): React.Element {
  const route = sceneProps.scene.route
  const Component = route.component
  return (
    <View style={styles.container}>
      {getStatusBar(route)}
      <Component
        {...sceneProps}
        onPushRoute={this.props.onPushRoute}
        onPopRoute={this.props.onPopRoute}
        setDrawerLockMode={this.props.setDrawerLockMode}
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
  container: {
    flex: 1
  },
  navigatorCardStack: {
    flex: 20
  }
})
