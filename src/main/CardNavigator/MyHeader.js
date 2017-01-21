// @flow
'use strict'

import React, { PropTypes } from 'react'
import {
  I18nManager,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  NavigationExperimental,
  View
} from 'react-native'

const {
  Header: NavigationHeader,
  PropTypes: NavigationPropTypes
} = NavigationExperimental

import HeaderButton from '../../components/HeaderButton'
import Colors from '../../../data/Colors'

export default class MyHeader extends React.Component {
  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    onPopRoute: PropTypes.func.isRequired,
    onPressMenu: PropTypes.func.isRequired,
  };

  render (): React.Element {
    return (
      <NavigationHeader
        style={[styles.header, this.props.scene.route.headerStyle]}
        {...this.props}
        renderTitleComponent={this._renderTitleComponent}
        renderLeftComponent={this._renderLeftComponent.bind(this)}
        renderRightComponent={this._renderRightComponent.bind(this)}
        onNavigateBack={this.props.onPopRoute}
      />
    )
  }

  _renderTitleComponent (props: Object): React.Element {
    const route = props.scene.route
    return (
      <NavigationHeader.Title
        style={route.headerTitleStyle}
        textStyle={styles.title}
      >
        {route.title ? route.title : route.key}
      </NavigationHeader.Title>
    )
  }

  _renderLeftComponent (props: Object) {
    if (props.scene.index === 0) {
      return null
    }
    if (!props.onNavigateBack) {
      return null
    }
    return (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={props.onNavigateBack}
      >
        <Image
          style={styles.button}
          source={require('../../../assets/back-icon.png')}
        />
      </TouchableOpacity>
    )
  }

  _renderRightComponent (props: Object) {
    if (props.scene.index === 0) {
      return (
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.props.onPressMenu}
        >
          <Image
            style={[styles.button, styles.buttonMenu]}
            source={require('../../../assets/MenuIcon.png')}
          />
        </TouchableOpacity>
      )
    }
    const {rightComponent, rightComponent2} = props.scene.route
    let childs = []
    if (rightComponent) {
      childs.push(<HeaderButton key='rc1' ref={(rc) => { this.rightComp = rc }} />)
    }
    if (rightComponent2) {
      childs.push(<HeaderButton key='rc2' ref={(rc) => { this.rightComp2 = rc }} />)
    }
    if (childs.length > 0) {
      return (
        <View
          style={{flex: 1, flexDirection: 'row'}}
        >
          {childs}
        </View>
      )
    }
    return null
  }

  getRightComponent () {
    return this.rightComp
  }

  getRightComponent2 () {
    return this.rightComp2
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.navBar,
    borderBottomWidth: 0
  },
  title: {
    color: 'white',
    // textAlign: 'left'
  },
  buttonContainer: {
    flex: 1,
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
  buttonMenu: {
    margin: 16
  }
})
