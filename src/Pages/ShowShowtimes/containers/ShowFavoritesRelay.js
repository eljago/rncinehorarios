// @flow
'use strict'

import Relay from 'react-relay'

import ShowFavorites from './ShowFavorites'

export default Relay.createContainer(ShowFavorites, {

  initialVariables: {
    show_id: 0,
    theater_ids: [],
    cacheTime: 'defaultCacheDate'
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        theaters(show_id: $show_id, theater_ids: $theater_ids, cacheTime: $cacheTime){
          cinema_id
          theater_id
          name
          functions{
            function_id
            date
            showtimes
            function_types
          }
        }
      }
    `
  }
})
