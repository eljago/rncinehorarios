// @flow
'use strict'

import Relay from 'react-relay'
import {Platform} from 'react-native'

import Cinemas from '../src/Pages/Cinemas'
import Movies from '../src/Pages/Movies'
import Theaters from '../src/Pages/Theaters'
import Functions from '../src/Pages/Functions'
import Show from '../src/Pages/Show'
import ShowShowtimes from '../src/Pages/ShowShowtimes'
import Videos from '../src/Pages/Videos'
import VideoPlayer from '../src/Pages/VideoPlayer'
import {ViewerQueryConfig, getCacheTime} from '../src/utils/ViewerQueryConfig'
import Colors from './Colors'

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

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

function getTheatersRoute (props: Object) {
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

function getFunctionsRoute (props: Object, relayProps: Object) {
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
      marginLeft: Platform.OS === 'ios' ? 40 : 60,
      marginRight: 30
    },
    leftComponent2: true,
    rightComponent: true
  })
}

function getShowRoute (props: Object, relayProps: Object) {
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
      backgroundColor: Platform.OS === 'ios' ? 'rgba(0,0,0,0.5)' : 'black'
    },
    headerTitleStyle: {

    },
    headerTitleTextStyle: {
      textAlign: 'left'
    },
    rightComponent: true
  })
}

function getShowShowtimesRoute (props: Object): Object {
  return ({
    key: 'ShowShowtimes',
    title: props.title,
    screenView: 'ShowShowtimes',
    component: ShowShowtimes,
    props: props,
    headerStyle: {
      backgroundColor: Colors.tabBar
    },
    headerTitleStyle: {
      marginRight: 20
    },
    headerTitleTextStyle: {
      textAlign: 'left'
    },
    leftComponent: true,
    rightComponent: true
  })
}

function getVideoPlayerRoute(props: Object): Object {
  const {video} = props
  const {show} = video
  return ({
    key: 'VideoPlayer',
    title: `${show.name} - ${video.name}`,
    screenView: 'VideoPlayer',
    component: VideoPlayer,
    props: props,
    getStatusBar: () => null,
    headerStyle: {
      backgroundColor: Colors.tabBar
    },
    headerTitleStyle: {
      marginRight: Platform.OS === 'ios' ? -35 : 0
    }
  })
}

export {
  getMenuRoutes,
  getTheatersRoute,
  getFunctionsRoute,
  getShowRoute,
  getShowShowtimesRoute,
  getVideoPlayerRoute
}
