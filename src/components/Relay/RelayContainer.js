// @flow
'use strict'

import React, { PropTypes } from 'react'
import {View} from 'react-native'
import Relay from 'react-relay'

import RetryView from './RetryView'
import LoadingIndicator from './LoadingIndicator'

export default class RelayContainer extends React.Component {
  static propTypes = {
    queryConfig: Relay.PropTypes.QueryConfig.isRequired,
    component: PropTypes.func.isRequired,
    extraProps: PropTypes.object,
    backgroundStyle: PropTypes.object
  };

  render () {
    const {
      component: Component,
      queryConfig,
      extraProps,
      backgroundStyle
    } = this.props

    return (
      <Relay.Renderer
        Container={Component}
        queryConfig={queryConfig}
        environment={Relay.Store}
        render={({done, error, props, retry, stale}) => {
          if (!props) {
            props = {viewer: null}
          }
          return (
            <View style={[{flex: 1}, this.props.backgroundStyle]}>
              <Component
                ref={(comp) => {this._comp = comp}}
                {...props}
                {...extraProps}
              />
              {this._getOverlayView(error, props, retry)}
            </View>
          )
        }}
      />
    )
  }

  _getOverlayView (error, props, retry) {
    if (error) {
      return <RetryView onPress={retry} backgroundStyle={this.props.backgroundStyle}/>
    }
    else if (props.viewer == null) {
      return <LoadingIndicator backgroundStyle={this.props.backgroundStyle} />
    }
    else {
      return null
    }
  }

  onFocus () {
    if (this._comp && this._comp && this._comp.refs.component && this._comp.refs.component.onFocus) {
      this._comp.refs.component.onFocus()
    }
  }
}