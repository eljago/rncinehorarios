// @flow
'use strict'

import Relay from 'react-relay'
import Billboard from './container/Billboard'

export default Relay.createContainer(Billboard, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        billboard {
          show_id
          name
          cover
          genres
          rating
          duration
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
