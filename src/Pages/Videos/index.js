// @flow
'use strict'

import Relay from 'react-relay'

import Videos from './containers/Videos'
import LatestVideos from './containers/LatestVideos'

export default Relay.createContainer(Videos, {

  initialVariables: {
    cacheTime: "defaultCacheDate",
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        latestVideos: videos(cacheTime: $cacheTime){
          ${LatestVideos.getFragment('latestVideos')}
        }
      }
    `
  }
})
