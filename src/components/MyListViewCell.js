'use strict'

import React, { PropTypes } from 'react'
import { TouchableHighlight, StyleSheet, View } from 'react-native'

import RightAccessoryView from './RightAccessoryView'

export default class MyListViewCell extends React.Component {

  static propTypes = {
    rowNumber: PropTypes.number,
    onPress: PropTypes.func,
    hideAccessoryView: PropTypes.bool
  };
  static defaultProps = {
    hideAccessoryView: false
  }

  render () {
    const {rowNumber, onPress, children, style} = this.props
    const viewStyle = {backgroundColor: rowNumber % 2 === 0 ? 'white' : '#f1f0f0'}

    return (
      <TouchableHighlight
        style={[styles.container, viewStyle, style]}
        onPress={onPress}
        underlayColor={"#e6eaf0"}
      >
        <View style={[styles.rowContainer]}>
          <View style={{flex: 1}}>
            {children}
          </View>
          {this._getAccessoryView()}
        </View>
      </TouchableHighlight>
    )
  }

  _getAccessoryView () {
    if (this.props.hideAccessoryView) {
      return null
    } else {
      return (<RightAccessoryView />)
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
})
