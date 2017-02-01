//@flow
'use strict'

import Relay from 'react-relay'
import moment from 'moment'

class ViewerQueryConfig extends Relay.Route {
  static routeName = 'ViewerQueryConfig'
  static queries = {
    viewer: () => Relay.QL`
      query Query {
        viewer
      }
    `
  }
}

function getCacheTime (): string {
  const today = moment()
  const minutes = parseInt(today.format('mm'))
  return `${today.format('YYYY-MM-DD-hh-')}${Math.floor(minutes / 30)}`
}

export {ViewerQueryConfig, getCacheTime}
