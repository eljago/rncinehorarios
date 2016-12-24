// @flow
'use strict'

import React from 'react'
import Relay from 'react-relay'

import config from '../../data/config'

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(`${config.URL}${config.graphqlPath}`, {
    headers: config.headers,
    fetchTimeout: 30000,
    retryDelays: [5000, 10000]
  })
)

import Orientation from 'react-native-orientation'

import SuperNavigator from './SuperNavigator'

export default class CineHorariosApp extends React.Component {

  componentDidMount () {
    Orientation.lockToPortrait()
  }

  render () {
    return (
      <SuperNavigator />
    )
  }
}
