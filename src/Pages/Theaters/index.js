// @flow
'use strict'

import Relay from 'react-relay'
import Theaters from './containers/Theaters'

export default Relay.createContainer(Theaters, {

  initialVariables: {
    cacheTime: 'defaultCacheDate'
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        theaters(cacheTime: $cacheTime) {
          cinema_id
          name
          address
          theater_id
        }
      }
    `
  }
})
