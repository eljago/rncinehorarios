//@flow
'use strict'

import React from 'react'
import {
  View,
  Text,
  ListView
} from 'react-native'
import moment from 'moment'

import MyGiftedListView from '../../../components/MyGiftedListView'
import ShowtimesCell from '../../../components/ShowtimesCell'
import CinemaCell from '../../../components/CinemaCell'
import Colors from '../../../../data/Colors'

type Cinema = {
  name: string,
  cinema_id: number,
  images: number[]
}
type Props = {
  onPushRoute: (route: Object) => void,
  currentDate: string,
  cinema: Cinema
}
type State = {
  currentDate: string
}
type Func = {
  function_id: number,
  showtimes: string,
  function_types: string,
  date: string
}
type Theater = {
  cinema_id: number,
  theater_id: number,
  name: string,
  functions: Func[]
}
type RowData = {
  cinema_id: number,
  theater_id: number,
  name: string,
  functions: Func[],
  rowNumber: number
}

export default class ShowTheaters extends React.Component {
  static propTypes: Props
  state: State
  _showFavorites: any

  constructor (props: Props) {
    super(props)
    this.state = {
      currentDate: props.currentDate
    }
  }

  render () {
    const {viewer} = this.props
    if (viewer != null && viewer.theaters) {
      return (
        <View style={{flex: 1}}>
          <CinemaCell
            style={{flex: 0, height: 50}}
            textStyle={{marginLeft: 4}}
            cinemaId={this.props.cinema.cinema_id}
            hideAccessoryView
          />
          {this._getList()}
        </View>
      )
    }
    return null
  }

  _getList () {
    const dataRows = this._getDataRows()
    if (dataRows.length > 0) {
      return (
        <MyGiftedListView
          renderRow={this._renderRow.bind(this)}
          dataRows={this._getDataRows()}
        />
      )
    }
    else {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{fontSize: 20, textAlign: 'center'}}>
            Sin funciones
          </Text>
        </View>
      )
    }
  }

  _renderRow (rowData: RowData) {
    return (
      <ShowtimesCell
        currentDate={this.state.currentDate}
        rowNumber={rowData.rowNumber}
        title={rowData.name}
        functions={rowData.functions}
        style={{padding: 10}}
      />
    )
  }

  _getDataRows () {
    const {viewer, cinema} = this.props
    if (viewer && viewer.theaters) {
      return viewer.theaters.filter((theater) => {
        if (theater.cinema_id === cinema.cinema_id) {
          const functionsDates = theater.functions.map(func => func.date)
          if (functionsDates.includes(this.state.currentDate)) {
            return true
          }
        }
      })
    }
    return []
  }

  updateDate (currentDate: string) {
    this.setState({currentDate})
  }
}
