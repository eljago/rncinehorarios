// @flow
'use strict';

import React, { PropTypes } from 'react';
import _ from 'lodash';
import MyGiftedListView from '../../../components/MyGiftedListView'
import MovieCell from '../../../components/MovieCell';

import {getShowRoute} from '../../../../data/routes'

export default class Billboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      viewType: 'default'
    }
    _.bindAll(this, ['_renderRow', '_onPress'])
  }

  render() {
    return (
      <MyGiftedListView
        renderRow={this._renderRow}
        dataRows={this.props.viewer.billboard}
      />
    );
  }

  _onPress(rowData) {
    console.log(rowData);
    const showRoute = getShowRoute(rowData.show_id, rowData.name);
    this.props.onPushRoute(showRoute);
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
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
        showingScores={this.props.viewType === 'scores'}
        isBillboard={true}
      />
    );
  }
}
