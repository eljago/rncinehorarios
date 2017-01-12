// @flow
'use strict'

import React, { PropTypes } from 'react'
import {
  View,
  TouchableHighlight,
  Text
} from 'react-native'
import Relay from 'react-relay'

import LoadingIndicator from './LoadingIndicator'

export default class RelayContainer extends React.Component {
  static propTypes = {
    component: Relay.PropTypes.Container,
    queryConfig: Relay.PropTypes.QueryConfig.isRequired,
    extraProps: PropTypes.object,
    onPushRoute: PropTypes.func,
    onPopRoute: PropTypes.func,
    setDrawerLockMode: PropTypes.func,
    getHeader: PropTypes.func,
    backgroundStyle: PropTypes.object
  };

  render () {
    const {
      component: Component,
      queryConfig,
      extraProps,
      onPushRoute,
      onPopRoute,
      setDrawerLockMode,
      getHeader,
      backgroundStyle
    } = this.props

    return (
      <Relay.Renderer
        Container={Component}
        queryConfig={queryConfig}
        environment={Relay.Store}
        render={({done, error, props, retry, stale}) => {
          if (error) {
            return (
              <TouchableHighlight
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={retry}>
                <Text style={{
                  fontSize: 24,
                  textAlign: 'center'
                }}>
                  Presiona para reintentar
                </Text>
              </TouchableHighlight>
            )
          } else if (props) {
            return (
              <View style={[{flex: 1}, backgroundStyle]}>
                <Component
                  ref={(comp) => { this.comp = comp }}
                  onPushRoute={onPushRoute}
                  onPopRoute={onPopRoute}
                  setDrawerLockMode={setDrawerLockMode}
                  getHeader={getHeader}
                  {...extraProps}
                  {...props}
                />
              </View>
            )
          } else {
            return <LoadingIndicator backgroundStyle={backgroundStyle}/>
          }
        }}
      />
    )
  }
}
