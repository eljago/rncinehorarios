//@flow
'use strict'

import React, { PropTypes } from 'react'
import {View, Text} from 'react-native'


export default class Show extends React.Component {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>
          {this.props.viewer.show.name}
          {this.props.viewer.show.name_original}
          {this.props.viewer.show.year}
        </Text>
      </View>
    );
  }
}