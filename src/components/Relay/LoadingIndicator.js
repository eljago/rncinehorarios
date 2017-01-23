'use strict'

import React, {PropTypes} from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View
} from 'react-native'

export default class LoadingIndicator extends React.Component {
  static propTypes = {
    backgroundStyle: PropTypes.object
  }

  render () {
    return (
      <View style={[styles.loadingContainer, this.props.backgroundStyle]}>
        <View style={styles.activityContainer}>
          <ActivityIndicator
            style={styles.activityIndicator}
            size='large'
            color='white'
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6E6E6'
  },
  activityContainer: {
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(1,1,1,0.5)'
  },
  activityIndicator: {
    width: 36,
    height: 36
  }
})
