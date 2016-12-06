// @flow
'use strict'

import React, { PropTypes } from 'react'
import {
  Platform,
  I18nManager,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native'

export default class ShowHeader extends React.Component {

  static propTypes = {
    showName: PropTypes.string,
    onNavigateBack: PropTypes.func
  }

  render () {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonContainer} onPress={this.props.onNavigateBack}>
          <Image style={styles.button} source={require('../../../../assets/back-icon.png')} />
        </TouchableOpacity>
        <View style={styles.titleView}>
          <Text style={styles.showName}>
            {this.props.showName}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'row'
  },
  buttonContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    tintColor: 'white',
    height: 24,
    width: 24,
    margin: Platform.OS === 'ios' ? 10 : 16,
    resizeMode: 'contain',
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]
  },
  titleView: {
    flex: 1,
    paddingTop: 10,
    justifyContent: 'center',
    marginLeft: 10
  },
  showName: {
    color: 'white',
    fontSize: 22
  },
  showOriginalName: {
    color: 'white',
    fontSize: 18
  }
})
