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

  constructor (props) {
    super(props)
    moment.updateLocale('es', esLocale)
    this._isFavorite = false
    this._currentDate = moment()
    this.pickerHidden = true

    this.state = {
      currentDate: this._currentDate.format('YYYY-MM-DD'),
      pickerRight: new Animated.Value(0)
    }
    this._loadFavorites()
  }

  componentDidMount () {
    this._setCurrentDate(moment())
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.viewer == null && this.props.viewer != null) {
      this._updateRightComponent2()
    }
  }

  render () {
    const {viewer, relay} = this.props
    const {currentDate, pickerRight} = this.state
    let dates = []
    for (var i = 0; i < 7; i++) {
      dates.push(moment().add(i, 'days'))
    }
    const shows = viewer ? viewer.shows : []
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Menu
          menuOffset={PICKER_OFFSET}
          onPressMenuItem={this._onPressMenuItem.bind(this)}
          currentDate={currentDate}
          dates={dates}
        />
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: pickerRight,
            width: Dimensions.get('window').width
          }}
        >
          <MyGiftedListView
            key={currentDate}
            tabLabel={currentDate}
            renderRow={this._renderRow.bind(this)}
            dataRows={getDataRows(currentDate, shows)}
            forceFetch={relay.forceFetch}
          />
        </Animated.View>
      </View>
    )
  }

  onFocus () {
    this._updateRightComponent()
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
          activeOpacity: 1
        },
        onPress: this._onPressFavorite.bind(this)
      })
    }
  }

  _updateRightComponent2 () {
    const header = this.props.getHeader()
    if (header) {
      header.rightComp2.setup({
        title: _.upperFirst(this._currentDate.format('ddd DD')),
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
    this._setCurrentDate(date)
    this._updateRightComponent2()
    this.onRightAction2()
  }

  _setCurrentDate (date) {
    this._currentDate = date
    this.setState({currentDate: this._currentDate.format('YYYY-MM-DD')})
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
        this._updateRightComponent()
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
