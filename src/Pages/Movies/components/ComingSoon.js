// @flow
'use strict'

import React, {PropTypes} from 'react'
import _ from 'lodash'

import MyGiftedListView from '../../../components/MyGiftedListView'
import MovieCell from './MovieCell'

export default class ComingSoon extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired,
    shows: PropTypes.array
  }
  static defaultProps = {
    shows: []
  }

  constructor (props) {
    super(props)
    this.state = {
      viewType: 'default'
    }
    _.bindAll(this, ['_renderRow', '_onPress'])
  }

  render () {
    return (
      <MyGiftedListView
        renderRow={this._renderRow}
        dataRows={this.props.shows}
      />
    )
  }

  _onPress (rowData) {
    // const showRoute = getShowRoute(rowData.get('show_id'))
    // this.props.navigator.push(showRoute)
  }

  _renderRow (rowData, sectionID, rowID, highlightRow) {
    return (
      <MovieCell
        rowNumber={rowData.rowNumber}
        onPress={this._onPress}
        showName={rowData.name}
        showDebut={rowData.debut}
        showCover={rowData.cover}
        showImdbCode={rowData.imdb_code}
        showImdbScore={rowData.imdb_score}
        showMetacriticUrl={rowData.metacritic_url}
        showMetacriticScore={rowData.metacritic_score}
        showRottenTomatoesUrl={rowData.rotten_tomatoes_url}
        showRottenTomatoesScore={rowData.rotten_tomatoes_score}
        showingScores={this.props.viewType === 'scores'}
        isBillboard={false}
      />
    )
  }
}
