// @flow
'use strict'

import React from 'react'
import Relay from 'react-relay'
import {
  View,
  Platform
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
  GoogleTagManager,
  GoogleAnalyticsSettings
} from 'react-native-google-analytics-bridge';

import Orientation from 'react-native-orientation'

import CardNavigator from './CardNavigator'
import DrawerLayout from './DrawerLayout'
import {getMainAppRoute} from '../../data/routes'

export default class CineHorariosApp extends React.Component {

  constructor(props) {
    super(props)
    GoogleAnalyticsSettings.setDispatchInterval(30);
    GoogleAnalyticsSettings.setDryRun(false);
    let tracker = new GoogleAnalyticsTracker('UA-89600675-1');
    tracker.setAppName('Cine Horarios');
    tracker.trackScreenView('Home');
  }

  componentDidMount () {
    Orientation.lockToPortrait()
  }

  render () {
    if (Platform.OS === 'ios') {
      return (
        <CardNavigator navigationState={getMainAppRoute()} />
      )
    }
    else if (Platform.OS === 'android') {
      return <DrawerLayout />
    }
    return <View />
  }
}
