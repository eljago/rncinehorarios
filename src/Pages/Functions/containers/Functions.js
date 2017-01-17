'use strict'

import React, { PropTypes } from 'react'
import {
  View,
  Animated,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Text
} from 'react-native'
import moment from 'moment'
const esLocale = require('moment/locale/es')
import _ from 'lodash'
import Storage from 'react-native-key-value-store'

import MyGiftedListView from '../../../components/MyGiftedListView'
import FunctionsCell from '../components/FunctionsCell'
import MenuItem from '../components/MenuItem'
import Colors from '../../../../data/Colors'
import {getShowRoute} from '../../../../data/routes'

const PICKER_OFFSET = 100

export default class Functions extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props)
    moment.updateLocale('es', esLocale)
    this.pickerHidden = true
    this._initFavorites()
    this.state = {
      currentDate: moment().format('YYYY-MM-DD'),
      pickerRight: new Animated.Value(0)
    }
    _.bindAll(this, [
      '_renderRow',
      '_onPress'
    ])
  }

  componentDidMount () {
    this.props.getHeader().rightComp.setup({
      title: _.upperFirst(moment().format('ddd DD')),
      onPress: () => {
        this.onRightAction()
      }
    })
  }

  render () {
    const date = this.state.currentDate
    const dataRows = getDataRows(date, this.props.viewer.shows)
    const {width} = Dimensions.get('window')
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        {this._getMenu()}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: this.state.pickerRight,
            width: width,
            backgroundColor: 'white'
          }}
        >
          <MyGiftedListView
            key={date}
            tabLabel={date}
            renderRow={this._renderRow}
            dataRows={dataRows}
            forceFetch={this.props.relay.forceFetch}
          />
        </Animated.View>
      </View>
    )
  }

  _getMenu () {
    return (
      <View style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: PICKER_OFFSET + 50,
        backgroundColor: Colors.tabBar
      }}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 50
          }}>
          {this._getFavoriteButton()}
          {this._getDateMenuItems()}
        </ScrollView>
      </View>
    )
  }

  onRightAction () {
    Animated.spring(
      this.state.pickerRight,
      {
        toValue: this.pickerHidden ? PICKER_OFFSET : 0,
        friction: 7
      }
    ).start()
    this.pickerHidden = !this.pickerHidden
  }

  _renderRow (rowData, sectionID, rowID, highlightRow) {
    return (
      <FunctionsCell
        rowNumber={rowData.rowNumber}
        title={rowData.name}
        cover={rowData.cover}
        functions={rowData.functions}
        onPress={() => this._onPress(rowData)}
      />
    )
  }

  _onPress (rowData) {
    const showRoute = getShowRoute(rowData.show_id, rowData.name)
    this.props.onPushRoute(showRoute, true)
  }

  _getDateMenuItems () {
    let dates = []
    for (var i = 0; i < 7; i++) {
      dates.push(moment().add(i, 'days'))
    }
    return dates.map((date) =>
      <MenuItem
        key={date.format('YYYY-MM-DD')}
        onPress={() => {
          this._onPressMenuItem(date)
        }}
        selected={date.format('YYYY-MM-DD') === this.state.currentDate}
        title={_.upperFirst(date.format('ddd DD'))}
      />
    )
  }

  _onPressMenuItem (date) {
    this.setState({currentDate: date.format('YYYY-MM-DD')})
    this.onRightAction()
    this.props.getHeader().rightComp.setup({
      title: _.upperFirst(date.format('ddd DD'))
    })
  }

  _getFavoriteButton () {
    return (
      <TouchableOpacity
        key='favoriteButton'
        onPress={this._onPressFavorite.bind(this)}
      >
        <Text style={{color: 'white'}}>{this.state.isFavorite ? 'is favorite' : 'not favorite'}</Text>
      </TouchableOpacity>
    )
  }

  async _initFavorites () {
    try {
      let favorites = await Storage.get('favoriteTheaters', [])
      if (favorites == null) {
        await Storage.set('favoriteTheaters', [])
        this.setState({isFavorite: false})
      }
      else {
        this.setState({isFavorite: favorites.indexOf(this.props.theaterId) > -1})
      }
    }
    catch(e) {
      console.log('caught error', e);
    }
  }

  async _onPressFavorite () {
    try{
        const {theaterId} = this.props
        let favorites = await Storage.get('favoriteTheaters', [])
        if (favorites == null) {
          await Storage.set('favoriteTheaters', [])
        }
        const index = favorites.indexOf(theaterId);
        if (index > -1) { // REMOVE FROM FAVORITES
          favorites.splice(index, 1);
        }
        else { // ADD TO FAVORITES
          favorites.push(theaterId)
        }
        console.log(favorites)
        await Storage.set('favoriteTheaters', favorites)
        this.setState({isFavorite: favorites.indexOf(theaterId) > -1})
    }
    catch(e){
        console.log('caught error', e);
        // Handle exceptions
    }
  }
}

function getDataRows (date, showsFunctions) {
  let dataRows = []
  for (const show of showsFunctions) {
    const {name, cover, show_id} = show

    const functions = show.functions.filter((obj) => {
      return (obj.date === date)
    })

    if (functions.length > 0) {
      dataRows.push({
        name: name,
        cover: cover,
        functions: functions,
        show_id: show_id
      })
    }
  }
  return dataRows
}
