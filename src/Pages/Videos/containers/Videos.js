'use strict'

import React, { PropTypes } from 'react'
import {ScrollView, StyleSheet} from 'react-native'
import _ from 'lodash'

import VideosList from '../components/VideosList'

export default class Theaters extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func,
    onPopRoute: PropTypes.func
  };

  constructor (props) {
    super(props)

  }

  render () {
    return (
      <ScrollView
        style={styles.scrollView}
      >
        {this._getLatestVideos()}
        {this._getBillboardVideos()}
        {this._getComingSoonVideos()}
      </ScrollView>
    )
  }

  _getLatestVideos() {
    return(
      <VideosList
        videos={this.props.viewer.latestVideos}
      />
    )
  }

  _getBillboardVideos() {
    return(
      <VideosList
        videos={this.props.viewer.billboardVideos}
      />
    )
  }

  _getComingSoonVideos() {
    return(
      <VideosList
        videos={this.props.viewer.comingSoonVideos}
      />
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  }
})