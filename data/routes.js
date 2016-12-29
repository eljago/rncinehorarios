// @flow
'use strict'

import Relay from 'react-relay'
import moment from 'moment'

import TabsNavigator from '../src/main/TabsNavigator'
import Cinemas from '../src/Pages/Cinemas'
import Movies from '../src/Pages/Movies'
import Theaters from '../src/Pages/Theaters'
import Functions from '../src/Pages/Functions'
import Show from '../src/Pages/Show'
import Videos from '../src/Pages/Videos'
import RelayContainer from '../src/components/RelayContainer'
import PhotoBrowser from '../src/components/PhotoBrowser'

import HeaderButton from '../src/components/HeaderButton'

class ViewerQueryConfig extends Relay.Route {
  static routeName = 'ViewerQueryConfig'
  static queries = {
    viewer: () => Relay.QL`
      query Query {
        viewer
      }
    `
  }
}

function getMainAppRoute () {
  return {
    index: 0,
    routes: [{
      key: 'super_tabs',
      component: TabsNavigator,
      navBarHidden: true
    }]
  }
}

function getMainAppItems () {
  return ({
    items: {
      routes: [
        {key: 'videos', title: 'Videos'},
        {key: 'movies', title: 'Películas'},
        {key: 'cinemas', title: 'Cines'}
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
    movies: {
      index: 0,
      routes: [{
        key: 'movies',
        title: 'Películas',
        component: RelayContainer,
        props: {
          component: Movies,
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

function getCacheTime () {
  const today = moment()
  const minutes = parseInt(today.format('mm'))
  return `${today.format('YYYY-MM-DD-hh-')}${Math.floor(minutes / 30)}`
}

export {
  getMainAppRoute,
  getMainAppItems,
  getTheatersRoute,
  getFunctionsRoute,
  getShowRoute,
  getImageViewerRoute
}
