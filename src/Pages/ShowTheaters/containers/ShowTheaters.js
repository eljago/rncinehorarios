//@flow
'use strict'

import React, {PropTypes} from 'react'
import {
  View,
  Text
} from 'react-native'
import moment from 'moment'

import ShowFavorites from './ShowFavorites'

type Props = {

}
type State = {
  currentDate: string
}

export default class ShowTheaters extends React.Component {
  static propTypes: Props
  state: State
  _showFavorites: any

  constructor (props: Props) {
    super(props)
    this.state = {
      currentDate: moment().format('YYYY-MM-DD')
    }
  }

  render () {
    const {viewer} = this.props
    if (viewer != null && viewer.favoriteTheaters) {
      return (
        <ShowFavorites
          favoriteTheaters={viewer.favoriteTheaters}
          currentDate={this.state.currentDate}
        />
      )
    }
    return null
  }
}
