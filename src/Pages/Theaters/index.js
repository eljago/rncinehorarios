// @flow
'use strict'

import Relay from 'react-relay'
import Theaters from './containers/Theaters'

export default Relay.createContainer(Theaters, {

  initialVariables: {
    cinema_id: 0,
    cacheTime: 'defaultCacheDate'
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        theaters(cinema_id: $cinema_id, cacheTime: $cacheTime) {
          name
          address
          theater_id
        }
      }
    `
  }
})
