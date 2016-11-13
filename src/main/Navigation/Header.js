// @flow
'use strict';

import React, { PropTypes } from 'react'
import ReactNative, { NavigationExperimental } from 'react-native'

const {
  Header: NavigationHeader,
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

import createAppNavigationContainer from './CreateNavigationContainer';

export default createAppNavigationContainer(class extends React.Component {
  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    navigate: PropTypes.func.isRequired,
  };

  constructor(props: Object, context: any) {
    super(props, context);
    this._back = this._back.bind(this);
    this._renderTitleComponent = this._renderTitleComponent.bind(this);
  }

  render(): React.Element {
    return (
      <NavigationHeader
        {...this.props}
        renderTitleComponent={this._renderTitleComponent}
        onNavigateBack={this._back}
      />
    );
  }

  _back(): void {
    this.props.navigate({type: 'pop'});
  }

  _renderTitleComponent(props: Object): React.Element {
    const route = props.scene.route;
    return (
      <NavigationHeader.Title>
        {route.title ? route.title : route.key}
      </NavigationHeader.Title>
    );
  }
});