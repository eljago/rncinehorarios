'use strict'

import React, {PropTypes} from 'react'
import {
  View
} from 'react-native'

import MyGiftedListView from '../../../components/MyGiftedListView'
import SimpleCell from '../../../components/SimpleCell'
import {getFunctionsRoute} from '../../../../data/routes'
import {getFavoriteTheaters} from '../../../utils/Favorites'


export default class Favorites extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func,
    onPopRoute: PropTypes.func
  };
  state = {
    favorites: []
  }

  constructor(props) {
    super(props)
    this._updateFavorites()
  }

  render () {
    const viewer = this.props.viewer
    const theaters = viewer ? viewer.theaters : []
    const dataRows = theaters.filter((theater) => {
      return this.state.favorites.includes(theater.theater_id)
    })
    return (
      <MyGiftedListView
        renderRow={this._renderRow.bind(this)}
        dataRows={dataRows}
        forceFetch={this.props.relay.forceFetch}
      />
    )
  }

  _renderRow (rowData, sectionID, rowID, highlightRow) {
    return (
      <SimpleCell
        rowNumber={rowData.rowNumber}
        title={rowData.name}
        onPress={this._onPress.bind(this, rowData)}
      />
    )
  }

  _onPress (rowData) {
    const functionsRoute = getFunctionsRoute(rowData.theater_id, rowData.name)
    this.props.onPushRoute(functionsRoute)
  }

  onFocus () {
    this._updateFavorites()
  }

  _updateFavorites () {
    getFavoriteTheaters((result, favorites) => {
      if (result === true) {
        this.setState({favorites})
      }
    })
  }
}