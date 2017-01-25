// @flow
'use strict'

import React, {PropTypes} from 'react'
import {View} from 'react-native'

import MyHeaderListView from '../../../components/MyHeaderListView'
import MyGiftedListView from '../../../components/MyGiftedListView'
import MovieCell from '../components/MovieCell'
import {getShowRoute} from '../../../../data/routes'

export default class Movies extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired
  }
  state = {
    viewType: 'default'
  }

  render () {
    const {viewer} = this.props
    if (viewer == null) {
      return <View style={{flex: 1, backgroundColor: 'white'}} />
    }
    const {billboard, comingSoon} = viewer
    return (
      <MyHeaderListView
        dataRows={[billboard, comingSoon]}
        titles={['Cartelera', 'Próximamente']}
        renderPage={this._renderPage.bind(this)}
      />
    )
  }

  _renderPage (rowData, sectionID, rowID, highlightRow) {
    const renderRow = rowID === '0' ? this._renderBillboardRow : this._renderComingSoonRow
    return (
      <MyGiftedListView
        renderRow={renderRow.bind(this)}
        dataRows={rowData}
        onPress={this._onPress.bind(this)}
        forceFetch={this.props.relay.forceFetch}
      />
    )
  }

  _onPress (rowData) {
    const props = {
      title: rowData.name
    }
    const relayProps = {
      show_id: rowData.show_id
    }
    this.props.onPushRoute(getShowRoute(props, relayProps))
  }

  _renderBillboardRow (rowData, sectionID, rowID, highlightRow) {
    return (
      <MovieCell
        rowNumber={rowData.rowNumber}
        onPress={() => this._onPress(rowData)}
        showName={rowData.name}
        showGenres={rowData.genres}
        showDuration={rowData.duration}
        showRating={rowData.rating}
        showCover={rowData.cover}
        showImdbCode={rowData.imdb_code}
        showImdbScore={rowData.imdb_score}
        showMetacriticUrl={rowData.metacritic_url}
        showMetacriticScore={rowData.metacritic_score}
        showRottenTomatoesUrl={rowData.rotten_tomatoes_url}
        showRottenTomatoesScore={rowData.rotten_tomatoes_score}
        showingScores={this.state.viewType === 'scores'}
        isBillboard
      />
    )
  }

  _renderComingSoonRow (rowData, sectionID, rowID, highlightRow) {
    return (
      <MovieCell
        rowNumber={rowData.rowNumber}
        onPress={() => this._onPress(rowData)}
        showName={rowData.name}
        showGenres={rowData.genres}
        showDebut={rowData.debut}
        showCover={rowData.cover}
        showImdbCode={rowData.imdb_code}
        showImdbScore={rowData.imdb_score}
        showMetacriticUrl={rowData.metacritic_url}
        showMetacriticScore={rowData.metacritic_score}
        showRottenTomatoesUrl={rowData.rotten_tomatoes_url}
        showRottenTomatoesScore={rowData.rotten_tomatoes_score}
        showingScores={this.state.viewType === 'scores'}
        isBillboard={false}
      />
    )
  }
}
