// @flow
'use strict'

import React from 'react'
import Relay from 'react-relay'
import {
  View,
  Platform,
  AppState
} from 'react-native'

import config from '../../data/config'

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(`${config.URL}${config.graphqlPath}`, {
    headers: config.headers,
    fetchTimeout: 30000,
    retryDelays: [5000, 10000]
  })
)

import {
  GoogleAnalyticsTracker,
  GoogleAnalyticsSettings
} from 'react-native-google-analytics-bridge'

import Orientation from 'react-native-orientation'

import CardNavigator from './CardNavigator'
import DrawerLayout from './DrawerLayout'
import {getMainAppRoute} from '../../data/routes'

export default class CineHorariosApp extends React.Component {

  constructor (props) {
    super(props)
    GoogleAnalyticsSettings.setDispatchInterval(30)
    GoogleAnalyticsSettings.setDryRun(false)
    reportAnalytics()
  }

  componentDidMount () {
    Orientation.lockToPortrait()
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  render () {
    if (Platform.OS === 'ios') {
      return (
        <CardNavigator navigationState={getMainAppRoute()} />
      )
    } else if (Platform.OS === 'android') {
      return <DrawerLayout />
    }
    return <View />
  }

  _handleAppStateChange (currentAppState) {
    reportAnalytics()
  }
}

function reportAnalytics () {
  let tracker = new GoogleAnalyticsTracker('UA-89600675-1')
  tracker.trackScreenView('Cine Horarios')
}
