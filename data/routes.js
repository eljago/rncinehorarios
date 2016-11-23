//@flow
'use strict'

import Cinemas from '../src/Pages/Cinemas'
import Theaters from '../src/Pages/Theaters'
import Functions from '../src/Pages/Functions'
import RelayContainer from '../src/components/RelayContainer'

function getTabBarRoute() {
  return({
    tabs: {
      index: 0,
      routes: [
        {key: 'cinemas'},
        {key: 'billboard'},
        {key: 'coming_soon'},
      ],
    },
    // Scenes for the `apple` tab.
    cinemas: {
      index: 0,
      routes: [{key: 'Cines', component: Cinemas}],
    },
    // Scenes for the `banana` tab.
    billboard: {
      index: 0,
      routes: [{key: 'Cartelera', component: Cinemas}],
    },
    // Scenes for the `orange` tab.
    coming_soon: {
      index: 0,
      routes: [{key: 'Próximamente', component: Cinemas}],
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
      relayParams: {
        cinema_id: cinemaId,
      },
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
      relayParams: {
        theater_id: theaterId
      },
      extraProps: {
        theaterId: theaterId,
        theaterName: theaterName,
      }
    }
  });
}

export {getTabBarRoute, getTheatersRoute, getFunctionsRoute};