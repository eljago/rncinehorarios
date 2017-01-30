//@flow
'use strict'

import React from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet
} from 'react-native'

import MyListViewCell from './MyListViewCell'
import CINEMAS from '../../data/Cinemas'

type Props = {
  cinemaId: number,
  onPress: () => void,
  style: Object,
  textStyle: Object,
  imageStyle: Object
}

export default class CinemaCell extends React.Component {
  static propTypes: Props

  render () {
    for (const cinema of CINEMAS) {
      if (cinema.cinema_id === this.props.cinemaId) {
        const images = cinema.images
        const image = images.length > 0 ? images[Math.floor(Math.random() * images.length)] : null
        return (
          <MyListViewCell
            rowNumber={0}
            onPress={this.props.onPress}
          >
            <View style={[styles.container, this.props.style]}>
              <Image style={[styles.image, this.props.imageStyle]} source={image} />
              <Text style={[styles.text, this.props.textStyle]}> {cinema.name} </Text>
            </View>
        </MyListViewCell>
        )
      }
    }
    return null
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: 30, height: 30
  },
  text: {
    marginLeft: 10,
    fontSize: 22,
    textAlign: 'left'
  }
})
