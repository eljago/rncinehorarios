'use strict'

import React, { PropTypes } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'

import RightAccessoryView from './RightAccessoryView'

export default class MyListViewCell extends React.Component {

  static propTypes = {
    rowNumber: PropTypes.number,
    onPress: PropTypes.func,
    hideAccessoryView: PropTypes.bool,
    style: PropTypes.object
  };
  static defaultProps = {
    hideAccessoryView: false
  }

  render () {
    const {rowNumber, onPress, children, style} = this.props
    const cellBackgroundColor = rowNumber % 2 === 0 ? 'white' : '#f4f4f4'

    return (
      <TouchableOpacity
        style={[styles.container, {backgroundColor: cellBackgroundColor}, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.rowContainer]}>
          <View style={{flex: 1}}>
            {children}
          </View>
          {this._getAccessoryView()}
        </View>
      </TouchableOpacity>
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
