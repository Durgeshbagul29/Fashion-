/**
 * Globe Hunter - Analytics and GTM Tracking
 * Push custom engagement events for Google Tag Manager (GTM-W6MGT7J9)
 */
window.GH_ANALYTICS = {
  track(eventName, params = {}) {
    try {
      window.dataLayer = window.dataLayer || [];
      const payload = {
        event: eventName,
        game: 'globe_hunter',
        timestamp: new Date().toISOString(),
        ...params
      };
      window.dataLayer.push(payload);
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
      }
      // Debug log in dev mode if requested
      if (window.location.search.includes('debug=1')) {
        console.log('[GH_ANALYTICS]', eventName, payload);
      }
    } catch (e) {
      console.warn('Analytics push error:', e);
    }
  },

  pageView() {
    this.track('globe_hunter_pageview', { page_title: 'AbracaDabra Globe Hunter' });
  },

  modeSelected(mode) {
    this.track('globe_mode_selected', { mode });
  },

  countrySelected(country) {
    this.track('globe_country_guessed', {
      country_name: country.name,
      iso2: country.iso2
    });
  },

  spinStarted(mode) {
    this.track('globe_spin_started', { mode });
  },

  spinStopped(targetCountry, guessCountry, isWin) {
    this.track('globe_spin_stopped', {
      target_country: targetCountry.name,
      guess_country: guessCountry ? guessCountry.name : null,
      is_win: isWin
    });
  },

  locationLocked(coords, detectedCountry) {
    this.track('globe_location_locked', {
      lat: coords.lat,
      lng: coords.lng,
      detected_country: detectedCountry ? detectedCountry.name : 'Ocean'
    });
  },

  couponClaimed(code, discount) {
    this.track('globe_coupon_claimed', {
      coupon_code: code,
      discount_percentage: discount
    });
  }
};
