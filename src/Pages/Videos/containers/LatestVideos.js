// @flow
'use strict'

import React, {PropTypes} from 'react'
import Relay from 'react-relay'

import LatestVideos from '../components/LatestVideos'

export default Relay.createContainer(
  class extends React.Component {

    static propTypes = {
      latestVideos: PropTypes.array
    }

    render() {
      return (
        <LatestVideos
          latestVideos={this.props.latestVideos}
        />
      )
    }

  }, {

    initialVariables: {
      cacheTime: "defaultCacheDate",
    },

    fragments: {
      latestVideos: () => Relay.QL`
        fragment on VideoType @relay(plural: true){
          name
          image
        }
      `
    }
  }
)
