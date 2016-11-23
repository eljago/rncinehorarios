//@flow
'use strict'

import Relay from 'react-relay'
import Theaters from './containers/Theaters'

export default Relay.createContainer(Theaters, {

  initialVariables: {
    cinema_id: 0
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        theaters(cinema_id: $cinema_id) {
          name
          address
          theater_id
        }
      }
    `
  },
});