// @flow
'use strict'

import React from 'react'

import Billboard from '../components/Billboard'
import ComingSoon from '../components/ComingSoon'
import MyHeaderListView from '../../../components/MyHeaderListView'

export default class Movies extends React.Component {

  render () {
    const {billboard, comingSoon} = this.props.viewer
    return (
      <MyHeaderListView
        dataRows={[billboard, comingSoon]}
        titles={['Cartelera', 'Próximamente']}
        renderPage={this._renderPage}
      />
    )
  }

  _renderPage (rowData, sectionID, rowID, highlightRow) {
    if (rowID === '0') {
      return (
        <Billboard shows={rowData} />
      )
    }
    else if (rowID === '1') {
      return (
        <ComingSoon shows={rowData} />
      )
    }
  }
}
