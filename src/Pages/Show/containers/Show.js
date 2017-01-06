// @flow
'use strict'

import React from 'react'
import {Image, StyleSheet, View, ScrollView} from 'react-native'

import ShowData from '../components/ShowData'
import ShowImagesRow from '../components/ShowImagesRow'
import ShowCastRow from '../components/ShowCastRow'
import ShowVideosRow from '../components/ShowVideosRow'

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
            <ShowImagesRow
              images={show.images}
              onPushRoute={this.props.onPushRoute}
            />
            <ShowCastRow
              cast={show.cast}
            />
            <ShowVideosRow
              videos={show.videos}
            />
          </ScrollView>
        </View>
      </Image>
    )
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
