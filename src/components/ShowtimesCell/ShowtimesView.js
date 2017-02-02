import React, {PropTypes} from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import Colors from '../../../data/Colors'

type Props = {
  functionTypes: string,
  showtimes: string
}

export default class ShowtimesView extends React.Component {
  static propTypes: Props

  render () {
    const {functionTypes, showtimes} = this.props
    return (
      <View
        style={styles.functionView}>
        <Text style={styles.functionTypes}>
          {functionTypes.split(', ').join('  ')}
        </Text>
        <Text style={styles.showtimes}>
          {showtimes.split(', ').join('  ')}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  functionView: {
    marginTop: 5
  },
  functionTypes: {
    fontSize: 18,
    fontWeight: '300',
    color: Colors.functionTypes,
    marginTop: 5
  },
  showtimes: {
    fontFamily: 'Verdana',
    fontSize: 16,
    color: Colors.showtimes,
    marginTop: 2
  }
})
