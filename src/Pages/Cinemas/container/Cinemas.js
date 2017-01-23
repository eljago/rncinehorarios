// @flow
'use strict'

import React, { PropTypes } from 'react'
import {
  ListView
} from 'react-native'
import _ from 'lodash'

import MyGiftedListView from '../../../components/MyGiftedListView'
import CinemaCell from '../components/CinemaCell'
import SimpleCell from '../../../components/SimpleCell'
import CINEMAS from '../../../../data/Cinemas'
import Colors from '../../../../data/Colors'
import {getTheatersRoute, getFunctionsRoute} from '../../../../data/routes'
import {getFavoriteTheaters} from '../../../utils/Favorites'

export default class extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired
  }

  constructor (props) {
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
    _.bindAll(this, [
      '_renderRow'
    ])
  }

  _getDefaultDataSourceData () {
    let dataBlob = {}
    let sectionIDs = []
    let rowIDs = []
    for (const cinema of CINEMAS) {
      const {cinema_id} = cinema
      dataBlob[cinema_id] = cinema
      dataBlob[cinema_id].rowNumber = sectionIDs.length
      sectionIDs.push(cinema_id)
      rowIDs.push([])
    }
    return {
      dataBlob: dataBlob,
      sectionIDs: sectionIDs,
      rowIDs: rowIDs
    }
  }

  componentWillMount () {
    this._refreshFavorites()
  }

  onFocus () {
    this._refreshFavorites()
  }

  _refreshFavorites () {
    const {dataBlob, sectionIDs, rowIDs} = this._getDefaultDataSourceData()
    getFavoriteTheaters((result, favorites) => {
      if (result === true) {
        for (const theater of Object.values(favorites)) {
          const {cinema_id, theater_id} = theater
          const sectionIDIndex = sectionIDs.indexOf(cinema_id)
          if (sectionIDIndex > -1) {
            dataBlob[`${cinema_id}:${theater_id}`] = theater
            dataBlob[`${cinema_id}:${theater_id}`].rowNumber = dataBlob[cinema_id].rowNumber
            rowIDs[sectionIDIndex].push(theater_id)
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

  _getSectionData = (dataBlob, sectionID) => {
    return dataBlob[sectionID];
  }

  _getRowData = (dataBlob, sectionID, rowID) => {
    return dataBlob[sectionID + ':' + rowID];
  }

  _renderSectionHeader (rowData, sectionID) {
    const images = rowData.images
    const image = images.length > 0 ? images[Math.floor(Math.random() * images.length)] : null
    return (
      <CinemaCell
        rowNumber={rowData.rowNumber}
        title={rowData.name}
        image={image}
        onPress={this._onPressCinema.bind(this, rowData)}
      />
    )
  }

  _onPressCinema (rowData) {
    const props = {
      title: rowData.name,
      cinemaId: rowData.cinema_id
    }
    this.props.onPushRoute(getTheatersRoute(props))
  }

  _renderRow (rowData: string, sectionID: number, rowID: number,
    highlightRow: (sectionID: number, rowID: number) => void
  ) {
    return (
      <SimpleCell
        rowNumber={rowData.rowNumber}
        title={rowData.name}
        onPress={this._onPressTheater.bind(this, rowData)}
        style={{backgroundColor: '#F7F7F7'}}
      />
    )
  }

  _onPressTheater (rowData) {
    const {name, cinema_id, theater_id} = rowData
    const props = {
      title: name,
      theater: {
        theater_id: theater_id,
        cinema_id: cinema_id,
        name: name
      }
    }
    const relayProps = {
      theater_id: theater_id
    }
    this.props.onPushRoute(getFunctionsRoute(props, relayProps))
  }
}
