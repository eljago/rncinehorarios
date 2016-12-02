//@flow
'use strict'

import React, { PropTypes } from 'react'
import _ from 'lodash';
import {
  Platform,
  I18nManager,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native'

export default class ShowHeader extends React.Component {
  
  static propTypes = {
    showName: PropTypes.string,
    showOriginalName: PropTypes.string,
    showYear: PropTypes.number,
    onNavigateBack: PropTypes.func,
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.buttonContainer} onPress={this.props.onNavigateBack}>
          <Image style={styles.button} source={require('../../../../assets/back-icon.png')} />
        </TouchableOpacity>
        <View style={styles.titleView}>
          <Text style={styles.showName}>{this.props.showName}</Text>
          <Text style={styles.showOriginalName}>
            {this.props.showOriginalName} 
            {' '}({this.props.showYear})
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingTop: 20,
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    tintColor: 'white',
    height: 24,
    width: 24,
    margin: Platform.OS === 'ios' ? 10 : 16,
    resizeMode: 'contain',
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
  },
  titleView: {
    flex: 1,

  },
  showName: {
    color: 'white',
    fontSize: 25,
  },
  showOriginalName: {
    color: 'white',
    fontSize: 18,
  }
});