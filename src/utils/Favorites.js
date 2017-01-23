'use strict'

import Storage from 'react-native-key-value-store'

const FAVORITE_THEATERS_KEY = 'FavoriteTheaters'

async function getFavoriteTheaters (callback) {
  try {
    let favorites = await Storage.get(FAVORITE_THEATERS_KEY, {})
    if (favorites == null) {
      favorites = {}
      await Storage.set(FAVORITE_THEATERS_KEY, favorites)
    }
    callback(true, favorites)
  }
  catch(e) {
    console.log('caught error', e);
    callback(false, null)
  }
}

async function toggleFavoriteTheater (theater, callback) {
  try{
      let favorites = await Storage.get(FAVORITE_THEATERS_KEY, {})
      if (favorites == null) {
        await Storage.set(FAVORITE_THEATERS_KEY, {})
      }
      const key = `${theater.theater_id}`
      const isFavorite = Object.keys(favorites).includes(key)
      if (isFavorite === true) {
        delete favorites[theater.theater_id]
      }
      else {
        favorites[key] = theater
      }
      await Storage.set(FAVORITE_THEATERS_KEY, favorites)
      callback(true)
  }
  catch(e){
      console.log('caught error', e)
      // Handle exceptions
      callback(false)
  }
}

async function isFavoriteTheater (theater, callback) {
  try{
      let favorites = await Storage.get(FAVORITE_THEATERS_KEY, {})
      if (favorites == null) {
        await Storage.set(FAVORITE_THEATERS_KEY, {})
      }
      const key = `${theater.theater_id}`
      const isFavorite = Object.keys(favorites).includes(key)
      callback(true, isFavorite)
  }
  catch(e){
      console.log('caught error', e)
      // Handle exceptions
      callback(false, false)
  }
}

function isValidTheater (theater) {
  return
    theater.theater_id && typeof theater.theater_id === 'number' &&
    theater.cinema_id && typeof theater.cinema_id === 'number' && 
    theater.name && typeof theater.name === 'string'
}

function cleanFavorites (favorites) {
  const keys = Object.keys(favorites)
  for (let indx = keys.length - 1; indx >= 0; indx--) {
    if (typeof key !== 'number' && !isValidTheater(favorites[keys[indx]])) {
      delete favorites[key]
    }
  }
}

export {
  getFavoriteTheaters,
  toggleFavoriteTheater,
  isFavoriteTheater
}