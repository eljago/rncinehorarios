//@flow
'use strict'

import React, {PropTypes} from 'react'
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated
} from 'react-native'
import moment from 'moment'
import _ from 'lodash'

import MenuItem from './MenuItem'
import Colors from '../../../data/Colors'

type Props = {
  visible: bool,
  onPressMenuItem: (date: Object) => void,
  currentDate: string,
  dates: Object[],
  onClose: () => void
}
type State = {
  pickerLeft: Animated.Value,
  overlayColor: Animated.Value
}

export default class DatesMenu extends React.Component {
  static propTypes: Props
  _menuWidth: number = 150

  constructor(props: Props) {
    super(props)
    this.state = {
      pickerLeft: new Animated.Value(this._getMenuTargetValue()),
      overlayColor: new Animated.Value(this._getOverlayColor())
    }
  }

  componentDidUpdate (prevProps: Props) {
    if (prevProps.visible !== this.props.visible) {
      this._updateMenuPosition()
    }
  }

  render () {
    return (
      <View
        style={styles.container}
        pointerEvents={this.props.visible ? 'auto' : 'none'}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: this.state.overlayColor.interpolate({
              inputRange: [0, 300],
              outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']
            })
          }}
        >
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => {
              this.props.onPressMenuItem(moment(this.props.currentDate, 'YYYY-MM-DD'))
              this.props.onClose()
            }}
          />
        </Animated.View>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: this.state.pickerLeft,
            width: this._menuWidth + 50,
            backgroundColor: Colors.tabBar
          }}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainerStyle}>
            {this._getDateMenuItems()}
          </ScrollView>
        </Animated.View>
      </View>
    )
  }

  _getDateMenuItems () {
    return this.props.dates.map((date) => {
      const dateString = date.format('YYYY-MM-DD')
      const dateStringShort = _.upperFirst(date.format('ddd DD'))
      return (
        <MenuItem
          key={dateString}
          onPress={() => {
            this.props.onPressMenuItem(date)
            this.props.onClose()
          }}
          selected={dateString === this.props.currentDate}
          title={dateStringShort}
        />
      )
    })
  }

  _updateMenuPosition () {
    Animated.parallel([
      Animated.spring(
        this.state.pickerLeft,
        {
          toValue: this._getMenuTargetValue(),
          friction: 7
        }
      ),
      Animated.spring(
        this.state.overlayColor,{
          toValue: this._getOverlayColor(),
          velocity: 10,  // Velocity makes it move
          friction: 5,  // Oscillate a lot
        }
      )
    ]).start()
  }

  _getMenuTargetValue () {
    const {width} = Dimensions.get('window')
    return this.props.visible ? width - this._menuWidth : width
  }

  _getOverlayColor () {
    return this.props.visible ? 300 : 0
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0
  },
  scrollView: {
    flex: 1,
    paddingRight: 50
  },
  contentContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
