// @flow
'use strict'

import Relay from 'react-relay'

import Functions from './containers/Functions'

export default Relay.createContainer(Functions, {

  initialVariables: {
    theater_id: 0,
    date: null,
    cacheTime: 'defaultCacheDate'
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        shows(theater_id: $theater_id, date: $date, cacheTime: $cacheTime){
          show_id
          name
          cover
          has_functions
          functions{
            function_id
            date
            showtimes
            function_types
            theater_id
            theater{
              theater_id
              name
              cinema_id
            }
          }
        }
      }
    `
  }
})
