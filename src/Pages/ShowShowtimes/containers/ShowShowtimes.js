//@flow
'use strict'

import React from 'react'
import {
  View,
  NavigationExperimental
} from 'react-native'
import update from 'react/lib/update'
import moment from 'moment'
import _ from 'lodash'

import CardNavigator from '../../../main/CardNavigator'
import ShowFavoritesRelay from './ShowFavoritesRelay'
import {ViewerQueryConfig, getCacheTime} from '../../../utils/ViewerQueryConfig'
import DatesMenu from '../../../components/DatesMenu'
import RelayContainer from '../../../components/Relay/RelayContainer'

const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils
} = NavigationExperimental

type Props = {
  showId: number,
  showName: string,
  theaterIds: number[]
}
type Route = {
  key: string,
  title: string,
  component: ReactClass<{}>,
  relay: Object,
  props: Object
}
type State = {
  currentDate: string,
  menuVisible: bool,
  navigationState: {index: number, routes: Array<Route>}
}
interface CardPage<React$Element> {
  getTopPage: () => React$Element,
  getAllPages: () => Array<RelayContainer>
}

export default class ShowShowtimes extends React.Component {
  static propTypes: Props
  state: State
  _cardNav: CardPage<{}>
  _currentDate: Object

  constructor (props: Props) {
    super(props)
    const currentDate = moment().format('YYYY-MM-DD')
    this.state = {
      currentDate: currentDate,
      menuVisible: false,
      navigationState: {
        index: 0,
        routes: [{
          key: 'show_favorites',
          title: props.showName,
          component: ShowFavoritesRelay,
          relay: {
            queryConfig: new ViewerQueryConfig({
              cacheTime: getCacheTime(),
              show_id: props.showId,
              theater_ids: props.theaterIds
            })
          },
          props: {
            showName: props.showName,
            showId: props.showId,
            currentDate: currentDate
          },
          navBarHidden: true
        }]
      }
    }
  }

  onFocus () {
    this._setCurrentDate(moment())
    this._updateRightComponent()
    this._updateLeftComponent()
  }

  render () {
    let dates = []
    for (var i = 0; i < 7; i++) {
      dates.push(moment().add(i, 'days'))
    }
    return (
      <View style={{flex: 1}}>
        <CardNavigator
          key={'show_showtimes_nav'}
          ref={(comp) => {this._cardNav = comp}}
          navigationState={this.state.navigationState}
          onPushRoute={this._onPushRoute.bind(this)}
          onPopRoute={this._onPopRoute.bind(this)}
          dontRenderHeader
        />
        <DatesMenu
          visible={this.state.menuVisible}
          onPressMenuItem={this._onPressMenuItem.bind(this)}
          currentDate={this.state.currentDate}
          dates={dates}
          onClose={() => {this.setState({menuVisible: false})}}
        />
      </View>
    )
  }

  _onPressMenuItem (date) {
    this._setCurrentDate(date)
    this._updateRightComponent()
    this._onRightAction()
  }

  _setCurrentDate (date) {
    this._currentDate = date
    const currentDate = this._currentDate.format('YYYY-MM-DD')
    this.setState({currentDate})
    if (this._cardNav) {
      for (const cardNavView of this._cardNav.getAllPages()) {
        if (cardNavView && cardNavView._comp) {
          cardNavView._comp.refs.component.updateDate(currentDate)
        }
      }
    }
  }

  _onPushRoute (route: Route) {
    let {navigationState} = this.state;
    const newNavState = NavigationStateUtils.push(navigationState, route)
    if (navigationState !== newNavState) {
      this.setState({navigationState: newNavState})
    }
  }

  _onPopRoute () {
    let {navigationState} = this.state;
    const newNavState = NavigationStateUtils.pop(navigationState)
    if (navigationState !== newNavState) {
      this.setState({navigationState: newNavState})
      return true
    }
    return false
  }


  // RIGHT COMPONENT

  _onRightAction () {
    this.setState({menuVisible: !this.state.menuVisible})
  }

  _updateRightComponent () {
    const header = this.props.getHeader()
    if (header) {
      header.rightComp.setup({
        title: _.upperFirst(this._currentDate.format('ddd DD')),
        onPress: this._onRightAction.bind(this)
      })
    }
  }


  // LEFT COMPONENT

  _updateLeftComponent () {
    const header = this.props.getHeader()
    if (header) {
      header.leftComp.setup({
        image: require('../../../../assets/back-icon.png'),
        onPress: this._onLeftAction.bind(this)
      })
    }
  }

  _onLeftAction () {
    if (this.state.navigationState.index === 0) {
      this.props.onPopRoute()
    }
    else {
      this._onPopRoute()
    }
  }
}
