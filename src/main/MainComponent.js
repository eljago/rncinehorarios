// @flow
'use strict'

import React, { PropTypes } from 'react';
import {createAppNavigationState, updateAppNavigationState} from '../Navigation/NavigationState';

import MainNavigator from '../Navigation/MainNavigator'

export default class MainComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = createAppNavigationState();
    this._navigate = this._navigate.bind(this);
  }

  render(): React.Element {
    return (
      <MainNavigator
        appNavigationState={this.state}
        navigate={this._navigate}
      />
    );
  }

  // HANDLE BACK ACTION
  handleBackAction(): boolean {
    return this._navigate({type: 'pop'});
  }

  // NAVIGATE
  _navigate(action: Object): void {
    const state = updateAppNavigationState(this.state, action);
    if (this.state !== state) {
      this.setState(state);
    }
  }
}
