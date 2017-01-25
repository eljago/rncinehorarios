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
    getCinemasRoute(),
    getMoviesRoute(),
    getVideosRoute()
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
    component: Movies,
    relay: {
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
    component: Videos,
    relay: {
      queryConfig: new ViewerQueryConfig({
        cacheTime: getCacheTime()
      })
    }
  }
}

function getTheatersRoute (props) {
  return ({
    key: 'Theaters',
    title: props.title,
    screenView: 'Theaters',
    component: Theaters,
    relay: {
      queryConfig: new ViewerQueryConfig({
        cacheTime: getCacheTime()
      })
    },
    props: props
  })
}

function getFunctionsRoute (props, relayProps) {
  return ({
    key: 'Functions',
    title: props.title,
    screenView: 'Functions',
    component: Functions,
    relay: {
      queryConfig: new ViewerQueryConfig({
        cacheTime: getCacheTime(),
        ...relayProps
      }),
    },
    props: props,
    headerTitleStyle: {
      marginLeft: 40,
      marginRight: 30
    },
    leftComponent2: true,
    rightComponent: true
  })
}

function getShowRoute (props, relayProps) {
  return ({
    key: 'Show',
    title: props.title,
    screenView: 'Show',
    component: Show,
    relay: {
      queryConfig: new ViewerQueryConfig({
        cacheTime: getCacheTime(),
        ...relayProps
      })
    },
    props: props,
    backgroundStyle: {
      backgroundColor: 'black',
      marginTop: -(APPBAR_HEIGHT + STATUSBAR_HEIGHT),
      paddingTop: APPBAR_HEIGHT + STATUSBAR_HEIGHT
    },
    headerStyle: {
      backgroundColor: 'rgba(0,0,0,0.5)'
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
  getShowRoute
}
