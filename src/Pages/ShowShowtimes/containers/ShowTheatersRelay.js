// @flow
'use strict'

import Relay from 'react-relay'

import ShowTheaters from './ShowTheaters'

export default Relay.createContainer(ShowTheaters, {

  initialVariables: {
    show_id: 0,
    cinema_id: 0,
    cacheTime: 'defaultCacheDate'
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        theaters(show_id: $show_id, cinema_id: $cinema_id, cacheTime: $cacheTime){
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
