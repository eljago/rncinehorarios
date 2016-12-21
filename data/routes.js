// @flow
'use strict'

import Relay from 'react-relay'
import moment from 'moment'

import Cinemas from '../src/Pages/Cinemas'
import Billboard from '../src/Pages/Billboard'
import ComingSoon from '../src/Pages/ComingSoon'
import Theaters from '../src/Pages/Theaters'
import Functions from '../src/Pages/Functions'
import Show from '../src/Pages/Show'
import Videos from '../src/Pages/Videos'
import RelayContainer from '../src/components/RelayContainer'
import PhotoBrowser from '../src/components/PhotoBrowser'

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

function getTabBarRoute () {
  return ({
    tabs: {
      index: 0,
      routes: [
        {key: 'videos', title: 'Videos'},
        {key: 'billboard', title: 'Cartelera'},
        {key: 'cinemas', title: 'Cines'},
        {key: 'coming_soon', title: 'Próx'}
      ]
    },
    cinemas: {
      index: 0,
      routes: [{
        key: 'cinemas',
        title: 'Cines',
        component: Cinemas
      }]
    },
    billboard: {
      index: 0,
      routes: [{
        key: 'billboard',
        title: 'Cartelera',
        component: RelayContainer,
        props: {
          component: Billboard,
          queryConfig: new ViewerQueryConfig({
            cacheTime: getCacheTime()
          })
        }
      }]
    },
    coming_soon: {
      index: 0,
      routes: [{
        key: 'coming_soon',
        title: 'Próximamente',
        component: RelayContainer,
        props: {
          component: ComingSoon,
          queryConfig: new ViewerQueryConfig({
            cacheTime: getCacheTime()
          })
        }
      }]
    },
    videos: {
      index: 0,
      routes: [{
        key: 'videos',
        title: 'Videos',
        component: RelayContainer,
        props: {
          component: Videos,
          queryConfig: new ViewerQueryConfig({
            cacheTime: getCacheTime()
          })
        }
      }]
    }
  })
}

function getTheatersRoute (cinemaId, cinemaName) {
  return ({
    key: 'Theaters',
    title: cinemaName,
    component: RelayContainer,
    props: {
      component: Theaters,
      queryConfig: new ViewerQueryConfig({
        cinema_id: cinemaId,
        cacheTime: getCacheTime()
      }),
      extraProps: {
        cinemaId: cinemaId,
        cinemaName: cinemaName
      }
    }
  })
}

function getFunctionsRoute (theaterId, theaterName) {
  return ({
    key: 'Functions',
    title: theaterName,
    component: RelayContainer,
    props: {
      component: Functions,
      queryConfig: new ViewerQueryConfig({
        theater_id: theaterId,
        cacheTime: getCacheTime()
      }),
      extraProps: {
        theaterId: theaterId,
        theaterName: theaterName
      }
    },
    rightComponent: HeaderButton
  })
}

function getShowRoute (showId, showName) {
  return ({
    key: 'Show',
    title: showName,
    component: RelayContainer,
    props: {
      component: Show,
      queryConfig: new ViewerQueryConfig({
        show_id: showId,
        cacheTime: getCacheTime()
      }),
      extraProps: {
        showId: showId,
        showName: showName
      }
    }
  })
}

function getImageViewerRoute (images, index = 0) {
  return ({
    key: 'PhotoBrowser',
    title: 'Imágenes',
    component: PhotoBrowser,
    props: {
      images: images,
      index: index
    }
  })
}

function getCacheTime() {
  const today = moment()
  const minutes = parseInt(today.format('mm'))
  return `${today.format('YYYY-MM-DD-hh-')}${Math.floor(minutes/30)}`
}

export {
  getTabBarRoute,
  getTheatersRoute,
  getFunctionsRoute,
  getShowRoute,
  getImageViewerRoute
}
