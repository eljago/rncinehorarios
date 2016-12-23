// @flow
'use strict'

import React, {PropTypes} from 'react'
import {
  View
} from 'react-native'

import {IndicatorViewPager, PagerTitleIndicator} from 'rn-viewpager'
import Billboard from '../components/Billboard'
import ComingSoon from '../components/ComingSoon'

export default class Movies extends React.Component {

  render() {
    return (
      <View style={{flex: 1}}>
        <IndicatorViewPager
          style={{flex: 1, paddingTop: 40}}
          indicator={this._renderTitleIndicator()}
        >
          <View>
            <Billboard shows={this.props.viewer.billboard} />
          </View>
          <View>
            <ComingSoon shows={this.props.viewer.comingSoon} />
          </View>
        </IndicatorViewPager>
      </View>
    )
  }

  _renderTitleIndicator() {
    return (
      <PagerTitleIndicator
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}
        titles={['Cartelera', 'Próximamente']}
      />
    )
  }
}