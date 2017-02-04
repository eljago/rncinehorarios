//@flow
'use strict'

import React from 'react'
import {
  View,
  Text,
  ListView,
  StyleSheet
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
    this.state = {currentDate: props.currentDate}
  }

  render () {
    const {viewer} = this.props
    if (viewer != null && viewer.theaters) {
      return (
        <View style={styles.container}>
          <CinemaCell
            style={styles.cinemaCellStyle}
            textStyle={styles.cinemaCellTextStyle}
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
          dataRows={dataRows}
        />
      )
    }
    else {
      return (
        <View style={styles.noFunctionsContainer}>
          <Text style={styles.noFunctionsText}>
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
        rowNumber={rowData.rowNumber+1}
        title={rowData.name}
        functions={rowData.functions}
        style={styles.showtimesCellStyle}
      />
    )
  }

  _getDataRows () {
    const {viewer, cinema} = this.props
    if (viewer && viewer.theaters) {
      let theaters = []
      for (const theater of viewer.theaters) {
        const functions = theater.functions.filter((func) => {
          return func.date === this.state.currentDate
        })
        if (functions.length > 0) {
          theaters.push({
            ...theater,
            functions: functions
          })
        }
      }
      return theaters
    }
    return []
  }

  updateDate (currentDate: string) {
    this.setState({currentDate})
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  showtimesCellStyle: {
    padding: 10
  },
  noFunctionsContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  noFunctionsText: {
    fontSize: 20,
    textAlign: 'center'
  },
  cinemaCellStyle: {
    flex: 0,
    height: 50
  },
  cinemaCellTextStyle: {
    marginLeft: 4
  }
})
