'use strict'

import React, { PropTypes } from 'react'
import {
  View
} from 'react-native'
import update from 'react/lib/update'

import MyHeaderListView from '../../../components/MyHeaderListView'
import MyGiftedListView from '../../../components/MyGiftedListView'
import VideoPlayer from '../../../components/VideoPlayer'
import VideoCell from '../components/VideoCell'
import {getShowRoute} from '../../../../data/routes'
import {getVideoRoute} from '../../../../data/routes'

export default class Videos extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    this._distanceToBottom = 0
  }

  render () {
    const {viewer} = this.props
    if (viewer == null) {
      return <View style={{flex: 1, backgroundColor: 'white'}} />
    }
    const {
      latestVideos,
      billboardVideos,
      comingSoonVideos
    } = viewer
    return (
      <View style={{flex: 1}}>
        <VideoPlayer ref={(comp) => {this._videoPlayer = comp}} />
        <MyHeaderListView
          dataRows={[latestVideos.edges, billboardVideos.edges, comingSoonVideos.edges]}
          titles={['Últimos', 'Cartelera', 'Próximamente']}
          renderPage={this._renderPage.bind(this)}
        />
      </View>
    )
  }

  _renderPage (rowData, sectionID, rowID, highlightRow) {
    return (
      <MyGiftedListView
        dataRows={rowData}
        renderRow={this._renderRow.bind(this)}
        onScroll={rowID === '0' ? this._onScroll.bind(this) : null}
        forceFetch={this.props.relay.forceFetch}
      />
    )
  }

  _renderRow (rowData, sectionID, rowID, highlightRow) {
    const video = rowData.node
    return (
      <VideoCell
        rowNumber={rowData.rowNumber}
        onPressPoster={this._onGoToMovie.bind(this, video.show.show_id, video.show.name)}
        onPressVideo={this._onGoToVideo.bind(this, video)}
        video={video}
      />
    )
  }

  _onGoToVideo (video) {
    this._videoPlayer.open(video)
  }

  _onGoToMovie (showId, showName) {
    const props = {
      title: showName
    }
    const relayProps = {
      show_id: showId
    }
    this.props.onPushRoute(getShowRoute(props, relayProps))
  }

  _onScroll (e) {
    const event = e.nativeEvent
    const layoutHeight = event.layoutMeasurement.height
    const contentHeight = event.contentSize.height
    const max = contentHeight - layoutHeight
    const distanceToBottom = max - Math.min(max, Math.max(0, event.contentOffset.y))
    if (this._distanceToBottom !== distanceToBottom) {
      if (this._distanceToBottom >= 200 && distanceToBottom < 200) {
        this.props.relay.setVariables({totalVideos: this.props.relay.variables.totalVideos + 15})
      }
      this._distanceToBottom = distanceToBottom
    }
  }
}
