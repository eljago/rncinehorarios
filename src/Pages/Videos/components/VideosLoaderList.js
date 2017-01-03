'use strict'

import React, {PropTypes} from 'react'

import VideosList from './VideosList'

export default class VideosLoaderList extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired,
    videos: PropTypes.array,
    onReachBottom: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.distanceToBottom = 0
  }

  render () {
    return (
      <VideosList
        onPushRoute={this.props.onPushRoute}
        videos={this.props.videos}
        onScroll={this._onScroll.bind(this)}
      />
    )
  }

  _onScroll (e) {
    const event = e.nativeEvent
    const layoutHeight = event.layoutMeasurement.height
    const contentHeight = event.contentSize.height
    const max = contentHeight - layoutHeight
    const distanceToBottom = max - Math.min(max, Math.max(0, event.contentOffset.y))

    if (this.distanceToBottom !== distanceToBottom) {
      if (this.distanceToBottom >= 200 && distanceToBottom < 200) {
        this.props.onReachBottom()
      }
      this.distanceToBottom = distanceToBottom
    }
  }
}
