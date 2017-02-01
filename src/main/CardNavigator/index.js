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

type Props = {
  navigationState: Object,
  onPressMenu: () => void,
  onPushRoute: (props: Object, relay: Object) => void,
  onPopRoute: () => void,
  setDrawerLockMode: (lockMode: 'unlocked' | 'locked-closed' | 'locked-open') => void
}
interface CardPage<React$Element> {
  onFocus: () => void
}

// Main Navigator of the app. Receives the whole app navigaiton state passed from props.
export default class CardNavigator extends React.Component {
  static propTypes: Props
  _cardStack: React$Element<NavigationCardStack>
  _header: React$Element<MyHeader>
  _pages: {[id: string]: CardPage<{}>}
  _pages = {}

  constructor (props: Props) {
    super(props)
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

  _renderScene (sceneProps: Object): React$Element<{}> {
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
    const backgroundStyle = {
      backgroundColor: 'white',
      ...route.backgroundStyle
    }

    if (relay) {
      return (
        <View style={[styles.container, backgroundStyle]}>
          {getStatusBar ? getStatusBar() : <StatusBar barStyle='light-content' />}
          <RelayContainer
            ref={(comp) => {this._pages[key] = comp}}
            queryConfig={relay.queryConfig}
            component={Component}
            extraProps={extraProps}
            backgroundStyle={backgroundStyle}
          />
        </View>
      )
    }
    return (
      <View style={[styles.container, backgroundStyle]}>
        {getStatusBar ? getStatusBar() : <StatusBar barStyle='light-content' />}
        <Component
          ref={(comp) => {this._pages[key] = comp}}
          {...extraProps}
        />
      </View>
    )
  }

  _renderHeader (sceneProps: Object): ?React$Element<{}> {
    const route = sceneProps.scene.route
    console.log(route)
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

  onFocusChanged (key: 'string') {
    const keyView: CardPage<{}> = this._pages[key]
    if (keyView && keyView.onFocus) {
      keyView.onFocus()
    }
  }

  getTopPage (): ?React$Element<{}> {
    const {navigationState} = this.props
    const {index, routes} = navigationState
    const key = routes[index].key
    if (this._pages[key]) {
      return this._pages[key]
    }
    return null
  }

  getAllPages (): React$Element<{}>[] {
    const {navigationState} = this.props
    const {routes} = navigationState
    let pages = []
    for (const route of routes) {
      const page = this._pages[route.key]
      if (page) {
        pages.push(page)
      }
    }
    return pages
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
