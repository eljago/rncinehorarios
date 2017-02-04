//@flow
'use strict'

import React, {PropTypes} from 'react'
import {
  View,
  Text,
  Image,
  ListView,
  StyleSheet
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
  images: number[],
  hasFunctions: bool
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
  showId: string,
  viewer: Viewer
}
type State = {
  dataSource: ListView.DataSource,
  currentDate: string
}
type RowData = {
  cinema_id: number,
  theater_id: number,
  name: string,
  functions: Func[],
  rowNumber: number
}
type Viewer = {
  theaters: Theater[]
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

  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.viewer != null && this.props.viewer == null) {
      this._refreshFavorites(nextProps.viewer.theaters)
    }
  }

  componentWillUpdate (nextProps: Props, nextState: State) {
    if (this.props.viewer != null && this.state.currentDate !== nextState.currentDate) {
      this._refreshFavorites(nextProps.viewer.theaters)
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
      <View style={styles.container}>
        <CinemaCell
          textStyle={styles.cinemaCellTextStyle}
          cinemaId={rowData.cinema_id}
          onPress={this._onPressCinema.bind(this, rowData)}
        />
      </View>
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
        style={styles.showtimesCellStyle}
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
    sectionIDs: string[],
    rowIDs: Array<Array<string>>
  } {
    let dataBlob = {}
    let sectionIDs = []
    let rowIDs = []
    for (let cinema of CINEMAS) {
      const {cinema_id} = cinema
      dataBlob[`${cinema_id}`] = cinema
      sectionIDs.push(`${cinema_id}`)
      rowIDs.push([])
    }
    return {
      dataBlob: dataBlob,
      sectionIDs: sectionIDs,
      rowIDs: rowIDs
    }
  }

  _refreshFavorites (theaters) {
    let {dataBlob, sectionIDs, rowIDs} = this._getDefaultDataSourceData()
    getFavoriteTheaters((result: bool, favorites: {[key: number]: Theater}) => {
      if (result === true && theaters && theaters.length > 0) {
        const favTheatersIds = Object.keys(favorites)
        for (const theater of theaters) {
          const {cinema_id, theater_id, name: theaterName} = theater
          const sectionIDIndex = sectionIDs.indexOf(`${cinema_id}`)
          if (favTheatersIds.includes(`${theater_id}`) &&
            theater.functions && theater.functions.length > 0 && sectionIDIndex > -1
          ) {
            const functions = theater.functions.filter(func => func.date === this.state.currentDate)
            if (functions.length > 0) {
              dataBlob[`${cinema_id}:${theater_id}`] = {
                cinema_id: cinema_id,
                name: theaterName,
                theater_id: theater_id,
                functions: functions
              }
              rowIDs[sectionIDIndex].push(`${theater_id}`)
            }
          }
        }
        // SORT SECTIONS SO THE ONES WITH MORE THEATERS ARE ON TOP
        let sortedSectionIDs = sectionIDs.map((cinema_id) => cinema_id)
        sortedSectionIDs.sort((cinema_id1, cinema_id2) => {
          const sectionIDIndex1 = sectionIDs.indexOf(cinema_id1)
          const sectionIDIndex2 = sectionIDs.indexOf(cinema_id2)
          return rowIDs[sectionIDIndex2].length - rowIDs[sectionIDIndex1].length
        })

        let sortedRowIDs = []
        for (const cinema_id of sortedSectionIDs) {
          const sectionIDIndex = sectionIDs.indexOf(cinema_id)
          // SORT THEATERS BY NAME
          const sectionRows = rowIDs[sectionIDIndex]
          sectionRows.sort((theater_id1, theater_id2) => {
            const theater1 = favorites[parseInt(theater_id1)]
            const theater2 = favorites[parseInt(theater_id2)]
            if(theater1.name < theater2.name) return -1;
            if(theater1.name > theater2.name) return 1;
            return 0;
          })
          sortedRowIDs.push(sectionRows)
        }

        // SET ROWDATA'S ROWNUMBER:
        for (const cinema_id of sortedSectionIDs) {
          const sectionIDIndex = sortedSectionIDs.indexOf(cinema_id)
          let rowNumber = 0
          for (const theater_id of sortedRowIDs[sectionIDIndex]) {
            let theater = dataBlob[`${cinema_id}:${theater_id}`]
            theater.rowNumber = rowNumber++
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


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(241, 240, 240, 0.5)'
  },
  cinemaCellTextStyle: {
    marginLeft: 4
  },
  showtimesCellStyle: {
    padding: 10
  }
})
