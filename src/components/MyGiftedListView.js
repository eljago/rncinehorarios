'use strict'

import React, { PropTypes } from 'react'
import { ListView, StyleSheet, RefreshControl } from 'react-native'

export default class MyGiftedListView extends React.Component {

  static propTypes = {
    scrollsToTop: PropTypes.bool,
    renderRow: PropTypes.func,
    dataRows: PropTypes.array,
    forceFetch: PropTypes.func,
    onScroll: PropTypes.func
  };

  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    const dataRows = props.dataRows ? props.dataRows : []
    this.state = {
      dataSource: dataSource.cloneWithRows(this._getDataSourceRows(dataRows)),
      refreshing: false
    }
  }

  componentWillReceiveProps (nextProps) {
    const dataRows = nextProps.dataRows ? nextProps.dataRows : []
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._getDataSourceRows(dataRows))
    })
  }

  render () {
    const refreshControl = this.props.forceFetch ? 
    {
      refreshControl: (
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)}
        />
      )
    } : null
    return (
      <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        scrollsToTop={this.props.scrollsToTop}
        renderRow={this.props.renderRow}
        contentContainerStyle={this.props.listViewStyle}
        enableEmptySections
        // initialListSize={1}
        automaticallyAdjustContentInsets={false}
        onScroll={this.props.onScroll}
        {...refreshControl}
      />
    )
  }

  _getDataSourceRows (dataRows) {
    return dataRows.map((dataRow, i) => {
      dataRow.rowNumber = i
      return dataRow
    })
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.props.forceFetch(null, (readyState) => {
      if (readyState.done) {
        this.setState({refreshing: false})
      }
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
