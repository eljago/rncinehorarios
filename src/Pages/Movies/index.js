// @flow
'use strict'

import Relay from 'react-relay'

import Movies from './containers/Movies'

export default Relay.createContainer(Movies, {

  initialVariables: {
    cacheTime: 'defaultCacheDate'
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        billboard: shows(filter: "billboard", cacheTime: $cacheTime) {
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
        comingSoon: shows(filter: "coming_soon", cacheTime: $cacheTime){
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
