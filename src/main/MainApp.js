'use strict'

import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'

import CardNavigator from './CardNavigator'
import {getMenuRoutes} from '../../data/routes'
import DrawerLayout from 'react-native-drawer-layout'
import Colors from '../../data/Colors'

export default class MainApp extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      navigationState: {
        index: 0,
        routes: [getMenuRoutes()[0]]
      }
    }
  }

  render () {
    return (
      <DrawerLayout
        ref={(comp) => { this._drawer = comp }}
        drawerWidth={200}
        drawerPosition={DrawerLayout.positions.Right}
        renderNavigationView={this._getNavigationView.bind(this)}
      >
        <CardNavigator
          navigationState={this.state.navigationState}
          onPressMenu={() => {
            this._drawer.openDrawer()
          }}
        />
      </DrawerLayout>
    )
  }

  _getNavigationView () {
    return (
      <View style={styles.menu}>
        {getMenuRoutes().map((route, index) => {
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.menuButton}
              onPress={this._onPressMenuitem.bind(this, index)}
            >
              <Text style={styles.menuText}>{route.title}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  _onPressMenuitem (index) {
    this.setState({
      navigationState: {
        index: 0,
        routes: [getMenuRoutes()[index]]
      }
    })
    this._drawer.closeDrawer()
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