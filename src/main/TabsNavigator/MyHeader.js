// @flow
'use strict';

import React, { PropTypes } from 'react';
import _ from 'lodash';
import ReactNative, {
  I18nManager,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  NavigationExperimental
} from 'react-native';

const {
  Header: NavigationHeader,
  PropTypes: NavigationPropTypes,
} = NavigationExperimental;

import Colors from '../../../data/Colors'

export default class MyHeader extends React.Component {
  static propTypes = {
    ...NavigationPropTypes.SceneRendererProps,
    onPopRoute: PropTypes.func.isRequired,
  };

  constructor(props: Object, context: any) {
    super(props, context);
  }

  render(): React.Element {
    return (
      <NavigationHeader
        style={styles.header}
        {...this.props}
        renderTitleComponent={this._renderTitleComponent}
        renderLeftComponent={this._renderLeftComponent}
        renderRightComponent={this._renderRightComponent.bind(this)}
        onNavigateBack={this.props.onPopRoute}
      />
    );
  }

  _renderTitleComponent(props: Object): React.Element {
    const route = props.scene.route;
    return (
      <NavigationHeader.Title textStyle={[styles.title, route.headerStyle]}>
        {route.title ? route.title : route.key}
      </NavigationHeader.Title>
    );
  }

  _renderLeftComponent(props: Object) {
    if (props.scene.index === 0 || !props.onNavigateBack) {
      return null;
    }
    return (
      <TouchableOpacity style={styles.buttonContainer} onPress={props.onNavigateBack}>
        <Image style={styles.button} source={require('../../../assets/back-icon.png')} />
      </TouchableOpacity>
    );
  }

  _renderRightComponent(props: Object) {
    const RightComp = props.scene.route.rightComponent;
    if (RightComp) {
      return <RightComp ref={(rc) => {this.rightComp = rc;}} />;
    }
    return null;
  }

  getRightComponent() {
    return this.rightComp;
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.navBar,
  },
  title: {
    color: 'white',
  },
  buttonContainer: {
    flex: 1,
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
  }
});