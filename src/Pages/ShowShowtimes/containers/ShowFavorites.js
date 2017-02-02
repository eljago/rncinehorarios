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
import ShowtimesCell from '../../../components/ShowtimesCell'
import CinemaCell from '../../../components/CinemaCell'
import ShowTheatersRelay from './ShowTheatersRelay'
import {ViewerQueryConfig, getCacheTime} from '../../../utils/ViewerQueryConfig'
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
  currentDate: string,
  showName: string,
  showId: string
}
type State = {
  dataSource: ?ListView.DataSource,
  currentDate: string
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
      this._refreshFavorites()
    }
  }

  componentDidUpdate (prevProps: Props, prevState: State) {
    if (this.props.viewer != null) {
      if (prevProps.viewer == null) {
        this._refreshFavorites()
      }
      else if (this.state.currentDate !== prevState.currentDate) {
        this._refreshFavorites()
      }
    }
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
        textStyle={{marginLeft: 4}}
        cinemaId={rowData.cinema_id}
        onPress={this._onPressCinema.bind(this, rowData)}
      />
    )
  }

  _renderRow (rowData: RowData, sectionID: number, rowID: number,
    highlightRow: (sectionID: number, rowID: number) => void
  ) {
    return (
      <ShowtimesCell
        currentDate={this.state.currentDate}
        rowNumber={rowData.rowNumber + 1}
        title={rowData.name}
        functions={rowData.functions}
        style={{padding: 10}}
      />
    )
  }

  _onPressCinema (cinema: Cinema) {
    this.props.onPushRoute({
      key: 'show_theaters',
      title: this.props.showName,
      component: ShowTheatersRelay,
      relay: {
        queryConfig: new ViewerQueryConfig({
          cacheTime: getCacheTime(),
          show_id: this.props.showId,
          cinema_id: cinema.cinema_id
        })
      },
      props: {
        currentDate: this.props.currentDate,
        cinema: cinema
      },
      navBarHidden: true
    })
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
      const {theaters} = this.props.viewer
      if (result === true && theaters) {
        const favTheatersIds = Object.keys(favorites)
        for (const theater of theaters) {
          if (favTheatersIds.includes(`${theater.theater_id}`) && theater.functions
            && theater.functions.length > 0) {
            const functionsDates = theater.functions.map(func => func.date)
            // if this theater has a function for today, then add the data
            if (functionsDates.includes(this.state.currentDate)) {
              const {cinema_id, theater_id} = theater
              const sectionIDIndex = sectionIDs.indexOf(cinema_id)
              if (sectionIDIndex > -1) {
                dataBlob[`${cinema_id}:${theater_id}`] = theater
                rowIDs[sectionIDIndex].push(theater_id)
              }
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
        // set RowData rowNumber:
        for (const cinema_id of sortedSectionIDs) {
          const sectionIDIndex = sectionIDs.indexOf(cinema_id)
          if (sectionIDIndex > -1) {
            let rowNumber = 0
            for (const theater_id of rowIDs[sectionIDIndex]) {
              dataBlob[`${cinema_id}:${theater_id}`].rowNumber = rowNumber++
            }
          }
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sortedSectionIDs, sortedRowIDs)
        })
      }
    })
  }

  updateDate (currentDate: string) {
    this.setState({currentDate})
  }
}
