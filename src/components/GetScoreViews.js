'use strict';

import React from 'react';
import {StyleSheet, Text} from 'react-native';
import ScoreButton from './ScoreButton';

const getColor = (n) => {
  // return 'white';
  if (isNaN(n) || n == null || typeof n === 'undefined' || n === '?' || n == 0) return 'black';
  return n > 60 ? '#57BD29' : (n < 40 ? '#CF1F02' : '#D2A726');
}

const getImdbView = (imdb_code, imdb_score) => {
  const color = getColor(imdb_score * 10)
  imdb_score = imdb_score > 0 ? `${imdb_score/10}${(imdb_score/10).toString().length == 1 ? '.0' : ''}` : '?';
  if (typeof imdb_code == 'string' && imdb_code.length > 0) {
    return(
      <ScoreButton
        key='imdb'
        source={require('../../assets/LogoImdb.png')}
        text={imdb_score}
        color={color}
      />
    );
  }
  return null;
}

const getRottenTomatoesView = (rotten_tomatoes_url, rotten_tomatoes_score) => {
  const color = getColor(rotten_tomatoes_score)
  rotten_tomatoes_score = rotten_tomatoes_score > 0 ? `${rotten_tomatoes_score} %` : '?';
  if (typeof rotten_tomatoes_url == 'string' && rotten_tomatoes_url.length > 0) {
    return(
      <ScoreButton
        key='rotten_tomatoes'
        source={require('../../assets/LogoRotten.png')}
        text={rotten_tomatoes_score}
        color={color}
      />
    );
  }
  return null;
}

const getMetacriticView = (metacritic_url, metacritic_score) => {
  const color = getColor(metacritic_score)
  metacritic_score = metacritic_score > 0 ? `${metacritic_score}` : '?';
  if (typeof metacritic_url == 'string' && metacritic_url.length > 0) {
    return(
      <ScoreButton
        key='metacritic'
        source={require('../../assets/LogoMetacritic.png')}
        text={metacritic_score}
        color={color}
      />
    );
  }
  return null;
}

export {getImdbView, getRottenTomatoesView, getMetacriticView};