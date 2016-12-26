// @flow
'use strict'

import React, {PropTypes} from 'react'

import Billboard from '../components/Billboard'
import ComingSoon from '../components/ComingSoon'
import MyHeaderListView from '../../../components/MyHeaderListView'

export default class Movies extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired
  }

  render () {
    const {billboard, comingSoon} = this.props.viewer
    return (
      <MyHeaderListView
        dataRows={[billboard, comingSoon]}
        titles={['Cartelera', 'Próximamente']}
        renderPage={this._renderPage.bind(this)}
      />
    )
  }

  _renderPage (rowData, sectionID, rowID, highlightRow) {
    if (rowID === '0') {
      return (
        <Billboard onPushRoute={this.props.onPushRoute} shows={rowData} />
      )
    }
    else if (rowID === '1') {
      return (
        <ComingSoon onPushRoute={this.props.onPushRoute} shows={rowData} />
      )
    }
  }
}
