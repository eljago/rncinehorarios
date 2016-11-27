//@flow
'use strict'

import React from 'react';
import { TouchableOpacity, View } from 'react-native';

export default class HeaderButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      onPressButton: null,
      children: null,
    }
  }

  render() {
    const children = this.state.children ? this.state.children : <View />;
    return (
      <TouchableOpacity
        onPress={this.state.onPressButton}
      >
        {children}
      </TouchableOpacity>
    );
  }

  setup(options) {
    this.setState({
      ...options
    });
  }
}