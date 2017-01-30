//@flow
'use strict'

import React, {PropTypes} from 'react'
import {
  View,
  Text,
  Image,
  ListView
} from 'react-native'

import CINEMAS from '../../../../data/Cinemas'
import ShowtimesView from '../../../components/ShowtimesView'
import CinemaCell from '../../../components/CinemaCell'
import {getFavoriteTheaters} from '../../../utils/Favorites'

type Cinema = {
  name: string,
  cinema_id: number,
  images: number[]
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
type Props = {
  favoriteTheaters: Theater[],
  currentDate: string
}
type State = {
  dataSource: ?ListView.DataSource
}

export default class ShowTheaters extends React.Component {
  static propTypes: Props
  state: State

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
      dataSource: dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)
    }
  }

  componentDidMount () {
    this._refreshFavorites()
  }

  render () {
    return (
      <ListView
        enableEmptySections
        renderRow={this._renderRow.bind(this)}
        renderSectionHeader={this._renderSectionHeader.bind(this)}
        dataSource={this.state.dataSource}
      />
    )
  }

  _getSectionData (dataBlob, sectionID) {
    return dataBlob[sectionID];
  }

  _getRowData (dataBlob: Object, sectionID: number, rowID: number) {
    return dataBlob[sectionID + ':' + rowID];
  }

  _renderSectionHeader (rowData: Cinema, sectionID: number) {
    return (
      <CinemaCell
        cinemaId={rowData.cinema_id}
        onPress={this._onPressCinema.bind(this, rowData)}
      />
    )
  }

  _renderRow (rowData: Theater, sectionID: number, rowID: number,
    highlightRow: (sectionID: number, rowID: number) => void
  ) {
    return (
      <View
        style={{
          flex: 1,
          padding: 10,
          paddingLeft: 50,
          backgroundColor: '#f2f2f2'
        }}
      >
        <Text key='showtimes' style={{fontSize: 18}}>{rowData.name}</Text>
        {rowData.functions.map((func) => {
          if (func.date === this.props.currentDate) {
            return (
              <ShowtimesView
                key={func.function_id}
                functionTypes={func.function_types}
                showtimes={func.showtimes}
              />
            )
          }
        })}
      </View>
    )
  }

  _onPressCinema (cinema: Cinema) {

  }

  _getDefaultDataSourceData (): {
    dataBlob: Object,
    sectionIDs: number[],
    rowIDs: Array<Array<number>>
  } {
    let dataBlob = {}
    let sectionIDs = []
    let rowIDs = []
    for (const cinema of CINEMAS) {
      const {cinema_id} = cinema
      dataBlob[cinema_id] = cinema
      sectionIDs.push(cinema_id)
      rowIDs.push([])
    }
    return {
      dataBlob: dataBlob,
      sectionIDs: sectionIDs,
      rowIDs: rowIDs
    }
  }

  _refreshFavorites () {
    const {dataBlob, sectionIDs, rowIDs} = this._getDefaultDataSourceData()
    getFavoriteTheaters((result: bool, favorites: {[key: number]: Theater}) => {
      const {favoriteTheaters} = this.props
      if (result === true && favoriteTheaters) {
        const favTheatersIds = Object.keys(favorites)
        for (const favTheater of favoriteTheaters) {
          if (favTheatersIds.includes(`${favTheater.theater_id}`)) {
            const {cinema_id, theater_id} = favTheater
            const sectionIDIndex = sectionIDs.indexOf(cinema_id)
            if (sectionIDIndex > -1) {
              dataBlob[`${cinema_id}:${theater_id}`] = favTheater
              rowIDs[sectionIDIndex].push(theater_id)
            }
          }
        }
        const sortedSectionIDs = sectionIDs.map((sectionID) => sectionID)
        sortedSectionIDs.sort((cinema_id1, cinema_id2) => {
          const sectionIDIndex1 = sectionIDs.indexOf(cinema_id1)
          const sectionIDIndex2 = sectionIDs.indexOf(cinema_id2)
          return rowIDs[sectionIDIndex2].length - rowIDs[sectionIDIndex1].length
        })
        let sortedRowIDs = []
        for (const sectionID of sortedSectionIDs) {
          const sectionIDIndex = sectionIDs.indexOf(sectionID)
          const sectionRows = rowIDs[sectionIDIndex]
          sectionRows.sort((theater_id1, theater_id2) => {
            const theater1 = favorites[theater_id1]
            const theater2 = favorites[theater_id2]
            if(theater1.name < theater2.name) return -1;
            if(theater1.name > theater2.name) return 1;
            return 0;
          })
          sortedRowIDs.push(rowIDs[sectionIDIndex])
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sortedSectionIDs, sortedRowIDs)
        })
      }
    })
  }
}
