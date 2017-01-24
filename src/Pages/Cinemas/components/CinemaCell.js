'use strict'

import React, { PropTypes } from 'react'
import {
  Image,
  Text,
  View,
  StyleSheet
} from 'react-native'

import MyListViewCell from '../../../components/MyListViewCell'

export default class CinemaCell extends React.Component {

  static propTypes = {
    rowNumber: PropTypes.number,
    title: PropTypes.string,
    image: PropTypes.number,
    onPress: PropTypes.func
  };

  render () {
    const {title, image, onPress, rowNumber} = this.props
    return (
      <MyListViewCell
        rowNumber={rowNumber}
        onPress={onPress}
      >
        <View style={styles.rowContainer}>
          <Image
            source={image}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {title}
            </Text>
          </View>
        </View>
      </MyListViewCell>
    )
  }
}

let styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textContainer: {
    flex: 1,
    marginLeft: 15
  },
  image: {
    width: 40,
    height: 40
  },
  title: {
    fontSize: 22,
    fontWeight: '300'
  }
})
