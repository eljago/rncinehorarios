//@flow
'use strict'

import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Image, I18nManager, Platform } from 'react-native';

export default class HeaderButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      onPress: null,
      image: null,
      title: null,
    }
  }

  render() {
    const {onPress, image, title} = this.state;
    let children = null;
    if (image) {
      children = <Image style={styles.button} source={image} />
    }
    else if (title) {
      children = <Text style={styles.text}>{title}</Text>;
    }
    return (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={onPress}
      >
        {children ? children : <View />}
      </TouchableOpacity>
    );
  }

  setup(options) {
    this.setState({
      ...options
    });
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    tintColor: 'white',
    height: 24,
    width: 100,
    margin: Platform.OS === 'ios' ? 10 : 16,
    resizeMode: 'contain',
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
  },
  text: {
    margin: Platform.OS === 'ios' ? 10 : 16,
    color: 'white',
    fontSize: 16,
  }
});