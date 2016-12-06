// @flow
'use strict'

import Relay from 'react-relay'

import Show from './containers/Show'

export default Relay.createContainer(Show, {

  initialVariables: {
    show_id: 0
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        show(show_id: $show_id){
          id
          name
          name_original
          year
          duration
          debut
          information
          imdb_code
          imdb_score
          metacritic_url
          metacritic_score
          rotten_tomatoes_url
          rotten_tomatoes_score
          genres
          active
          rating
          cover
          images {
            image_id
            width
            height
            poster
            backdrop
            image
          }
          cast {
            person_id
            actor
            director
            character
            position
            person {
              name
              image
              imdb_code
            }
          }
          videos {
            name
            code
            outstanding
            image
          }
        }
      }
    `
  }
})
