// @flow
'use strict'

import React, { PropTypes } from 'react';
import Relay from 'react-relay';

import config from '../../data/config'

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(`${config.URL}${config.graphqlPath}`, {
    headers: config.headers,
    fetchTimeout: 30000,
    retryDelays: [5000, 10000]
  })
);

import SuperNavigator from './SuperNavigator';

export default class CineHorariosApp extends React.Component {
  render() {
    return (
      <SuperNavigator />
    );
  }
}