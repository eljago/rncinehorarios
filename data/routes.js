//@flow
'use strict'

import Relay from 'react-relay';

import Cinemas from '../src/Pages/Cinemas'
import Theaters from '../src/Pages/Theaters'
import Functions from '../src/Pages/Functions'
import RelayContainer from '../src/components/RelayContainer'

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
        {key: 'cinemas', title: 'Cines'},
        {key: 'billboard', title: 'Cartelera'},
        {key: 'coming_soon', title: 'Próximamente'},
      ],
    },
    // Scenes for the `apple` tab.
    cinemas: {
      index: 0,
      routes: [{key: 'cinemas', component: Cinemas}],
    },
    // Scenes for the `banana` tab.
    billboard: {
      index: 0,
      routes: [{key: 'billboard', component: Cinemas}],
    },
    // Scenes for the `orange` tab.
    coming_soon: {
      index: 0,
      routes: [{key: 'coming_soon', component: Cinemas}],
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
  });
}

export {getTabBarRoute, getTheatersRoute, getFunctionsRoute};