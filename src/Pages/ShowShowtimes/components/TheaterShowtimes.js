//@flow
'use strict'

import React from 'react'

import {
  View,
  Text
} from 'react-native'

import ShowtimesView from '../../../components/ShowtimesView'

export default class TheaterShowtimes extends React.Component {

  render () {
    const {theater} = this.props
    return (
      <View style={{
        flex: 1,
        padding: 10,
        backgroundColor: '#e0e0e0'
      }}>
        <Text key='showtimes' style={{fontSize: 18, fontWeight: '500'}}>
          {theater.name}:
        </Text>
        {theater.functions.map((func) => {
          if (func.date === this.props.currentDate) {
            return (
              <ShowtimesView
                key={func.function_id}
                functionTypes={func.function_types}
                showtimes={func.showtimes}
              />
            )
          }
        })}
      </View>
    )
  }
}
