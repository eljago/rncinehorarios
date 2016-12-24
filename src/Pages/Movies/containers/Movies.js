// @flow
'use strict'

import React from 'react'
import {
  Dimensions,
  View,
  ListView,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native'

import Billboard from '../components/Billboard'
import ComingSoon from '../components/ComingSoon'
import Colors from '../../../../data/Colors'

const HEADERHEIGHT = 40

export default class Movies extends React.Component {

  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: dataSource.cloneWithRows(this._getDataRows(props.viewer)),
      page: 0
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._getDataRows(nextProps.viewer))
    })
  }

  _getDataRows (viewer) {
    const {billboard, comingSoon} = viewer
    return [{
      Component: Billboard,
      shows: billboard != null ? billboard : []
    }, {
      Component: ComingSoon,
      shows: comingSoon != null ? comingSoon : []
    }]
  }

  render () {
    return (
      <View style={styles.container}>
        {this._getHeader()}
        <ListView
          ref='listView'
          horizontal
          pagingEnabled
          style={styles.container}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          onScroll={this._onScroll.bind(this)}
        />
      </View>
    )
  }

  _renderRow (dataRow) {
    const {width} = Dimensions.get('window')
    const {Component, shows} = dataRow
    return (
      <View style={[styles.container, {width: width}]}>
        <Component shows={shows} />
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

  _getHeader () {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.button, {
            borderBottomColor: this.state.page === 0 ? Colors.navBar : 'transparent'
          }]}
          key='billboard'
          onPress={this._onPressButton.bind(this, 'billboard')}
        >
          <Text style={styles.headerText}>Cartelera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {
            borderBottomColor: this.state.page === 1 ? Colors.navBar : 'transparent'
          }]}
          key='comingSoon'
          onPress={this._onPressButton.bind(this, 'comingSoon')}
        >
          <Text style={styles.headerText}>Próximamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _onPressButton (type) {
    const {width} = Dimensions.get('window')
    if (type === 'billboard') {
      this.refs.listView.scrollTo({x: 0, animated: true})
    } else if (type === 'comingSoon') {
      this.refs.listView.scrollTo({x: width, animated: true})
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
    backgroundColor: 'white'
  },
  headerText: {
    color: Colors.navBar,
    fontWeight: '600',
    fontSize: 16
  },
  header: {
    flexDirection: 'row',
    height: HEADERHEIGHT
  }
})
