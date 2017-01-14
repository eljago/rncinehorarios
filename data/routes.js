// @flow
'use strict'

import Relay from 'react-relay'
import {Platform} from 'react-native'
import moment from 'moment'

import Cinemas from '../src/Pages/Cinemas'
import Movies from '../src/Pages/Movies'
import Theaters from '../src/Pages/Theaters'
import Functions from '../src/Pages/Functions'
import Show from '../src/Pages/Show'
import Videos from '../src/Pages/Videos'
import Video from '../src/Pages/Video'
import RelayContainer from '../src/components/RelayContainer'
import PhotoBrowser from '../src/components/PhotoBrowser'

import HeaderButton from '../src/components/HeaderButton'

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

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

function getMenuRoutes () {
  return [
    getVideosRoute(),
    getMoviesRoute(),
    getCinemasRoute()
  ]
}

function getCinemasRoute () {
  return {
    key: 'cinemas',
    title: 'Cines',
    screenView: 'Cinemas',
    component: Cinemas
  }
}

function getMoviesRoute () {
  return {
    key: 'movies',
    title: 'Películas',
    screenView: 'Movies',
    component: RelayContainer,
    props: {
      component: Movies,
      queryConfig: new ViewerQueryConfig({
        cacheTime: getCacheTime()
      })
    }
  }
}

function getVideosRoute () {
  return {
    key: 'videos',
    title: 'Videos',
    screenView: 'Videos',
    component: RelayContainer,
    props: {
      component: Videos,
      queryConfig: new ViewerQueryConfig({
        cacheTime: getCacheTime()
      })
    }
  }
}

function getTheatersRoute (cinemaId, cinemaName) {
  return ({
    key: 'Theaters',
    title: cinemaName,
    screenView: 'Theaters',
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
    screenView: 'Functions',
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
    screenView: 'Show',
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
      },
      backgroundStyle: {
        backgroundColor: 'black',
        marginTop: -(APPBAR_HEIGHT + STATUSBAR_HEIGHT),
        paddingTop: APPBAR_HEIGHT + STATUSBAR_HEIGHT
      }
    },
    headerStyle: {
      backgroundColor: 'rgba(0,0,0,0.5)'
    }
  })
}

function getVideoRoute(video) {
  return ({
    key: 'Video',
    title: video.name,
    screenView: 'Video',
    component: Video,
    props: {
      video: video
    }
  })
}

function getCacheTime () {
  const today = moment()
  const minutes = parseInt(today.format('mm'))
  return `${today.format('YYYY-MM-DD-hh-')}${Math.floor(minutes / 30)}`
}

export {
  getMenuRoutes,
  getTheatersRoute,
  getFunctionsRoute,
  getShowRoute,
  getVideoRoute
}
