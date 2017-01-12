// @flow
'use strict'

import React from 'react'
import Relay from 'react-relay'
import {
  View
} from 'react-native'

import config from '../../data/config'

import {
  GoogleAnalyticsTracker,
  GoogleAnalyticsSettings
} from 'react-native-google-analytics-bridge'

import Orientation from 'react-native-orientation'
import MainApp from './MainApp'


Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(`${config.URL}${config.graphqlPath}`, {
    headers: config.headers,
    fetchTimeout: 30000,
    retryDelays: [5000, 10000]
  })
)
export default class CineHorariosApp extends React.Component {

  constructor (props) {
    super(props)
    GoogleAnalyticsSettings.setDispatchInterval(30)
    GoogleAnalyticsSettings.setDryRun(false)
  }

  componentDidMount () {
    Orientation.lockToPortrait()
  }

  render () {
    return <MainApp reportScreenView={reportScreenView}/>
  }
}

function reportScreenView (screenView) {
  let tracker = new GoogleAnalyticsTracker('UA-89600675-1')
  tracker.trackScreenView(screenView)
}
