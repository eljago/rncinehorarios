'use strict';

import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import ReactNative, { NavigationExperimental } from 'react-native'
import _ from 'lodash'

const { PropTypes: NavigationPropTypes } = NavigationExperimental;
import createAppNavigationContainer from '../../../Navigation/CreateNavigationContainer';

import MyGiftedListView from '../../../components/MyGiftedListView';
import SimpleCell from '../../../components/SimpleCell';

const ContainerTheaters = createAppNavigationContainer(class extends React.Component {
  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    navigate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    _.bindall(this, [
      '_renderRow',
      '_onPress',
    ]);
  }

  render() {
    const viewer = this.props.viewer;
    const dataRows = viewer ? viewer.api_theaters : [];
    return (
      <MyGiftedListView
        renderRow={this._renderRow.bind(this)}
        dataRows={dataRows}
      />
    );
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <SimpleCell
        rowNumber={rowData.rowNumber}
        title={rowData.name}
        onPress={() => this.props.onPress(rowData)}
      />
    );
  }

  _onPress(rowData) {
    const theater_id = rowData.theater_id;
    const name = rowData.name;
    // const functionsRoute = getFunctionsRoute(name, theater_id);
    // this.props.navigator.push(functionsRoute);
  }
});

export default Relay.createContainer(ContainerTheaters, {

  initialVariables: {
    cinema_id: 0
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        api_theaters(cinema_id: $cinema_id) {
          cinema_id
          theater_id
          name
          address
        }
      }
    `
  },
});