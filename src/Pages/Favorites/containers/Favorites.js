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

  componentWillMount() {
    getFavoriteTheaters((result, favorites) => {
      if (result === true) {
        this.props.relay.setVariables({theater_ids: favorites.join(',')})
      }
    })
  }

  render () {
    const viewer = this.props.viewer
    const dataRows = viewer ? viewer.theaters : []
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
        onPress={() => this._onPress(rowData)}
      />
    )
  }

  _onPress (rowData) {
    const functionsRoute = getFunctionsRoute(rowData.theater_id, rowData.name)
    this.props.onPushRoute(functionsRoute)
  }

  onFocus () {
    getFavoriteTheaters((result, favorites) => {
      if (result === true) {
        this.props.relay.setVariables({theater_ids: favorites.join(',')})
      }
    })
  }
}