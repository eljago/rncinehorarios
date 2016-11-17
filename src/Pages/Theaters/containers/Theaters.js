'use strict';

import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import ReactNative, { NavigationExperimental } from 'react-native'
import _ from 'lodash'

const { PropTypes: NavigationPropTypes } = NavigationExperimental;

import MyGiftedListView from '../../../components/MyGiftedListView';
import SimpleCell from '../../../components/SimpleCell';

class Theaters extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func,
    onPopRoute: PropTypes.func,
  };

  constructor(props) {
    super(props);
    _.bindAll(this, [
      '_renderRow',
    ]);
  }

  render() {
    const viewer = this.props.viewer;
    const dataRows = viewer ? viewer.theaters : [];
    return (
      <MyGiftedListView
        renderRow={this._renderRow}
        dataRows={dataRows}
      />
    );
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <SimpleCell
        rowNumber={rowData.rowNumber}
        title={rowData.name}
        onPress={() => this._onPress(rowData)}
      />
    );
  }

  _onPress(rowData) {
    const theater_id = rowData.theater_id;
    const name = rowData.name;
    // const functionsRoute = getFunctionsRoute(name, theater_id);
    // this.props.navigator.push(functionsRoute);
  }
}

export default Relay.createContainer(Theaters, {

  initialVariables: {
    cinema_id: 0
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        theaters(cinema_id: $cinema_id) {
          name
          address
        }
      }
    `
  },
});