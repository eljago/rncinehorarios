// @flow
'use strict'

import Relay from 'react-relay'

import Videos from './containers/Videos'

export default Relay.createContainer(Videos, {

  initialVariables: {
    cacheTime: 'defaultCacheDate',
    totalVideos: 10
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        latestVideos: videos(cacheTime: $cacheTime, first: $totalVideos){
          edges {
            cursor
            node {
              name
              image
              code
              video_type
              show{
                name
                cover
              }
            }
          }
          pageInfo {
            hasNextPage
          }
        }
        billboardVideos: videos(cacheTime: $cacheTime, filter: "billboard", first: 999){
          edges {
            cursor
            node {
              name
              image
              code
              video_type
              show{
                name
                cover
              }
            }
          }
        }
        comingSoonVideos: videos(cacheTime: $cacheTime, filter: "coming_soon", first: 999){
          edges {
            cursor
            node {
              name
              image
              code
              video_type
              show{
                name
                cover
              }
            }
          }
        }
      }
    `
  }
})
