'use strict';

function getImageVersion(imagePath, prefix = '') {
  var pathArray = imagePath.split('/');
  var imgName = pathArray[pathArray.length - 1];
  pathArray[pathArray.length - 1] = `${prefix}_${imgName}`
  return `https://cinehorarios.cl${pathArray.join('/')}`;
}


export {getImageVersion};
