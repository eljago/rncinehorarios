'use strict'

import React, { PropTypes } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'

import Colors from '../../../../data/Colors'
import MyListViewCell from '../../../components/MyListViewCell'
import ShowtimesCell from '../../../components/ShowtimesCell'
import {getImageVersion} from '../../../utils/ImageHelper'

export default class FunctionCell extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    cover: PropTypes.string,
    functions: PropTypes.array,
    rowNumber: PropTypes.number,
    onPress: PropTypes.func,
    currentDate: PropTypes.string
  };

  render () {
    const {title, cover, functions, rowNumber, onPress, currentDate} = this.props
    return (
      <MyListViewCell
        rowNumber={rowNumber}
        onPress={onPress}
      >
        <View style={styles.rowContainer}>
          <View style={styles.imageContainer}>
            <Image
              resizeMode='stretch'
              style={styles.image}
              source={{uri: getImageVersion(cover, 'smaller')}}
            />
          </View>
          <ShowtimesCell
            currentDate={currentDate}
            title={title}
            functions={functions}
            style={styles.showtimesCell}
          />
        </View>
      </MyListViewCell>
    )
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  image: {
    flex: 1
  },
  imageContainer: {
    width: 80,
    height: 120,
    alignSelf: 'flex-start',
    shadowColor: 'black',
    shadowRadius: 3,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0, height: 0
    },
    backgroundColor: '#D1D1D1'
  },
  showtimesCell: {
    paddingLeft: 10,
    paddingRight: 10
  }
})
