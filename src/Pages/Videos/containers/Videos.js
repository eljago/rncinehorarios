'use strict'

import React, { PropTypes } from 'react'

import VideosList from '../components/VideosList'
import VideosLoaderList from '../components/VideosLoaderList'
import MyHeaderListView from '../../../components/MyHeaderListView'

export default class Videos extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired
  }

  render () {
    const {latestVideos, billboardVideos, comingSoonVideos} = this.props.viewer;
    return (
      <MyHeaderListView
        dataRows={[latestVideos.edges, billboardVideos.edges, comingSoonVideos.edges]}
        titles={['Últimos Videos', 'Cartelera', 'Próximamente']}
        renderPage={this._renderPage.bind(this)}
      />
    )
  }

  _renderPage (rowData, sectionID, rowID, highlightRow) {
    if (rowID === '0') {
      return (
        <VideosLoaderList
          onPushRoute={this.props.onPushRoute}
          videos={rowData}
          onReachBottom={() => {
            this.props.relay.setVariables({totalVideos: this.props.relay.variables.totalVideos + 15})
          }}
        />
      )
    }
    else {
      return (
        <VideosList onPushRoute={this.props.onPushRoute} videos={rowData} />
      )
    }
  }
}
