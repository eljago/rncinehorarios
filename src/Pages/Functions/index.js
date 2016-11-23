//@flow
'use strict'

import Relay from 'react-relay'
import moment from 'moment'

import FunctionsTabs from './containers/FunctionsTabs'

export default Relay.createContainer(FunctionsTabs, {
  
  initialVariables: {
    theater_id: 0,
    date: moment().format('YYYY-MM-DD')
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        shows_functions(theater_id: $theater_id, date: $date){
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
  },
})