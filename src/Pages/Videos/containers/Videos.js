'use strict'

import React, { PropTypes } from 'react'

import VideosList from '../components/VideosList'
import MyHeaderListView from '../../../components/MyHeaderListView'

export default class Videos extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func,
    onPopRoute: PropTypes.func
  };

  render () {
    const {latestVideos, billboardVideos, comingSoonVideos} = this.props.viewer;
    return (
      <MyHeaderListView
        dataRows={[latestVideos, billboardVideos, comingSoonVideos]}
        titles={['Últimos Videos', 'Cartelera', 'Próximamente']}
        renderPage={this._renderPage}
      />
    )
  }

  _renderPage (rowData, sectionID, rowID, highlightRow) {
    return (
      <VideosList videos={rowData} />
    )
  }
}
