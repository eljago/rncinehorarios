// @flow
'use strict'

import _ from 'lodash'

function getImageVersion (imagePath, prefix = '') {
  var pathArray = imagePath.split('/')
  var imgName = pathArray[pathArray.length - 1]
  prefix = _.isEmpty(prefix) ? '' : `${prefix}_`
  pathArray[pathArray.length - 1] = `${prefix}${imgName}`
  return `https://cinehorarios.cl${pathArray.join('/')}`
}

export {getImageVersion}
