'use strict'

import React, {PropTypes} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import update from 'react/lib/update'

import {getMenuRoutes} from '../../data/routes'
import Colors from '../../data/Colors'

export default class Menu extends React.Component {
  static propTypes = {
    selectedMenuKey: PropTypes.string.isRequired,
    onPressMenuItem: PropTypes.func.isRequired
  }

  render () {
    const {selectedMenuKey} = this.props
    return (
      <View style={styles.menu}>
        {getMenuRoutes().map((route) => {
          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.menuButton, {
                backgroundColor: route.key === selectedMenuKey ? 'rgba(0,0,0,0.5)' : 'transparent',
                borderTopWidth: route.key === selectedMenuKey ? 0.5 : 0,
                borderTopColor: '#000',
                borderBottomWidth: route.key === selectedMenuKey ? 0.5 : 0,
                borderBottomColor: '#2F2F2F',
              }]}
              onPress={() => {this.props.onPressMenuItem(route.key)}}
            >
              <Text style={styles.menuText}>{route.title}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    backgroundColor: Colors.menuBackground,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  menuButton: {

  },
  menuText: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10
  }
})