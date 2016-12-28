// @flow
'use strict'

import React, { PropTypes } from 'react'
import {
  TabBarIOS,
  BackAndroid
} from 'react-native'

import CardNavigator from '../CardNavigator'
import {getTabBarRoutes} from '../../../data/routes'
import Colors from '../../../data/Colors'

export default class TabsNavigator extends React.Component {

  static propTypes = {
    onPushRoute: PropTypes.func,
    onPopRoute: PropTypes.func
  };

  constructor (props) {
    super(props)
    BackAndroid.addEventListener('hardwareBackPress', this._onPopRoute)
    this.state = {
      selectedTab: getTabBarRoutes().tabs.routes[0].key
    }
  }

  render () {
    return (
      <TabBarIOS
        unselectedTintColor={Colors.tabBarIcon}
        tintColor={Colors.tabBarIconSelected}
        barTintColor={Colors.tabBar}
      >
        {this._getTabItems()}
      </TabBarIOS>
    )
  }

  _getTabItems() {
    const tabBarRoute = getTabBarRoutes();
    return tabBarRoute.tabs.routes.map((route) => {
      const {key, title} = route
      return (
        <TabBarIOS.Item
          key={key}
          title={title}
          selected={this.state.selectedTab === key}
          onPress={() => {
            this.setState({selectedTab: key})
          }}
        >
          <CardNavigator initialNavigationState={tabBarRoute[key]}/>
        </TabBarIOS.Item>
      )
    })
  }
}
