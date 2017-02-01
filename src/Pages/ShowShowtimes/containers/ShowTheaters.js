//@flow
'use strict'

import React from 'react'
import {
  View,
  Text,
  ListView
} from 'react-native'
import moment from 'moment'

import TheaterShowtimes from '../components/TheaterShowtimes'

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
  dataSource: ListView.DataSource,
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

export default class ShowTheaters extends React.Component {
  static propTypes: Props
  state: State
  _showFavorites: any

  constructor (props: Props) {
    super(props)

    const dataSource = new ListView.DataSource({
      getSectionData: this._getSectionData,
      getRowData: this._getRowData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged : (s1, s2) => s1 !== s2
    })
    const {dataBlob, sectionIDs, rowIDs} = this._getDefaultDataSourceData()
    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
      currentDate: props.currentDate
    }
  }

  componentDidMount () {
    if (this.props.viewer != null) {
      this._refreshTheaters()
    }
  }

  componentDidUpdate (prevProps: Props, prevState: State) {
    if (this.props.viewer != null) {
      if (prevProps.viewer == null) {
        this._refreshTheaters()
      }
      else if (this.state.currentDate !== prevState.currentDate) {
        this._refreshTheaters()
      }
    }
  }

  render () {
    const {viewer} = this.props
    if (viewer != null && viewer.theaters) {
      return (
        <ListView
          enableEmptySections
          renderRow={this._renderRow.bind(this)}
          renderSectionHeader={this._renderSectionHeader.bind(this)}
          dataSource={this.state.dataSource}
        />
      )
    }
    return null
  }

  _getSectionData (dataBlob, sectionID) {
    return dataBlob[sectionID];
  }

  _getRowData (dataBlob: Object, sectionID: number, rowID: number) {
    return dataBlob[sectionID + ':' + rowID];
  }

  _renderSectionHeader (rowData: Theater, sectionID: number) {
    return (
      <View
        style={{flex: 1, backgroundColor: 'white'}}
      >
        <Text style={{flex: 1, margin: 10, fontWeight: '600', fontSize: 20}}>
          {rowData.name}
        </Text>
      </View>
    )
  }

  _renderRow (rowData: Theater, sectionID: number, rowID: number,
    highlightRow: (sectionID: number, rowID: number) => void
  ) {
    if (rowData != null) {
      return <TheaterShowtimes theater={rowData} currentDate={this.state.currentDate} />
    }
    else {
      return (
        <Text style={{flex: 1, fontSize: 20, textAlign: 'center'}}>
          Sin funciones
        </Text>
      )
    }
  }

  _getDefaultDataSourceData (): {
    dataBlob: Object,
    sectionIDs: string[],
    rowIDs: Array<Array<string>>
  } {
    return {
      dataBlob: {
        'cinema': this.props.cinema
      },
      sectionIDs: ['cinema'],
      rowIDs: [[]]
    }
  }

  _refreshTheaters () {
    const {viewer} = this.props
    if (viewer && viewer.theaters) {
      const {dataBlob, sectionIDs, rowIDs} = this._getDefaultDataSourceData()
      for (const theater of viewer.theaters) {
        if (this.props.cinema.cinema_id === theater.cinema_id) {
          dataBlob[`cinema:${theater.theater_id}`] = theater
          rowIDs[0].push(`${theater.theater_id}`)
        }
      }
      if (rowIDs[0].length === 0) {
        dataBlob[`cinema:${-1}`] = null
        rowIDs[0].push('-1')
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)
      })
    }
  }

  updateDate (currentDate: string) {
    this.setState({currentDate})
  }
}
