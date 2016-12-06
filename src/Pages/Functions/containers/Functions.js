'use strict'

import React, { PropTypes } from 'react'
import { View, Animated, Dimensions, ScrollView } from 'react-native'
import moment from 'moment'
const esLocale = require('moment/locale/es')
import _ from 'lodash'

import MyGiftedListView from '../../../components/MyGiftedListView'
import FunctionsCell from '../components/FunctionsCell'
import MenuItem from '../components/MenuItem'
import Colors from '../../../../data/Colors'

const PICKER_OFFSET = 100

export default class Functions extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired
  };

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
    const dataRows = getDataRows(date, this.props.viewer.shows_functions)
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
        <ScrollView contentContainerStyle={{flex: 1, justifyContent: 'center'}}>
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
        onPress={this._onPress}
      />
    )
  }

  _onPress (rowData) {
    // const showRoute = getShowRoute(rowData.get('show_id'))
    // this.props.navigator.navigator.push(showRoute)
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
}

function getDataRows (date, showsFunctions) {
  let dataRows = []
  for (const show of showsFunctions) {
    const {id, name, information, genres, cover, show_id} = show

    const functions = show.functions.filter((obj) => {
      return (obj.date === date)
    })

    if (functions.length > 0) {
      dataRows.push({
        id: id,
        name: name,
        information: information,
        genres: genres,
        cover: cover,
        functions: functions,
        show_id: show_id
      })
    }
  }
  return dataRows
}
