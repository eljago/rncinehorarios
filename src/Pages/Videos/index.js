// @flow
'use strict'

import Relay from 'react-relay'

import Videos from './containers/Videos'

export default Relay.createContainer(Videos, {

  initialVariables: {
    cacheTime: 'defaultCacheDate',
    page: 1
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        latestVideos: videos(cacheTime: $cacheTime, page: $page){
          name
          image
          code
          video_type
          show{
            name
            cover
          }
        }
        billboardVideos: videos(cacheTime: $cacheTime, filter: "billboard"){
          name
          image
          code
          video_type
          show{
            name
            cover
          }
        }
        comingSoonVideos: videos(cacheTime: $cacheTime, filter: "coming_soon"){
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
    `
  }
})
