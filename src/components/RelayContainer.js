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
    component: PropTypes.func.isRequired,
    relayParams: PropTypes.object,
    extraProps: PropTypes.object,
    onPushRoute: PropTypes.func,
    onPopRoute: PropTypes.func,
  };

  render() {
    const {
      component: Component,
      relayParams,
      extraProps,
      onPushRoute,
      onPopRoute,
    } = this.props;
    
    return (
      <Relay.RootContainer
        Component={Component}
        route={new ViewerQueryConfig(relayParams)}
        forceFetch={false}
        onReadyStateChange={(currentReadyState) => {
          
        }}
        renderFetched={(data, readyState) => {
          return (
            <View style={styles.container}>
              <Component
                onPushRoute={onPushRoute}
                onPopRoute={onPopRoute}
                {...extraProps}
                {...data}
              />
            </View>
          )
        }}
        renderFailure={(error, retry) => {
          return (
            <View>
              <Text>{error.message}</Text>
              <TouchableHighlight
                underlayColor={'red'}
                onPress={retry}>
                <Text>
                  Retry?
                </Text>
              </TouchableHighlight>
            </View>
          )
        }}
        renderLoading={() => {
          return(
            <LoadingIndicator />
          )
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  }
})

class ViewerQueryConfig extends Relay.Route {
  static routeName = 'ViewerQueryConfig';
  static queries = {
    viewer: () => Relay.QL`
      query Query {
        viewer
      }
    `
  };
}