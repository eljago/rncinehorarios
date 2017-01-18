'use strict'

import Storage from 'react-native-key-value-store'

const FAVORITE_THEATERS_KEY = 'favoriteTheaters'

async function getFavoriteTheaters (callback) {
  try {
    let favorites = await Storage.get(FAVORITE_THEATERS_KEY, [])
    if (favorites == null) {
      favorites = []
      await Storage.set(FAVORITE_THEATERS_KEY, favorites)
    }
    callback(true, favorites)
  }
  catch(e) {
    console.log('caught error', e);
    callback(false, null)
  }
}

async function addFavoriteTheater (theaterId, callback) {
  try{
      let favorites = await Storage.get(FAVORITE_THEATERS_KEY, [])
      if (favorites == null) {
        await Storage.set(FAVORITE_THEATERS_KEY, [])
      }
      const index = favorites.indexOf(theaterId);
      if (index > -1) { // REMOVE FROM FAVORITES
        favorites.splice(index, 1);
      }
      else { // ADD TO FAVORITES
        favorites.push(theaterId)
      }
      // FILTER NON-NUMBERS
      favorites = favorites.filter((theaterId) => {
        return typeof theaterId === 'number'
      })
      await Storage.set(FAVORITE_THEATERS_KEY, favorites)
      callback(true)
  }
  catch(e){
      console.log('caught error', e);
      // Handle exceptions
      callback(false)
  }
}

export {
  getFavoriteTheaters,
  addFavoriteTheater
}