// @flow
'use strict'

import Relay from 'react-relay'
import Favorites from './containers/Favorites'

export default Relay.createContainer(Favorites, {

  initialVariables: {
    theater_ids: '',
    cacheTime: 'defaultCacheDate'
  },

  prepareVariables: (prevVariables) => {
    console.log(prevVariables)
    return {
      ...prevVariables
    };
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        theaters(theater_ids: $theater_ids, cacheTime: $cacheTime) {
          name
          address
          theater_id
        }
      }
    `
  }
})
