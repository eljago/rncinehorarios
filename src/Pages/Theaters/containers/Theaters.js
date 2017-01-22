'use strict'

import React, { PropTypes } from 'react'

import MyGiftedListView from '../../../components/MyGiftedListView'
import SimpleCell from '../../../components/SimpleCell'
import {getFunctionsRoute} from '../../../../data/routes'

export default class Theaters extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired
  };

  render () {
    const {viewer} = this.props
    const theaters = viewer ? viewer.theaters : []
    const dataRows = theaters.filter((theater) => {
      return theater.cinema_id === this.props.cinemaId
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
    const {theater_id, name, cinema_id} = rowData
    const theater = {
      theater_id: theater_id,
      cinema_id: cinema_id,
      name: name
    }
    this.props.onPushRoute(getFunctionsRoute(theater))
  }
}
