// @flow
'use strict'

import Relay from 'react-relay'
import moment from 'moment'

import Functions from './containers/Functions'

export default Relay.createContainer(Functions, {

  initialVariables: {
    theater_id: 0,
    date: moment().format('YYYY-MM-DD'),
    cacheTime: "defaultCacheDate"
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        shows(theater_id: $theater_id, date: $date, cacheTime: $cacheTime){
          id
          name
          cover
          functions{
            date
            showtimes
            function_types
          }
        }
      }
    `
  }
})
