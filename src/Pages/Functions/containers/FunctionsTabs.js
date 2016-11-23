'use strict'

import React, { PropTypes } from 'react'
import moment from 'moment'
import _ from 'lodash'

import ScrollableTabView from 'react-native-scrollable-tab-view'
import TabBar from '../components/TabBar'
import MyGiftedListView from '../../../components/MyGiftedListView'
import FunctionsCell from '../components/FunctionsCell'

export default class FunctionsTabs extends React.Component {
  static propTypes = {
    onPushRoute: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      dates: getDates(),
    }
    _.bindAll(this, ['_renderRow', '_onPress'])
  }

  render() {
    return (
      <ScrollableTabView initialPage={0} renderTabBar={() => <TabBar />}>
        {this._getTabs()}
      </ScrollableTabView>
    );
  }

  _getTabs() {
    return this.state.dates.map((date) => {
      const dataRows = getDataRows(date, this.props.viewer.shows_functions)
      return(
        <MyGiftedListView
          key={date}
          tabLabel={date}
          renderRow={this._renderRow}
          dataRows={dataRows}
        />
      );
    })
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <FunctionsCell
        rowNumber={rowData.rowNumber}
        title={rowData.name}
        cover={rowData.cover}
        functions={rowData.functions}
        onPress={this._onPress}
      />
    );
  }

  _onPress(rowData) {
    // const showRoute = getShowRoute(rowData.get('show_id'))
    // this.props.navigator.navigator.push(showRoute)
  }
}

function getDates() {
  const today = moment();
  let dates = [today.format('YYYY-MM-DD')];
  for (let i = 1; i<7; i++) {
    dates.push(today.add(1, 'days').format('YYYY-MM-DD'));
  }
  return dates;
}

function getDataRows(date, shows_functions) {
  let dataRows = []
  for(const show of shows_functions){
    const {id, name, information, genres, cover, show_id} = show;

    const functions = show.functions.filter((obj) => {
      return (obj.date === date);
    });

    if (functions.length > 0) {
      dataRows.push({
        id: id,
        name: name,
        information: information,
        genres: genres,
        cover: cover,
        functions: functions,
        show_id: show_id
      });
    }
  }
  return dataRows
}