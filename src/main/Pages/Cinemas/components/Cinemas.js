'use strict';

import React, { PropTypes } from 'react';

import MyGiftedListView from '../../../../components/MyGiftedListView';
import CinemaCell from './CinemaCell';

export default class Cinemas extends React.Component {

  static propTypes = {
    onPress: PropTypes.func,
    dataRows: PropTypes.array
  };

  render() {
    return (
      <MyGiftedListView
        renderRow={this._renderRow.bind(this)}
        dataRows={this.props.dataRows}
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
        onPress={() => this.props.onPress(rowData)}
      />
    );
  }
}