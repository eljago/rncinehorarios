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

import Firestack from 'react-native-firestack'

import SuperNavigator from './SuperNavigator'

export default class CineHorariosApp extends React.Component {

  constructor (props) {
    super(props)
    const firestack = new Firestack()
    firestack.analytics.logEventWithName('launch', {
      'screen': 'Main screen'
    })
    .then(res => console.log('Sent event named launch'))
    .catch(err => {
      console.error('You should never end up here')
      console.error(err)
    })
  }

  render () {
    return (
      <SuperNavigator />
    )
  }
}
