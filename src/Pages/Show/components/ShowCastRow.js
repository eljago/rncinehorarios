// @flow
'use strict'

import React, {PropTypes} from 'react'
import {ListView, TouchableOpacity, Image, StyleSheet, View, Text} from 'react-native'
import _ from 'lodash'

import {getImageVersion} from '../../../utils/ImageHelper'
import PhotoBrowser from '../../../components/PhotoBrowser'

export default class ShowImagesRow extends React.Component {
  static propTypes = {
    cast: PropTypes.array.isRequired,
    setDrawerLockMode: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: dataSource.cloneWithRows(props.cast)
    }
    _.bindAll(this, [
      '_renderRow'
    ])
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.cast)
    })
  }

  render () {
    if (this.props.cast.length === 0) {
      return null
    }
    return (
      <View>
        <ListView
          style={styles.container}
          horizontal
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
        />
        <PhotoBrowser
          ref={(comp) => {this._photoBrowser = comp}}
          data={this.props.cast.map((spr) => {
            return {
              image: {
                url: getImageVersion(spr.person.image, 'small')
              },
              text: `${(spr.director ? 'Director:\n' : '')}${spr.person.name}${(spr.character ? `\n(${spr.character})` : '')}`
            }
          })}
          allowedOrientations={['PORTRAIT']}
          onOpen={this._onOpenPhotoBrowser.bind(this)}
          onClose={this._onClosePhotoBrowser.bind(this)}
        />
      </View>
    )
  }

  _renderRow (showPersonRole, sectionID, rowID) {
    const {person} = showPersonRole
    return (
      <TouchableOpacity
        style={styles.cellContainer}
        activeOpacity={0.85}
        onPress={this._onPress.bind(this, rowID)}
      >
        <Image
          style={styles.image}
          source={{uri: getImageVersion(person.image, 'smaller')}}
        />
        {this._getDirectorText(showPersonRole)}
        <Text style={[styles.textOverlay, {bottom: 0}]}>
          {person.name}
          {this._getCharacterText(showPersonRole)}
        </Text>
      </TouchableOpacity>
    )
  }

  _getDirectorText (showPersonRole) {
    if (showPersonRole && showPersonRole.director) {
      return (
        <Text style={[styles.textOverlay, {top: 0, textAlign: 'center'}]}>
          Director
        </Text>
      )
    }
    return null
  }

  _getCharacterText (showPersonRole) {
    if (showPersonRole && showPersonRole.character) {
      return (
        <Text style={{
          backgroundColor: 'transparent',
          textAlign: 'center',
          color: '#BDB9BE',
          fontSize: 12,
        }}>
          {`\n${showPersonRole.character}`}
        </Text>
      )
    }
    return null
  }

  _onPress (index) {
    this._photoBrowser.open(parseInt(index))
  }

  _onOpenPhotoBrowser () {
    this.props.setDrawerLockMode('locked-closed')
  }

  _onClosePhotoBrowser () {
    this.props.setDrawerLockMode('unlocked')
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cellContainer: {
    width: 100,
    height: 200,
    margin: 3
  },
  image: {
    flex: 1,
    backgroundColor: '#2F2F2F'
  },
  textOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    fontSize: 14,
    color: 'white',
    padding: 2,
    backgroundColor: 'rgba(0,0,0,0.7)',
    textAlign: 'center'
  }
})
