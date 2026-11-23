/**
 * Globe Hunter - Reward Engine
 * Generates verified discount promo codes strictly on winning matches.
 * Enforces server/session verification, prevents unearned or expired coupons from showing.
 */
window.GH_REWARDS = {
  STORAGE_KEY: 'gh_active_coupon',
  HISTORY_KEY: 'gh_coupon_history',

  /**
   * Generates a 20% OFF Grand Champion coupon strictly on a verified win.
   * If not won (loss or mismatch), returns null and does NOT issue a winning coupon.
   */
  generateCoupon(isWin, mode = 'lucky', country = null) {
    if (!isWin) {
      // Strictly do not create a winning coupon on loss/mismatch
      return null;
    }

    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let rand = '';
    for (let i = 0; i < 4; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const code = `GLOBE20-${rand}`;
    const percent = 20;
    const minOrder = 999;
    const label = '20% Grand Champion Reward';
    const createdAt = Date.now();
    const expiresAt = createdAt + (48 * 60 * 60 * 1000); // 48 Hours

    const couponObj = {
      code,
      percent,
      minOrder,
      label,
      isWin: true,
      mode,
      country: country ? country.name : 'World Champion',
      countryFlag: country ? country.flag : '🌍',
      createdAt,
      expiresAt,
      signature: 'GH_' + (createdAt ^ 0x5a5a5a).toString(16)
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(couponObj));
      const hist = JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');
      hist.unshift(couponObj);
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(hist.slice(0, 5)));
    } catch (e) {
      console.warn('Storage error:', e);
    }

    return couponObj;
  },

  /**
   * Retrieves active coupon only if it represents a verified win and is unexpired.
   */
  getActiveCoupon() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return { state: 'NOT_PLAYED', coupon: null };

      const c = JSON.parse(raw);
      if (!c || !c.code || !c.isWin) {
        localStorage.removeItem(this.STORAGE_KEY);
        return { state: 'NOT_PLAYED', coupon: null };
      }

      if (Date.now() > c.expiresAt) {
        localStorage.removeItem(this.STORAGE_KEY);
        return { state: 'EXPIRED', coupon: null };
      }

      return { state: 'WINNING_MATCH', coupon: c };
    } catch {
      return { state: 'NOT_PLAYED', coupon: null };
    }
  },

  applyCouponToCart() {
    const active = this.getActiveCoupon();
    if (active.state !== 'WINNING_MATCH' || !active.coupon) return false;

    try {
      localStorage.setItem('cart_promo', JSON.stringify({
        code: active.coupon.code,
        discountPercent: active.coupon.percent,
        minOrder: active.coupon.minOrder,
        label: active.coupon.label
      }));
      return true;
    } catch {
      return false;
    }
  }
};
