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
import {
  getFavoriteTheaters,
  addFavoriteTheater
} from '../../../utils/Favorites'

const PICKER_OFFSET = 100

export default class Functions extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired
  };
  static defaultProps = {
    isFavorite: false
  }

  constructor (props) {
    super(props)
    moment.updateLocale('es', esLocale)
    this.pickerHidden = true
    this.state = {
      currentDate: moment().format('YYYY-MM-DD'),
      pickerRight: new Animated.Value(0)
    }
    _.bindAll(this, [
      '_renderRow',
      '_onPress'
    ])
    getFavoriteTheaters((result, favorites) => {
      if (result === true) {
        this.setState({
          isFavorite: favorites.indexOf(props.theaterId) > -1
        })
        this._updateRightComponent()
      }
    })
  }

  componentDidMount () {
    this._updateRightComponent2()
  }

  render () {
    const date = this.state.currentDate
    let dates = []
    for (var i = 0; i < 7; i++) {
      dates.push(moment().add(i, 'days'))
    }
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
            renderRow={this._renderRow}
            dataRows={getDataRows(date, this.props.viewer.shows)}
            forceFetch={this.props.relay.forceFetch}
          />
        </Animated.View>
      </View>
    )
  }

  _updateRightComponent () {
    this.props.getHeader().rightComp.setup({
      image: require('../../../../assets/Heart.png'),
      style: {
        tintColor: this.state.isFavorite ? 'white' : '#E58C7A'
      },
      props: {
        activeOpacity: 0.8
      },
      onPress: this._onPressFavorite.bind(this)
    })
  }

  _updateRightComponent2 () {
    this.props.getHeader().rightComp2.setup({
      title: _.upperFirst(moment().format('ddd DD')),
      onPress: this.onRightAction2.bind(this)
    })
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
        onPress={() => this._onPress(rowData)}
      />
    )
  }

  _onPress (rowData) {
    const showRoute = getShowRoute(rowData.show_id, rowData.name)
    this.props.onPushRoute(showRoute, true)
  }

  _onPressMenuItem (date) {
    this.setState({currentDate: date.format('YYYY-MM-DD')})
    this.onRightAction()
    this.props.getHeader().rightComp.setup({
      title: _.upperFirst(date.format('ddd DD'))
    })
  }

  _onPressFavorite () {
    addFavoriteTheater(this.props.theaterId, (result) => {
      if (result === true) {
        getFavoriteTheaters((result2, favorites) => {
          if (result2 === true) {
            const isFavorite = favorites.indexOf(this.props.theaterId) > -1
            this.setState({isFavorite: isFavorite})
            this.props.getHeader().rightComp.setup({
              style: {
                tintColor: isFavorite ? 'white' : '#E58C7A'
              }
            })
          }
        })
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
