'use strict'

import React, {PropTypes} from 'react'
import {
  View,
  ScrollView,
  StyleSheet
} from 'react-native'
import moment from 'moment'
import _ from 'lodash'

import MenuItem from '../components/MenuItem'
import Colors from '../../../../data/Colors'

export default class Menu extends React.Component {
  static propTypes = {
    menuOffset: PropTypes.number,
    onPressMenuItem: PropTypes.func,
    currentDate: PropTypes.string.isRequired,
    dates: PropTypes.array
  }

  render () {
    return (
      <View style={[styles.container, {width: this.props.menuOffset + 50}]}>
        <ScrollView
          contentContainerStyle={styles.contentContainerStyle}>
          {this._getDateMenuItems()}
        </ScrollView>
      </View>
    )
  }

  _getDateMenuItems () {
    return this.props.dates.map((date) => {
      const dateString = date.format('YYYY-MM-DD')
      const dateStringShort = _.upperFirst(date.format('ddd DD'))
      return (
        <MenuItem
          key={dateString}
          onPress={() => {
            this.props.onPressMenuItem(date)
          }}
          selected={dateString === this.props.currentDate}
          title={dateStringShort}
        />
      )
    })
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.tabBar
  },
  contentContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 50
  }
})