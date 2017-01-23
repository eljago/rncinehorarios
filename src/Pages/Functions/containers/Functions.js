'use strict'

import React, { PropTypes } from 'react'
import {
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
  Text
} from 'react-native'
import moment from 'moment'
const esLocale = require('moment/locale/es')
import _ from 'lodash'

import MyGiftedListView from '../../../components/MyGiftedListView'
import FunctionsCell from '../components/FunctionsCell'
import Menu from '../components/Menu'
import {getShowRoute} from '../../../../data/routes'
import {toggleFavoriteTheater, isFavoriteTheater} from '../../../utils/Favorites'

const PICKER_OFFSET = 100

export default class Functions extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired,
    theater: PropTypes.object.isRequired
  };
  _isFavorite = false

  constructor (props) {
    super(props)
    moment.updateLocale('es', esLocale)
    this.pickerHidden = true
    this.state = {
      currentDate: moment().format('YYYY-MM-DD'),
      pickerRight: new Animated.Value(0)
    }
    this._loadFavorites()
  }

  render () {
    const date = this.state.currentDate
    let dates = []
    for (var i = 0; i < 7; i++) {
      dates.push(moment().add(i, 'days'))
    }
    const shows = this.props.viewer ? this.props.viewer.shows : []
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Menu
          menuOffset={PICKER_OFFSET}
          onPressMenuItem={this._onPressMenuItem.bind(this)}
          currentDate={this.state.currentDate}
          dates={dates}
        />
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: this.state.pickerRight,
            width: Dimensions.get('window').width,
            backgroundColor: 'white'
          }}
        >
          <MyGiftedListView
            key={date}
            tabLabel={date}
            renderRow={this._renderRow.bind(this)}
            dataRows={getDataRows(date, shows)}
            forceFetch={this.props.relay.forceFetch}
          />
        </Animated.View>
      </View>
    )
  }

  onFocus () {
    console.log('on focus functions')
    this._updateRightComponent()
    this._updateRightComponent2()
  }

  _updateRightComponent () {
    const header = this.props.getHeader()
    if (header) {
      header.rightComp.setup({
        image: require('../../../../assets/Heart.png'),
        style: {
          tintColor: this._isFavorite ? 'white' : '#E58C7A'
        },
        props: {
          activeOpacity: 0.8
        },
        onPress: this._onPressFavorite.bind(this)
      })
    }
  }

  _updateRightComponent2 () {
    const header = this.props.getHeader()
    if (header) {
      header.rightComp2.setup({
        title: _.upperFirst(moment().format('ddd DD')),
        onPress: this.onRightAction2.bind(this)
      })
    }
  }

  onRightAction () {
    this._onPressFavorite()
  }

  onRightAction2 () {
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
        onPress={this._onPress.bind(this, rowData)}
      />
    )
  }

  _onPress (rowData) {
    const props = {
      title: rowData.name
    }
    const relayProps = {
      show_id: rowData.show_id
    }
    this.props.onPushRoute(getShowRoute(props, relayProps))
  }

  _onPressMenuItem (date) {
    this.setState({currentDate: date.format('YYYY-MM-DD')})
    this.onRightAction2()
    this.props.getHeader().rightComp.setup({
      title: _.upperFirst(date.format('ddd DD'))
    })
  }

  _onPressFavorite () {
    toggleFavoriteTheater(this.props.theater, (result) => {
      if (result === true) {
        this._loadFavorites()
      }
    })
  }

  _loadFavorites () {
    isFavoriteTheater(this.props.theater, (result, isFavorite) => {
      if (result === true) {
        this._isFavorite = isFavorite
      }
    })
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
