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
import {getShowShowtimesRoute} from '../../../../data/routes'
import {getFavoriteTheaters} from '../../../utils/Favorites'

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

type Props = {
  setDrawerLockMode: (value: bool) =>  void,
  hasFunctions: bool
}
type State = {
  refreshing: bool
}
type Theater = {
  theater_id: number,
  cinema_id: number,
  name: string
}

export default class Show extends React.Component {
  static propTypes: Props
  static defaultProps = {
    hasFunctions: false
  }
  state = {
    refreshing: false
  }

  componentDidUpdate (prevProps: Props, prevState: State) {
    if (this.props.hasFunctions) {
      if (prevProps.viewer == null && this.props.viewer != null) {
        this._updateRightComponent()
      }
    }
  }

  render () {
    const {viewer} = this.props
    if (viewer == null) {
      return <View style={{flex: 1, backgroundColor: 'black'}} />
    }
    const show = viewer ? viewer.show : null
    if (show) {
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
    return null
  }

  _onRefresh(): void {
    this.setState({refreshing: true})
    this.props.relay.forceFetch(null, (readyState) => {
      if (readyState.done) {
        this.setState({refreshing: false})
      }
    })
  }

  _getImages (): ?Array<Object> {
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

  _getCast (): ?Array<Object> {
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

  _getVideos (): ?Array<Object> {
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

  _updateRightComponent (): void {
    const header = this.props.getHeader()
    if (header) {
      header.rightComp.setup({
        image: require('../../../../assets/Heart.png'),
        onPress: this._onRightAction.bind(this)
      })
    }
  }

  _onRightAction (): void {
    getFavoriteTheaters((result: boolean, favorites: {[id: number]: Theater}) => {
      if (result === true) {
        const {viewer} = this.props
        if (viewer && viewer.show) {
          const theaterIds = Object.keys(favorites).map(t_id =>
            favorites[parseInt(t_id)].theater_id
          ).join(',')
          this.props.onPushRoute(getShowShowtimesRoute({
            title: viewer.show.name,
            theaterIds: theaterIds,
            showId: viewer.show.show_id
          }))
        }
      }
    })
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
