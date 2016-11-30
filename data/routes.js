//@flow
'use strict'

import React from 'react';
import Relay from 'react-relay';
import {Text} from 'react-native';

import Cinemas from '../src/Pages/Cinemas'
import Billboard from '../src/Pages/Billboard'
import ComingSoon from '../src/Pages/ComingSoon'
import Theaters from '../src/Pages/Theaters'
import Functions from '../src/Pages/Functions'
import Show from '../src/Pages/Show'
import RelayContainer from '../src/components/RelayContainer'

import HeaderButton from '../src/components/HeaderButton'

class ViewerQueryConfig extends Relay.Route {
  static routeName = 'ViewerQueryConfig';
  static queries = {
    viewer: () => Relay.QL`
      query Query {
        viewer
      }
    `
  };
}

function getTabBarRoute() {
  return({
    tabs: {
      index: 0,
      routes: [
        {key: 'billboard', title: 'Cartelera'},
        {key: 'cinemas', title: 'Cines'},
        {key: 'coming_soon', title: 'Próximamente'},
      ],
    },
    // Scenes for the `apple` tab.
    cinemas: {
      index: 0,
      routes: [{
        key: 'cinemas',
        title: 'Cines',
        component: Cinemas
      }],
    },
    // Scenes for the `banana` tab.
    billboard: {
      index: 0,
      routes: [{
        key: 'billboard',
        title: 'Cartelera',
        component: RelayContainer,
        props: {
          component: Billboard,
          queryConfig: new ViewerQueryConfig(),
        },
      }],
    },
    // Scenes for the `orange` tab.
    coming_soon: {
      index: 0,
      routes: [{
        key: 'coming_soon',
        title: 'Próximamente',
        component: RelayContainer,
        props: {
          component: ComingSoon,
          queryConfig: new ViewerQueryConfig(),
        },
      }],
    },
  });
}

function getTheatersRoute(cinemaId, cinemaName) {
  return({
    key: 'Theaters',
    title: cinemaName,
    component: RelayContainer,
    props: {
      component: Theaters,
      queryConfig: new ViewerQueryConfig({
        cinema_id: cinemaId,
      }),
      extraProps: {
        cinemaId: cinemaId,
        cinemaName: cinemaName,
      }
    }
  });
}

function getFunctionsRoute(theaterId, theaterName) {
  return({
    key: 'Functions',
    title: theaterName,
    component: RelayContainer,
    props: {
      component: Functions,
      queryConfig: new ViewerQueryConfig({
        theater_id: theaterId
      }),
      extraProps: {
        theaterId: theaterId,
        theaterName: theaterName,
      }
    },
    rightComponent: HeaderButton,
  });
}

function getShowRoute(showId, showName) {
  return({
    key: 'Show',
    title: showName,
    component: RelayContainer,
    props: {
      component: Show,
      queryConfig: new ViewerQueryConfig({
        show_id: showId
      }),
      extraProps: {
        showId: showId,
        showName: showName,
      }
    },
  });
}

export {getTabBarRoute, getTheatersRoute, getFunctionsRoute, getShowRoute};