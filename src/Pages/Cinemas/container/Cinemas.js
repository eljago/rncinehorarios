// @flow
'use strict';

import React, { PropTypes } from 'react'
import ReactNative, { NavigationExperimental } from 'react-native'
import _ from 'lodash'

const {
  PropTypes: NavigationPropTypes
} = NavigationExperimental;

import MyGiftedListView from '../../../components/MyGiftedListView'
import CinemaCell from '../components/CinemaCell'
import CINEMAS from '../../../../data/Cinemas'
import {getTheatersRoute} from '../../../../data/routes'

export default class extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      dataRows: CINEMAS,
    };
    _.bindAll(this, [
      '_renderRow',
    ]);
  }

  render() {
    return (
      <MyGiftedListView
        renderRow={this._renderRow}
        dataRows={this.state.dataRows}
      />
    );
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    const images = rowData.images;
    const image = images.length > 0 ? images[Math.floor(Math.random()*images.length)] : null;
    return (
      <CinemaCell
        rowNumber={rowData.rowNumber}
        title={rowData.name}
        image={image}
        onPress={() => {
          this._onPress(rowData);
        }}
      />
    );
  }

  _onPress(rowData) {
    const route = getTheatersRoute(rowData.cinema_id, rowData.name);
    this.props.onPushRoute(route);
  }
}