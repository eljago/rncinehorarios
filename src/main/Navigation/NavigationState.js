// @flow
'use strict';

const ReactNative = require('react-native');
import update from 'react/lib/update';

const NavigationStateUtils = ReactNative.NavigationExperimental.StateUtils;

import GetRoute from './GetRoute'

function createAppNavigationState(): Object {
  return GetRoute('MainTabs');
}

function updateAppNavigationState(state: Object, action: Object): Object {
  let {type} = action;
  if (type === 'BackAction') {
    type = 'pop';
  }

  switch (type) {
    case 'superPush': {
      const route: Object = action.route;
      const nextState = NavigationStateUtils.push(state, route);
      if (state !== nextState) {
        return nextState;
      }
      break;
    }

    case 'superPull': {
      const nextState = NavigationStateUtils.pop(state);
      if (state !== nextState) {
        return nextState;
      }
      break;
    }

    case 'push': {
      const route: Object = action.route;
      const superScenes = state.routes;
      const tabsRoute = superScenes[0];
      const tabs = tabsRoute.tabs;
      const tabKey = tabs.routes[tabs.index].key;
      const scenes = tabsRoute[tabKey];
      const nextScenes = NavigationStateUtils.push(scenes, route);
      if (scenes !== nextScenes) {
        return update(state, {routes: {0: {[tabKey]: {$set: nextScenes}}}});
      }
      break;
    }

    case 'pop': {
      const superScenes = state.routes;
      const tabsRoute = superScenes[0];
      const tabs = tabsRoute.tabs;
      const tabKey = tabs.routes[tabs.index].key;
      const scenes = tabsRoute[tabKey];
      const nextScenes = NavigationStateUtils.pop(scenes);
      if (scenes !== nextScenes) {
        return update(state, {routes: {0: {[tabKey]: {$set: nextScenes}}}});
      }
      break;
    }

    case 'selectTab': {
      const tabKey: string = action.tabKey;
      const superScenes = state.routes;
      const currentTabs = superScenes[0].tabs;
      const tabs = NavigationStateUtils.jumpTo(currentTabs, tabKey);
      if (tabs !== currentTabs) {
        return update(state, {routes: {0: {tabs: {$set: tabs}}}});
      }
    }
  }
  return state;
}

export {createAppNavigationState, updateAppNavigationState};
