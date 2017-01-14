// @flow
'use strict'

import Relay from 'react-relay'

import Videos from './containers/Videos'

export default Relay.createContainer(Videos, {

  initialVariables: {
    cacheTime: 'defaultCacheDate',
    totalVideos: 15
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        latestVideos: videos(cacheTime: $cacheTime, first: $totalVideos){
          edges {
            cursor
            node {
              video_id
              name
              image
              code
              video_type
              show{
                show_id
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
              video_id
              name
              image
              code
              video_type
              show{
                show_id
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
              video_id
              name
              image
              code
              video_type
              show{
                show_id
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
