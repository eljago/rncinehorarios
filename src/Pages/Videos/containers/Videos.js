'use strict'

import React, { PropTypes } from 'react'
import {ListView, StyleSheet, Text} from 'react-native'

import VideosList from '../components/VideosList'

export default class Theaters extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func,
    onPopRoute: PropTypes.func
  };

  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(this._getdataSections(props.viewer))
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(this._getdataSections(nextProps.viewer))
    })
  }

  _getdataSections (viewer) {
    return {
      'Últimos Videos': [viewer.latestVideos],
      'Cartelera': [viewer.billboardVideos],
      'Próximos Estrenos': [viewer.comingSoonVideos]
    }
  }

  render () {
    return (
      <ListView
        style={styles.listView}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        renderSectionHeader={this._renderSectionHeader}
      />
    )
  }

  _renderRow (rowData) {
    if (!rowData || rowData.length === 0) { return null }
    return (
      <VideosList videos={rowData} style={{
        backgroundColor: 'white'
      }} />
    )
  }

  _renderSectionHeader (sectionData, sectionID) {
    return (
      <Text style={styles.header}>{sectionID}</Text>
    )
  }
}

const styles = StyleSheet.create({
  listView: {
    flex: 1
  },
  header: {
    padding: 4,
    paddingLeft: 10,
    fontSize: 18,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.8)'
  }
})
