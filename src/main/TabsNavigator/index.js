// @flow
'use strict'

import React, { PropTypes } from 'react'
import {
  View,
  TabBarIOS,
  BackAndroid
} from 'react-native'

import CardNavigator from '../CardNavigator'
import {getMainAppItems} from '../../../data/routes'
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
      selectedTab: getMainAppItems().items.routes[0].key
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
    const mainAppItems = getMainAppItems()
    return mainAppItems.items.routes.map((route) => {
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
          <View style={{flex: 1, paddingBottom: 50}}>
            <CardNavigator navigationState={mainAppItems[key]}/>
          </View>
        </TabBarIOS.Item>
      )
    })
  }
}
