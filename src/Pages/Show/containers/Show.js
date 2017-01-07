// @flow
'use strict'

import React from 'react'
import {Image, StyleSheet, View, ScrollView} from 'react-native'

import ShowData from '../components/ShowData'
import ShowImagesRow from '../components/ShowImagesRow'
import ShowCastRow from '../components/ShowCastRow'
import ShowVideosRow from '../components/ShowVideosRow'
import MediaRowWithTitle from '../components/MediaRowWithTitle'

import {getImageVersion} from '../../../utils/ImageHelper'

export default class Show extends React.Component {

  render () {
    const show = this.props.viewer.show
    return (
      <Image
        style={styles.imageContainer}
        source={{uri: getImageVersion(show.cover)}}
        resizeMode='cover'
      >
        <View style={styles.imageContent}>
          <ScrollView>
            <ShowData
              showInformation={show.information}
              showDuration={show.duration}
              showDebut={show.debut}
              showGenres={show.genres}
            />
            {this._getImages()}
            {this._getCast()}
            {this._getVideos()}
          </ScrollView>
        </View>
      </Image>
    )
  }

  _getImages () {
    const {images} = this.props.viewer.show
    if (images.length > 0) {
      return (
        <MediaRowWithTitle title='Imágenes: '>
          <ShowImagesRow
            images={images}
            onPushRoute={this.props.onPushRoute}
          />
        </MediaRowWithTitle>
      )
    }
    return null;
  }

  _getCast () {
    const {cast} = this.props.viewer.show
    if (cast.length > 0) {
      return (
        <MediaRowWithTitle title='Elenco: '>
          <ShowCastRow cast={cast} />
        </MediaRowWithTitle>
      )
    }
    return null;
  }

  _getVideos () {
    const {videos} = this.props.viewer.show
    if (videos.length > 0) {
      return (
        <MediaRowWithTitle title='Videos: '>
          <ShowVideosRow videos={videos} />
        </MediaRowWithTitle>
      )
    }
    return null;
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1
  },
  imageContent: {
    flex: 1,
    backgroundColor: 'rgba(1,1,1,0.85)'
  }
})
