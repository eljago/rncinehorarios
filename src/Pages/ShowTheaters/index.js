// @flow
'use strict'

import Relay from 'react-relay'

import ShowTheaters from './containers/ShowTheaters'

export default Relay.createContainer(ShowTheaters, {

  initialVariables: {
    show_id: 0,
    theater_ids: [],
    cacheTime: 'defaultCacheDate'
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        theaters(show_id: $show_id, cacheTime: $cacheTime){
          cinema_id
          theater_id
          name
        }
        favoriteTheaters: theaters(theater_ids: $theater_ids, show_id: $show_id, cacheTime: $cacheTime){
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
