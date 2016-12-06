// @flow
'use strict'

import _ from 'lodash'
import config from '../../data/config'

function getImageVersion (imagePath, prefix = '') {
  var pathArray = imagePath.split('/')
  var imgName = pathArray[pathArray.length - 1]
  prefix = _.isEmpty(prefix) ? '' : `${prefix}_`
  pathArray[pathArray.length - 1] = `${prefix}${imgName}`
  return `${config.URL}${pathArray.join('/')}`
}

export {getImageVersion}
