'use strict'

import React, { PropTypes } from 'react'
import {ScrollView, StyleSheet} from 'react-native'
import _ from 'lodash'

import LatestVideos from './LatestVideos'

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
      </ScrollView>
    )
  }

  _getLatestVideos() {
    return(
      <LatestVideos
        latestVideos={this.props.viewer.latestVideos}
      />
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  }
})