// @flow
'use strict'

import Relay from 'react-relay'
import ComingSoon from './container/ComingSoon'

export default Relay.createContainer(ComingSoon, {

  initialVariables: {
    cacheTime: "defaultCacheDate"
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        coming_soon(cacheTime: $cacheTime){
          show_id
          name
          debut
          cover
          imdb_code
          imdb_score
          metacritic_url
          metacritic_score
          rotten_tomatoes_url
          rotten_tomatoes_score
        }
      }
    `
  }
})
