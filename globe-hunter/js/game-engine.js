/**
 * Globe Hunter - Redesigned Game Engine
 * Manages game modes, independent pre-committed destination logic,
 * separate winning and losing dialogs, accessible dismissal, and reward banner states.
 */
window.GH_ENGINE = {
  state: {
    mode: 'lucky', // 'lucky' or 'explore'
    guessCountry: null,
    committedTarget: null,
    sessionId: null,
    isPlaying: false,
    hasSpun: false,
    bannerState: 'NOT_PLAYED'
  },

  init() {
    this.initSession();
    this.bindEvents();
    this.setupAutocomplete();
    this.updateActiveRewardBanner();

    if (window.GH_ANALYTICS) {
      window.GH_ANALYTICS.pageView();
    }
  },

  initSession() {
    this.state.sessionId = 'GH_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    // Pre-commit the Lucky Spin destination independently before spin or stop is pressed
    const randomCountry = window.GH_COUNTRY_DATA.getRandomCountry();
    this.state.committedTarget = randomCountry;
    try {
      sessionStorage.setItem('gh_committed_target', JSON.stringify({
        sessionId: this.state.sessionId,
        targetCode: randomCountry.iso2,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Session error:', e);
    }
  },

  bindEvents() {
    // Mode switcher buttons
    const luckyModeBtn = document.getElementById('gh-mode-lucky');
    const exploreModeBtn = document.getElementById('gh-mode-explore');

    if (luckyModeBtn && exploreModeBtn) {
      luckyModeBtn.addEventListener('click', () => this.switchMode('lucky'));
      exploreModeBtn.addEventListener('click', () => this.switchMode('explore'));
    }

    // Controls
    const spinBtn = document.getElementById('gh-btn-spin');
    const stopBtn = document.getElementById('gh-btn-stop');
    const lockBtn = document.getElementById('gh-btn-lock');

    if (spinBtn) spinBtn.addEventListener('click', () => this.startSpin());
    if (stopBtn) stopBtn.addEventListener('click', () => this.stopSpin());
    if (lockBtn) lockBtn.addEventListener('click', () => this.lockExploreLocation());

    // Modal action buttons (NO X close icon!)
    const copyBtn = document.getElementById('gh-copy-code-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyRewardCode());
    }

    const applyBtn = document.getElementById('gh-apply-cart-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        if (window.GH_REWARDS) {
          window.GH_REWARDS.applyCouponToCart();
          window.location.href = '../cart.html';
        }
      });
    }

    // Try again / Play another round buttons
    const winPlayAgain = document.getElementById('gh-win-play-again');
    const loseTryAgain = document.getElementById('gh-lose-try-again');
    if (winPlayAgain) winPlayAgain.addEventListener('click', () => this.resetGame());
    if (loseTryAgain) loseTryAgain.addEventListener('click', () => this.resetGame());

    // Accessible Dismissal using Escape Key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModals();
      }
    });

    // Real-time HUD coordinate & country under the active location pin
    window.onGlobeRotated = (coords) => {
      const hudCoords = document.getElementById('gh-hud-coords');
      if (hudCoords && window.GH_DETECTION) {
        const detection = window.GH_DETECTION.detect(coords.lat, coords.lng);
        const latStr = `${Math.abs(coords.lat).toFixed(1)}° ${coords.lat >= 0 ? 'N' : 'S'}`;
        const lngStr = `${Math.abs(coords.lng).toFixed(1)}° ${coords.lng >= 0 ? 'E' : 'W'}`;
        if (detection && detection.country) {
          hudCoords.innerHTML = `📍 <b>${detection.country.flag} ${detection.country.name}</b> (${latStr}, ${lngStr})`;
        } else {
          hudCoords.innerHTML = `📍 <span>🌊 Open Ocean</span> (${latStr}, ${lngStr})`;
        }
      }
    };
  },

  setupAutocomplete() {
    const input = document.getElementById('gh-country-input');
    const dropdown = document.getElementById('gh-country-dropdown');
    const selectedBadge = document.getElementById('gh-selected-badge');

    if (!input || !dropdown) return;

    input.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      if (!q) {
        dropdown.classList.remove('open');
        dropdown.innerHTML = '';
        return;
      }

      const matches = window.GH_COUNTRY_DATA.search(q, 6);
      if (matches.length === 0) {
        dropdown.innerHTML = `<div class="gh-dropdown-empty">No country matches "${q}"</div>`;
        dropdown.classList.add('open');
        return;
      }

      dropdown.innerHTML = matches.map(c => `
        <div class="gh-dropdown-item" data-code="${c.iso2}">
          <span class="gh-drop-flag">${c.flag}</span>
          <span class="gh-drop-name">${c.name}</span>
          <span class="gh-drop-continent">${c.continent}</span>
        </div>
      `).join('');

      dropdown.classList.add('open');

      dropdown.querySelectorAll('.gh-dropdown-item').forEach(el => {
        el.addEventListener('click', () => {
          const code = el.dataset.code;
          const country = window.GH_COUNTRY_DATA.getCountryByCode(code);
          this.selectGuessCountry(country);
          dropdown.classList.remove('open');
          input.value = '';
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  },

  selectGuessCountry(country) {
    this.state.guessCountry = country;
    this.state.bannerState = 'IN_PROGRESS';
    this.updateActiveRewardBanner();

    // Smoothly pan globe and show active location pin
    if (window.GH_GLOBE && country) {
      window.GH_GLOBE.spinToCountry(country, () => {
        window.GH_GLOBE.showLocationPin(country.lat, country.lng);
        if (typeof window.onGlobeRotated === 'function') {
          window.onGlobeRotated({ lat: country.lat, lng: country.lng });
        }
      });
    }

    const badge = document.getElementById('gh-selected-badge');
    const spinBtn = document.getElementById('gh-btn-spin');
    const lockBtn = document.getElementById('gh-btn-lock');

    if (badge) {
      badge.innerHTML = `
        <span class="gh-badge-flag">${country.flag}</span>
        <span class="gh-badge-name">${country.name}</span>
        <button class="gh-badge-clear" aria-label="Clear selection">✕</button>
      `;
      badge.style.display = 'inline-flex';

      badge.querySelector('.gh-badge-clear').onclick = () => {
        this.state.guessCountry = null;
        this.state.bannerState = 'NOT_PLAYED';
        badge.style.display = 'none';
        if (spinBtn) spinBtn.disabled = true;
        if (lockBtn) lockBtn.disabled = true;
        this.updateActiveRewardBanner();
      };
    }

    if (spinBtn) spinBtn.disabled = false;
    if (lockBtn) lockBtn.disabled = false;

    if (window.GH_ANALYTICS) {
      window.GH_ANALYTICS.countrySelected(country);
    }
  },

  switchMode(mode) {
    this.state.mode = mode;
    const luckyBtn = document.getElementById('gh-mode-lucky');
    const exploreBtn = document.getElementById('gh-mode-explore');
    const luckyControls = document.getElementById('gh-controls-lucky');
    const exploreControls = document.getElementById('gh-controls-explore');

    if (mode === 'lucky') {
      luckyBtn.classList.add('active');
      exploreBtn.classList.remove('active');
      luckyControls.style.display = 'flex';
      exploreControls.style.display = 'none';
    } else {
      exploreBtn.classList.add('active');
      luckyBtn.classList.remove('active');
      exploreControls.style.display = 'flex';
      luckyControls.style.display = 'none';
    }

    if (window.GH_ANALYTICS) {
      window.GH_ANALYTICS.modeSelected(mode);
    }
  },

  startSpin() {
    if (!this.state.guessCountry) {
      alert('Please select your guessed country first!');
      return;
    }

    this.state.isPlaying = true;
    this.state.hasSpun = true;
    this.state.bannerState = 'IN_PROGRESS';
    this.updateActiveRewardBanner();

    const spinBtn = document.getElementById('gh-btn-spin');
    const stopBtn = document.getElementById('gh-btn-stop');
    if (spinBtn) spinBtn.style.display = 'none';
    if (stopBtn) {
      stopBtn.style.display = 'inline-flex';
      stopBtn.disabled = false;
      stopBtn.textContent = 'STOP';
    }

    window.GH_GLOBE.startFastSpin();

    if (window.GH_ANALYTICS) {
      window.GH_ANALYTICS.spinStarted('lucky');
    }
  },

  stopSpin() {
    const stopBtn = document.getElementById('gh-btn-stop');
    if (stopBtn) {
      stopBtn.disabled = true;
      stopBtn.textContent = 'Decelerating...';
    }

    // The destination was pre-committed independently before STOP action
    const targetCountry = this.state.committedTarget || window.GH_COUNTRY_DATA.getRandomCountry();

    window.GH_GLOBE.stopSpinDecelerate(targetCountry, () => {
      this.evaluateResult(targetCountry);
    });
  },

  lockExploreLocation() {
    if (!this.state.guessCountry) {
      alert('Please select your guessed country first!');
      return;
    }

    const coords = (window.GH_GLOBE && typeof window.GH_GLOBE.getPinCoords === 'function') 
      ? window.GH_GLOBE.getPinCoords() 
      : window.GH_GLOBE.getCurrentCenterCoords();
    const detection = window.GH_DETECTION.detect(coords.lat, coords.lng);

    // If point is in the ocean, prompt customer to select land
    if (detection.isOcean || !detection.country) {
      if (typeof window.toast === 'function') {
        window.toast("Please select a location on land to complete your challenge.");
      } else {
        alert("Please select a location on land to complete your challenge.");
      }
      return;
    }

    const landedCountry = detection.country;

    // Attach single accurate location pin
    window.GH_GLOBE.showLocationPin(coords.lat, coords.lng);

    if (window.GH_ANALYTICS) {
      window.GH_ANALYTICS.locationLocked(coords, landedCountry);
    }

    this.evaluateResult(landedCountry);
  },

  evaluateResult(landedCountry) {
    const guess = this.state.guessCountry;
    // Strict ISO-2 equality verification
    const isWin = (guess && landedCountry && (guess.iso2.toUpperCase() === landedCountry.iso2.toUpperCase()));

    if (isWin) {
      // Generate actual verified winning 20% coupon
      const coupon = window.GH_REWARDS.generateCoupon(true, this.state.mode, landedCountry);
      this.state.bannerState = 'WINNING_MATCH';
      this.updateActiveRewardBanner();

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      this.showWinningModal(guess, landedCountry, coupon);
    } else {
      // MISMATCH: strictly do not generate a winning coupon
      this.state.bannerState = 'MISMATCH';
      this.updateActiveRewardBanner();
      this.showLosingModal(guess, landedCountry);
    }

    if (window.GH_ANALYTICS) {
      window.GH_ANALYTICS.spinStopped(landedCountry, guess, isWin);
    }
  },

  showWinningModal(guess, landed, coupon) {
    this.closeModals();
    const winModal = document.getElementById('gh-win-modal');
    if (!winModal) return;

    document.getElementById('gh-win-guess').innerHTML = `${guess.flag} ${guess.name}`;
    document.getElementById('gh-win-landed').innerHTML = `${landed.flag} ${landed.name}`;
    document.getElementById('gh-win-code').textContent = coupon.code;
    document.getElementById('gh-win-minorder').textContent = `₹${coupon.minOrder}`;

    // Render Product Recommendations
    this.renderRecommendations(landed, 'gh-win-rec-grid');

    winModal.classList.add('open');
  },

  showLosingModal(guess, landed) {
    this.closeModals();
    const loseModal = document.getElementById('gh-lose-modal');
    if (!loseModal) return;

    document.getElementById('gh-lose-guess').innerHTML = `${guess ? guess.flag : ''} ${guess ? guess.name : 'None'}`;
    document.getElementById('gh-lose-landed').innerHTML = `${landed ? landed.flag : ''} ${landed ? landed.name : 'Unknown'}`;

    // Render Product Recommendations
    this.renderRecommendations(landed, 'gh-lose-rec-grid');

    loseModal.classList.add('open');
  },

  closeModals() {
    const winModal = document.getElementById('gh-win-modal');
    const loseModal = document.getElementById('gh-lose-modal');
    if (winModal) winModal.classList.remove('open');
    if (loseModal) loseModal.classList.remove('open');
  },

  renderRecommendations(country, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !window.GH_PRODUCTS) return;

    const products = window.GH_PRODUCTS.getRecommendationsForCountry(country, 4);
    container.innerHTML = products.map(p => window.GH_PRODUCTS.renderCard(p)).join('');

    if (typeof window.bind === 'function') {
      window.bind(container);
    }
  },

  copyRewardCode() {
    const codeEl = document.getElementById('gh-win-code');
    const copyBtn = document.getElementById('gh-copy-code-btn');
    if (!codeEl) return;

    const text = codeEl.textContent.trim();
    navigator.clipboard.writeText(text).then(() => {
      if (copyBtn) {
        copyBtn.textContent = 'Copied! ✓';
        setTimeout(() => { copyBtn.textContent = 'Copy Code'; }, 2000);
      }
      if (typeof window.toast === 'function') {
        window.toast(`Reward Code "${text}" copied!`);
      }
    });
  },

  updateActiveRewardBanner() {
    const banner = document.getElementById('gh-active-reward-banner');
    if (!banner) return;

    const activeData = window.GH_REWARDS.getActiveCoupon();

    if (activeData.state === 'WINNING_MATCH' && activeData.coupon) {
      banner.className = 'gh-active-banner state-win';
      banner.innerHTML = `
        <div class="gh-active-banner-content">
          <span>🎉 <b>Active Reward:</b> <strong style="color:var(--gh-primary);font-size:1.05rem">${activeData.coupon.code}</strong> (20% OFF on ₹${activeData.coupon.minOrder}+)</span>
          <button class="btn btn-sm btn-primary" id="gh-banner-apply-btn">Apply to Bag &amp; Checkout</button>
        </div>
      `;
      banner.style.display = 'block';

      const applyBtn = document.getElementById('gh-banner-apply-btn');
      if (applyBtn) {
        applyBtn.onclick = () => {
          window.GH_REWARDS.applyCouponToCart();
          window.location.href = '../cart.html';
        };
      }
      return;
    }

    if (activeData.state === 'EXPIRED') {
      banner.className = 'gh-active-banner state-expired';
      banner.innerHTML = `
        <div class="gh-active-banner-content">
          <span>⏰ Your reward has expired. Play again for new rewards.</span>
          <button class="btn btn-sm" onclick="window.GH_ENGINE.resetGame()">Play Again</button>
        </div>
      `;
      banner.style.display = 'block';
      return;
    }

    if (this.state.bannerState === 'IN_PROGRESS') {
      banner.className = 'gh-active-banner state-progress';
      banner.innerHTML = `
        <div class="gh-active-banner-content">
          <span>🎯 Challenge in Progress: Guessed <b>${this.state.guessCountry.flag} ${this.state.guessCountry.name}</b>. Take your shot!</span>
        </div>
      `;
      banner.style.display = 'block';
      return;
    }

    if (this.state.bannerState === 'MISMATCH') {
      banner.className = 'gh-active-banner state-mismatch';
      banner.innerHTML = `
        <div class="gh-active-banner-content">
          <span>❌ Guessed country and landed location did not match. Play again to unlock 20% OFF!</span>
          <button class="btn btn-sm" onclick="window.GH_ENGINE.resetGame()">Try Again</button>
        </div>
      `;
      banner.style.display = 'block';
      return;
    }

    // Default NOT_PLAYED State
    banner.className = 'gh-active-banner state-default';
    banner.innerHTML = `
      <div class="gh-active-banner-content">
        <span>🌍 Play Globe Hunter to unlock exclusive fashion rewards up to <b>20% OFF</b>!</span>
      </div>
    `;
    banner.style.display = 'block';
  },

  resetGame() {
    this.closeModals();
    if (window.GH_GLOBE) {
      window.GH_GLOBE.clearLocationPin();
    }

    this.state.guessCountry = null;
    this.state.isPlaying = false;
    this.state.hasSpun = false;
    this.state.bannerState = 'NOT_PLAYED';

    const badge = document.getElementById('gh-selected-badge');
    if (badge) badge.style.display = 'none';

    const spinBtn = document.getElementById('gh-btn-spin');
    const stopBtn = document.getElementById('gh-btn-stop');
    if (spinBtn) {
      spinBtn.style.display = 'inline-flex';
      spinBtn.disabled = true;
    }
    if (stopBtn) {
      stopBtn.style.display = 'none';
      stopBtn.disabled = false;
      stopBtn.textContent = 'STOP';
    }

    const lockBtn = document.getElementById('gh-btn-lock');
    if (lockBtn) lockBtn.disabled = true;

    this.initSession();
    this.updateActiveRewardBanner();
  }
};
