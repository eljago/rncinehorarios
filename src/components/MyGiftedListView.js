'use strict'

import React, { PropTypes } from 'react'
import { ListView } from 'react-native'

export default class MyGiftedListView extends React.Component {

  static propTypes = {
    scrollsToTop: PropTypes.bool,
    renderRow: PropTypes.func,
    dataRows: PropTypes.array
  };

  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    const dataRows = props.dataRows ? props.dataRows : []
    this.state = {
      dataSource: dataSource.cloneWithRows(this._getDataSourceRows(dataRows))
    }
  }

  componentWillReceiveProps (nextProps) {
    const dataRows = nextProps.dataRows ? nextProps.dataRows : []
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._getDataSourceRows(dataRows))
    })
  }

  render () {
    return (
      <ListView
        dataSource={this.state.dataSource}
        scrollsToTop={this.props.scrollsToTop}
        renderRow={this.props.renderRow}
        contentContainerStyle={this.props.listViewStyle}
        enableEmptySections
        initialListSize={1}
        automaticallyAdjustContentInsets={false}
      />
    )
  }

  _getDataSourceRows (dataRows) {
    return dataRows.map((dataRow, i) => {
      dataRow.rowNumber = i
      return dataRow
    })
  }
}
