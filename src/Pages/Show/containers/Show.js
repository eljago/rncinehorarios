//@flow
'use strict'

import React, { PropTypes } from 'react'
import {View, Text} from 'react-native'

import ShowScrollView from '../components/ShowScrollView'
import ShowContent from '../components/ShowContent'

import {getImageVersion} from '../../../utils/ImageHelper'

export default class Show extends React.Component {

  render() {
    const show = this.props.viewer.show;
    return (
      <View style={{flex: 1}}>
        <ShowScrollView
          image={getImageVersion(show.cover)}
        >
          <ShowContent
            showName={show.name}
            showOriginalName={show.name_original}
            showYear={show.year}
          />
        </ShowScrollView>
      </View>
    );
  }
}