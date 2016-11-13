// @flow
'use strict';

import React, { PropTypes } from 'react'
import ReactNative, { NavigationExperimental } from 'react-native'
const { PropTypes: NavigationPropTypes } = NavigationExperimental;

import createAppNavigationContainer from '../../../Navigation/CreateNavigationContainer';
import GetRoute from '../../../Navigation/GetRoute'

import Cinemas from '../components/Cinemas'
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
    }
  }

  render() {
    return (
      <Cinemas 
        onPress={this._onPress.bind(this)}
        dataRows={this.state.dataRows}
      />
    )
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