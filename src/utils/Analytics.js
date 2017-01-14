'use strict'

import {GoogleAnalyticsTracker} from 'react-native-google-analytics-bridge'
import config from '../../data/config'

function reportScreenView (screenView) {
  const tracker = new GoogleAnalyticsTracker(config.analyticsCode)
  tracker.trackScreenView(screenView)
}

function reportEvent (category, action) {
  const tracker = new GoogleAnalyticsTracker(config.analyticsCode)
  tracker.trackEvent(category, action);
}

export {
  reportScreenView,
  reportEvent
}