//@flow
'use strict'

import React from 'react';
import {View, StatusBar} from 'react-native';

import MyHeader from './MyHeader';

function renderHeader(sceneProps: Object): React.Element {
  return (
    <MyHeader
      ref={(header) => { this.header = header; }}
      {...sceneProps}
      onPopRoute={this._onPopRoute}
    />
  );
}

function renderScene(sceneProps: Object): React.Element {
  const route = sceneProps.scene.route;
  const Component = route.component;
  return (
    <View style={{flex: 1}}>
      {getStatusBar(route)}
      <Component
        {...sceneProps}
        onPushRoute={this._onPushRoute}
        onPopRoute={this._onPopRoute}
        getHeader={() => this.header}
        {...route.props}
      />
    </View>
  );
}

function getStatusBar(route: Object): React.Element {
  return route.getStatusBar ? route.getStatusBar() :
    <StatusBar barStyle="light-content" />;
}

export {renderHeader, renderScene};