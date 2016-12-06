'use strict'

import React, { PropTypes } from 'react'
import _ from 'lodash'

import MyGiftedListView from '../../../components/MyGiftedListView'
import SimpleCell from '../../../components/SimpleCell'
import {getFunctionsRoute} from '../../../../data/routes'

export default class Theaters extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func,
    onPopRoute: PropTypes.func
  };

  constructor (props) {
    super(props)
    _.bindAll(this, [
      '_renderRow'
    ])
  }

  render () {
    const viewer = this.props.viewer
    const dataRows = viewer ? viewer.theaters : []
    return (
      <MyGiftedListView
        renderRow={this._renderRow}
        dataRows={dataRows}
      />
    )
  }

  _renderRow (rowData, sectionID, rowID, highlightRow) {
    return (
      <SimpleCell
        rowNumber={rowData.rowNumber}
        title={rowData.name}
        onPress={() => this._onPress(rowData)}
      />
    )
  }

  _onPress (rowData) {
    const functionsRoute = getFunctionsRoute(rowData.theater_id, rowData.name)
    this.props.onPushRoute(functionsRoute)
  }
}
