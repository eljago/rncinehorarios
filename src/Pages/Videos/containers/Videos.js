'use strict'

import React, { PropTypes } from 'react'
import {
  View
} from 'react-native'

import MyHeaderListView from '../../../components/MyHeaderListView'
import MyGiftedListView from '../../../components/MyGiftedListView'
import VideoCell from '../components/VideoCell'
import {goToVideo} from '../../../utils/VideoHelper'
import {getShowRoute} from '../../../../data/routes'

import VideoWebView from '../../../components/VideoWebView'

export default class Videos extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired
  }
  _distanceToBottom = 0

  componentDidMount() {
    console.log(this._videoWebView)
  }

  render () {
    const {latestVideos, billboardVideos, comingSoonVideos} = this.props.viewer
    return (
      <View style={{flex: 1}}>
        <MyHeaderListView
          dataRows={[latestVideos.edges, billboardVideos.edges, comingSoonVideos.edges]}
          titles={['Últimos', 'Cartelera', 'Próximamente']}
          renderPage={this._renderPage.bind(this)}
        />
        <VideoWebView
          ref={(comp) => {this._videoWebView = comp}}
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
        onPressVideo={this._onGoToVideo.bind(this, {
          videoType: video.video_type,
          code: video.code
        })}
        showId={video.show.show_id}
        showName={video.show.name}
        showCoverUrl={video.show.cover}
        videoName={video.name}
        videoType={video.video_type}
        videoCode={video.code}
        videoPortraitUrl={video.image}
      />
    )
  }

  _onGoToVideo (videoProps) {
    console.log('ejale')
    this._videoWebView.open(videoProps)
  }

  _onGoToMovie (showId, showName) {
    const showRoute = getShowRoute(showId, showName)
    this.props.onPushRoute(showRoute, true)
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
