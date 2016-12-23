'use strict'

import React from 'react'
import ScoreButton from './ScoreButton'

const getColor = (n) => {
  // return 'white';
  if (isNaN(n) || n == null || typeof n === 'undefined' || n === '?' || n === 0) return 'black'
  return n > 60 ? '#57BD29' : (n < 40 ? '#CF1F02' : '#D2A726')
}

const getImdbView = (imdbCode, imdbScore) => {
  const color = getColor(imdbScore * 10)
  imdbScore = imdbScore > 0 ? `${imdbScore / 10}${(imdbScore / 10).toString().length === 1 ? '.0' : ''}` : '?'
  if (typeof imdbCode === 'string' && imdbCode.length > 0) {
    return (
      <ScoreButton
        key='imdb'
        source={require('../../../../assets/LogoImdb.png')}
        text={imdbScore}
        color={color}
      />
    )
  }
  return null
}

const getRottenTomatoesView = (rottenTomatoesUrl, rottenTomatoesScore) => {
  const color = getColor(rottenTomatoesScore)
  rottenTomatoesScore = rottenTomatoesScore > 0 ? `${rottenTomatoesScore} %` : '?'
  if (typeof rottenTomatoesUrl === 'string' && rottenTomatoesUrl.length > 0) {
    return (
      <ScoreButton
        key='rotten_tomatoes'
        source={require('../../../../assets/LogoRotten.png')}
        text={rottenTomatoesScore}
        color={color}
      />
    )
  }
  return null
}

const getMetacriticView = (metacriticUrl, metacriticScore) => {
  const color = getColor(metacriticScore)
  metacriticScore = metacriticScore > 0 ? `${metacriticScore}` : '?'
  if (typeof metacriticUrl === 'string' && metacriticUrl.length > 0) {
    return (
      <ScoreButton
        key='metacritic'
        source={require('../../../../assets/LogoMetacritic.png')}
        text={metacriticScore}
        color={color}
      />
    )
  }
  return null
}

export {getImdbView, getRottenTomatoesView, getMetacriticView}
