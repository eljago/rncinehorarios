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
import codePush from "react-native-code-push"

import MainApp from './MainApp'

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(`${config.URL}${config.graphqlPath}`, {
    headers: config.headers,
    fetchTimeout: 30000,
    retryDelays: [5000, 10000]
  })
)
class CineHorariosApp extends React.Component {

  constructor (props) {
    super(props)
    GoogleAnalyticsSettings.setDispatchInterval(30)
    GoogleAnalyticsSettings.setDryRun(false)
  }

  componentDidMount () {
    Orientation.lockToPortrait()
  }

  render () {
    return <MainApp/>
  }
}

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.ON_NEXT_RESUME
})(CineHorariosApp);
