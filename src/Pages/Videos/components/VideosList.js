'use strict'

import React, { PropTypes } from 'react'
import {ListView, Dimensions} from 'react-native'

import VideoCell from './VideoCell'

export default class VideosList extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired,
    videos: PropTypes.array
  };

  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    const dataRows = props.videos ? props.videos : []
    this.state = {
      dataSource: dataSource.cloneWithRows(dataRows)
    }
  }

  componentWillReceiveProps (nextProps) {
    const dataRows = nextProps.videos ? nextProps.videos : []
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(dataRows)
    })
  }

  render () {
    return (
      <ListView
        style={[{flex: 1}, this.props.style]}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}
      />
    )
  }

  _renderRow (rowData, sectionID, rowID, highlightRow) {
    const video = rowData
    return (
      <VideoCell
        onPushRoute={this.props.onPushRoute}
        showName={video.show.name}
        showCoverUrl={video.show.cover}
        videoName={video.name}
        videoType={video.video_type}
        videoCode={video.code}
        videoPortraitUrl={video.image}
        backgroundColor={parseInt(rowID) % 2 === 0 ? 'white' : '#DFE4E5'}
      />
    )
  }
}

