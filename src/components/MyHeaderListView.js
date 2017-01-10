'use strict'

import React, {PropTypes} from 'react'
import {
  ListView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native'

import Colors from '../../data/Colors'

export default class MyHeaderListView extends React.Component {
  static propTypes = {
    dataRows: PropTypes.array,
    titles: PropTypes.array,
    renderPage: PropTypes.func.isRequired
  }
  static defaultProps = {
    dataRows: [],
    titles: []
  }

  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: dataSource.cloneWithRows(props.dataRows),
      page: 0
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.dataRows)
    })
  }

  render () {
    return (
      <View style={styles.container}>
        {this._getHeaderView()}
        <ListView
          style={styles.container}
          ref={(comp) => { this._listView = comp }}
          horizontal
          pagingEnabled
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          onScroll={this._onScroll.bind(this)}
        />
      </View>
    )
  }

  _renderRow (rowData, sectionID, rowID, highlightRow) {
    const {width} = Dimensions.get('window')
    return (
      <View style={[styles.container, {width: width}]}>
        {this.props.renderPage(rowData, sectionID, rowID, highlightRow)}
      </View>
    )
  }

  _onScroll (e) {
    const event = e.nativeEvent
    const layoutWidth = event.layoutMeasurement.width
    const page = Math.floor((event.contentOffset.x + 0.5 * layoutWidth) / layoutWidth)
    if (this.state.page !== page) {
      this.setState({page})
    }
  }

  _getHeaderView () {
    return (
      <View style={styles.header}>
        {this.props.titles.map((title, index) => {
          return this._getHeaderItem(title, index)
        })}
      </View>
    )
  }

  _getHeaderItem (title, page) {
    return (
      <TouchableOpacity
        style={styles.button}
        key={title}
        onPress={this._onPressHeaderButton.bind(this, page)}
      >
        <Text style={[styles.headerText, {
          color: this.state.page === page ? Colors.navBarTitle : Colors.navBarTitleNotSelected
        }]}>{title}</Text>
      </TouchableOpacity>
    )
  }

  _onPressHeaderButton (page) {
    const {width} = Dimensions.get('window')
    this._listView.scrollTo({x: page * width, animated: true})
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: Colors.navBar,
    flexDirection: 'row',
    height: 30,
    paddingLeft: 3,
    paddingRight: 3
  },
  button: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    fontWeight: '500',
    fontSize: 14
  }
})
