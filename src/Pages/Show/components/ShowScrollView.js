//@flow
'use strict'

import React, { PropTypes } from 'react'
import { ScrollView, View, Image, StyleSheet } from 'react-native'

export default class ShowScrollView extends React.Component {
  static propTypes = {
    image: PropTypes.string,
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{uri: this.props.image}}
          resizeMode='cover'
        >
          <ScrollView
            style={styles.scrollview}
            contentContainerStyle={styles.scrollviewContent}
          >
            {this.props.children}
          </ScrollView>
        </Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollview: {
    backgroundColor: 'rgba(1,1,1,0.85)',
  },
  scrollviewContent: {
    flex: 1,
  },
  container: {
    flex: 1,
  }
});