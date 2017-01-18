// @flow
'use strict'

import React, {PropTypes} from 'react'
import {
  Image,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Platform
} from 'react-native'

import ShowData from '../components/ShowData'
import ShowImagesRow from '../components/ShowImagesRow'
import ShowCastRow from '../components/ShowCastRow'
import ShowVideosRow from '../components/ShowVideosRow'
import MediaRowWithTitle from '../components/MediaRowWithTitle'
import ScoresViews from '../components/ScoresViews'

import {getImageVersion} from '../../../utils/ImageHelper'

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

export default class Show extends React.Component {
  static propTypes = {
    setDrawerLockMode: PropTypes.func.isRequired
  };
  state = {
    refreshing: false
  }

  render () {
    const show = this.props.viewer.show
    return (
      <View
        style={styles.container}
      >
        <Image
          style={styles.imageContainer}
          source={{uri: getImageVersion(show.cover)}}
          resizeMode='cover'
        >
          <View style={styles.imageContent}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContainer}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />
              }
            >
              <ShowData
                showInformation={show.information}
                showDuration={show.duration}
                showDebut={show.debut}
                showGenres={show.genres}
                showRating={show.rating}
              />
              <ScoresViews
                imdbCode={show.imdb_code}
                imdbScore={show.imdb_score}
                metacriticUrl={show.metacritic_url}
                metacriticScore={show.metacritic_score}
                rottenTomatoesUrl={show.rotten_tomatoes_url}
                rottenTomatoesScore={show.rotten_tomatoes_score}
              />
              {this._getImages()}
              {this._getCast()}
              {this._getVideos()}
            </ScrollView>
          </View>
        </Image>
      </View>
    )
  }

  _onRefresh() {
    this.setState({refreshing: true})
    this.props.relay.forceFetch(null, (readyState) => {
      if (readyState.done) {
        this.setState({refreshing: false})
      }
    })
  }

  _getImages () {
    const {images} = this.props.viewer.show
    if (images.length > 0) {
      return (
        <MediaRowWithTitle title='Imágenes: '>
          <ShowImagesRow images={images} setDrawerLockMode={this.props.setDrawerLockMode} />
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
          <ShowCastRow cast={cast} setDrawerLockMode={this.props.setDrawerLockMode} />
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
          <ShowVideosRow videos={videos} setDrawerLockMode={this.props.setDrawerLockMode} />
        </MediaRowWithTitle>
      )
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    marginTop: -(APPBAR_HEIGHT + STATUSBAR_HEIGHT)
  },
  imageContainer: {
    flex: 1
  },
  imageContent: {
    flex: 1,
    backgroundColor: 'rgba(1,1,1,0.85)'
  },
  scrollViewContainer: {
    paddingTop: APPBAR_HEIGHT + STATUSBAR_HEIGHT
  }
})
