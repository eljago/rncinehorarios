'use strict'

import {Linking} from 'react-native'

const goToVideo = (videoCode) => {
  const url = `http://www.youtube.com/watch?v=${videoCode}`
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url)
    } else {
      console.log('Don\'t know how to open URI: ' + url)
    }
  })
}

export {goToVideo}