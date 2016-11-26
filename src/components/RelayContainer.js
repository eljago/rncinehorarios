//@flow
'use strict'

import React, { PropTypes } from 'react';
import ReactNative, {
  View,
  TouchableHighlight,
  Text,
  StyleSheet,
} from 'react-native';
import Relay from 'react-relay';

import LoadingIndicator from './LoadingIndicator'

export default class RelayContainer extends React.Component {
  static propTypes = {
    component: Relay.PropTypes.Container,
    queryConfig: Relay.PropTypes.QueryConfig.isRequired,
    extraProps: PropTypes.object,
    onPushRoute: PropTypes.func,
    onPopRoute: PropTypes.func,
  };

  render() {
    const {
      component: Component,
      queryConfig,
      extraProps,
      onPushRoute,
      onPopRoute,
    } = this.props;
    
    return (
      <Relay.Renderer
        Container={Component}
        queryConfig={queryConfig}
        environment={Relay.Store}
        render={({done, error, props, retry, stale}) => {
          if (error) {
            return (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>{error.message}</Text>
                <TouchableHighlight
                  underlayColor={'red'}
                  onPress={retry}>
                  <Text>
                    Retry?
                  </Text>
                </TouchableHighlight>
              </View>
            );
          }
          else if (props) {
            return (
              <View style={{flex: 1}}>
                <Component
                  ref={(comp) => { this.comp = comp; }}
                  onPushRoute={onPushRoute}
                  onPopRoute={onPopRoute}
                  {...extraProps}
                  {...props}
                />
              </View>
            );
          }
          else {
            return <LoadingIndicator />;
          }
        }}
      />
    );
  }

  onRightAction() {
    if (this.comp.refs.component.onRightAction) {
      this.comp.refs.component.onRightAction();
    }
  }
}