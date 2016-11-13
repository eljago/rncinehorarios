// @flow
'use strict';

import React, { PropTypes } from 'react'
import ReactNative, { NavigationExperimental } from 'react-native'
const { PropTypes: NavigationPropTypes } = NavigationExperimental;
import _ from 'lodash'

import createAppNavigationContainer from '../../../Navigation/CreateNavigationContainer';
import GetRoute from '../../../Navigation/GetRoute'
import MyGiftedListView from '../../../../components/MyGiftedListView'
import CinemaCell from '../components/CinemaCell'
import CINEMAS from '../../../../../data/Cinemas'

export default createAppNavigationContainer(class extends React.Component {
  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    navigate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      dataRows: CINEMAS,
    };
    _.bindAll(this, [
      '_renderRow',
      '_onPress',
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
        onPress={this._onPress}
      />
    );
  }

  _onPress(rowData) {
    const route = GetRoute('Billboard');
    route.props = {
      name: rowData.name,
      cinema_id: rowData.cinema_id,
    }
    this.props.navigate({type: 'push', route});
  }
});