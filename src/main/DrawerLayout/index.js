'use strict'

import React, {PropTypes} from 'react'
import {
  View,
  DrawerLayoutAndroid,
  Text,
  TouchableOpacity
} from 'react-native'

import CardNavigator from '../CardNavigator'
import {getMainAppItems} from '../../../data/routes'
import Colors from '../../../data/Colors'

export default class DrawerLayout extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      routeIndex: 0
    }
  }

  render () {
    const mainAppItems = getMainAppItems()
    const {key} = mainAppItems.items.routes[this.state.routeIndex]
    return (
      <DrawerLayoutAndroid
        ref={(comp) => {this._drawer = comp}}
        drawerWidth={200}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={this._getNavigationView.bind(this)}
      >
        <CardNavigator
          navigationState={mainAppItems[key]}
          onPressMenu={() => {
            this._drawer.openDrawer()
          }}
        />
      </DrawerLayoutAndroid>
    )
  }

  _getNavigationView() {
    const mainAppItems = getMainAppItems()
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}>
        {mainAppItems.items.routes.map((route, index) => {
          return (
            <TouchableOpacity
              key={route.key}
              style={{backgroundColor: '#fff'}}
              onPress={this._onPressMenuitem.bind(this, index)}
            >
              <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>{route.title}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  _onPressMenuitem (index) {
    if (this.state.routeIndex !== index) {
      this.setState({routeIndex: index})
    }
    this._drawer.closeDrawer()
  }
}
