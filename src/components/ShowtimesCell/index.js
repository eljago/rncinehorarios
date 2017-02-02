//@flow
'use strict'

import React from 'react'

import {
  View,
  Text
} from 'react-native'

import ShowtimesView from './ShowtimesView'
import Colors from '../../../data/Colors'

type Func = {
  date: string,
  function_id: number,
  function_types: string,
  showtimes: string
}
type Props = {
  currentDate: string,
  rowNumber: number,
  title: string,
  function: Func[],
  style: Object
}

export default class ShowtimesCell extends React.Component {
  static propTypes: Props

  render () {
    const {title, rowNumber, functions, currentDate, style} = this.props
    return (
      <View style={[{
        flex: 1,
        backgroundColor: rowNumber % 2 === 0 ? 'white' : '#f2f2f2'
      }, style]}>
        <Text key='showtimes' style={{fontSize: 18, fontWeight: '500', color: Colors.navBar}}>
          {title}:
        </Text>
        {functions.map((func) => {
          if (func.date === currentDate) {
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
