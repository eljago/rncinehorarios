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
import RelayContainer from '../../components/Relay/RelayContainer'

// Main Navigator of the app. Receives the whole app navigaiton state passed from props.
export default class CardNavigator extends React.Component {
  static propTypes = {
    navigationState: PropTypes.object.isRequired,
    onPressMenu: PropTypes.func.isRequired,
    onPushRoute: PropTypes.func.isRequired,
    onPopRoute: PropTypes.func.isRequired,
    setDrawerLockMode: PropTypes.func.isRequired
  }
  _pages = {

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
          ref={(comp) => {this._cardStack = comp}}
          onNavigateBack={this.props.onPopRoute}
          navigationState={this.props.navigationState}
          renderScene={this._renderScene.bind(this)}
          renderHeader={this._renderHeader.bind(this)}
          style={styles.navigatorCardStack}
        />
      </View>
    )
  }

  _renderScene (sceneProps: Object) {
    const route = sceneProps.scene.route
    const {
      component: Component,
      props,
      relay,
      key,
      getStatusBar
    } = route
    const {
      onPushRoute,
      onPopRoute,
      setDrawerLockMode
    } = this.props
    const extraProps = {
      ...sceneProps,
      ...props,
      getHeader: () => this._header,
      onPushRoute: onPushRoute,
      onPopRoute: onPopRoute,
      setDrawerLockMode: setDrawerLockMode
    }

    if (relay) {
      return (
        <View style={styles.container}>
          {getStatusBar ? getStatusBar() : <StatusBar barStyle='light-content' />}
          <RelayContainer
            ref={(comp) => {this._pages[key] = comp}}
            queryConfig={relay.queryConfig}
            component={Component}
            extraProps={extraProps}
          />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        {getStatusBar ? getStatusBar() : <StatusBar barStyle='light-content' />}
        <Component
          ref={(comp) => {this._pages[key] = comp}}
          {...extraProps}
          {...props}
        />
      </View>
    )
  }

  _renderHeader (sceneProps: Object) {
    const route = sceneProps.scene.route
    if (route.navBarHidden) { return null }
    
    return (
      <MyHeader
        ref={(comp) => {this._header = comp}}
        {...sceneProps}
        onPopRoute={this.props.onPopRoute}
        onPressMenu={this.props.onPressMenu}
      />
    )
  }

  onFocusChanged (key) {
    const keyView = this._pages[key]
    if (keyView && keyView.onFocus) {
      keyView.onFocus()
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navigatorCardStack: {
    flex: 20
  }
})
