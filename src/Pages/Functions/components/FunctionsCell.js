'use strict'

import React, { PropTypes } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'

import Colors from '../../../../data/Colors'
import MyListViewCell from '../../../components/MyListViewCell'
import ShowtimesView from '../../../components/ShowtimesView'
import {getImageVersion} from '../../../utils/ImageHelper'

export default class FunctionCell extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    cover: PropTypes.string,
    functions: PropTypes.array,
    rowNumber: PropTypes.number,
    onPress: PropTypes.func
  };

  render () {
    const {title, cover, functions, rowNumber, onPress} = this.props
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
          <View style={styles.textContainer}>
            <Text style={styles.name}>
              {title}
            </Text>
            {getFunctionsViews(functions)}
          </View>
        </View>
      </MyListViewCell>
    )
  }
}

const getFunctionsViews = (functions) => {
  return (
    functions.map((func, index) => {
      return (
        <ShowtimesView
          key={func.function_id}
          functionTypes={func.function_types}
          showtimes={func.showtimes}
        />
      )
    })
  )
}

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  textContainer: {
    flex: 1,
    alignSelf: 'flex-start',
    marginLeft: 10
  },
  name: {
    fontSize: 22,
    fontWeight: '400',
    color: Colors.titleText
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
  }

})
