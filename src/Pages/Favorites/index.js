// @flow
'use strict'

import Relay from 'react-relay'
import Favorites from './containers/Favorites'

export default Relay.createContainer(Favorites, {

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
