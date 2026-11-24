/**
 * Globe Hunter - Product Integration Module
 * Maps detected countries to existing styles and products from window.PRODUCTS / P
 */
window.GH_PRODUCTS = {
  /**
   * Matches catalog products with country aesthetics.
   * If country has specific tags (like kurti, hoodie, printed, oversized), filters accordingly.
   * Always falls back safely to top rated items from existing catalog.
   */
  getRecommendationsForCountry(country, limit = 4) {
    const catalog = (typeof window !== 'undefined' && window.PRODUCTS && window.PRODUCTS.length > 0)
      ? window.PRODUCTS
      : (typeof P !== 'undefined' && P.length > 0 ? P : []);

    if (!catalog || catalog.length === 0) return [];

    if (!country || !country.tags || country.tags.length === 0) {
      return catalog.slice(0, limit);
    }

    const tags = country.tags.map(t => t.toLowerCase());

    // Score products based on country vibe
    const scored = catalog.map(p => {
      let score = 0;
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const type = (p.type || '').toLowerCase();
      const cat = (p.cat || '').toLowerCase();

      tags.forEach(tag => {
        if (name.includes(tag)) score += 3;
        if (type.includes(tag)) score += 3;
        if (desc.includes(tag)) score += 1;
        if (cat.includes(tag)) score += 2;
      });

      // Special style affinities
      if (country.iso2 === 'IN' && (cat === 'kurtis' || type.includes('kurti') || name.includes('printed'))) score += 5;
      if (['US', 'CA', 'GB', 'NO', 'CH'].includes(country.iso2) && (cat === 'hoodies' || type.includes('hoodie'))) score += 5;
      if (['JP', 'KR'].includes(country.iso2) && (name.includes('graphic') || desc.includes('streetwear'))) score += 4;
      if (['FR', 'IT'].includes(country.iso2) && (name.includes('cotton') || desc.includes('classic'))) score += 3;

      return { product: p, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const picks = scored.slice(0, limit).map(s => s.product);

    if (picks.length < limit) {
      for (const p of catalog) {
        if (!picks.some(item => item.id === p.id)) {
          picks.push(p);
          if (picks.length >= limit) break;
        }
      }
    }

    return picks;
  },

  /**
   * Renders the product card markup adapted for Globe Hunter Light Theme
   */
  renderCard(p) {
    const d = Math.round(100 - (p.price / p.mrp) * 100);
    const defColor = (p.colors && p.colors[0]) || null;
    let rawImg = (defColor && defColor.images && defColor.images[0]) || (p.images && p.images[0]) || 'assets/nkb-tshirt-002-1.webp';
    if (!rawImg.startsWith('../') && !rawImg.startsWith('http')) {
      rawImg = '../' + rawImg;
    }
    const inrVal = '₹' + Number(p.price).toLocaleString('en-IN');
    const mrpVal = '₹' + Number(p.mrp).toLocaleString('en-IN');

    return `
      <article class="card gh-rec-card" style="background:#FFFFFF;border:1px solid #E8E2D4;border-radius:12px;padding:10px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.03)">
        <a href="../product.html?id=${p.id}" class="card-media" style="display:block;border-radius:8px;overflow:hidden;background:#F8F6F1;aspect-ratio:3/4;margin-bottom:8px">
          <img src="${rawImg}" alt="${p.name}" class="card-img" loading="lazy" style="width:100%;height:100%;object-fit:cover">
        </a>
        <h3 style="font-size:0.86rem;font-weight:600;color:#172033;margin:4px 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${p.name}">${p.name}</h3>
        <small style="font-size:0.75rem;color:#64748B;display:block;margin-bottom:6px">${p.type}</small>
        <div class="pr" style="display:flex;align-items:baseline;justify-content:center;gap:6px;font-size:0.86rem;margin-bottom:8px">
          <b style="color:#0F766E">${inrVal}</b>
          <s style="color:#94A3B8;font-size:0.75rem">${mrpVal}</s>
          <em style="color:#059669;font-size:0.72rem;font-style:normal;font-weight:700">${d}% OFF</em>
        </div>
        <div style="display:flex;gap:6px">
          <a class="btn" href="../product.html?id=${p.id}" style="flex:1;padding:6px;font-size:0.74rem;background:#F8F6F1;color:#172033;border:1px solid #E8E2D4;border-radius:6px;font-weight:600;text-align:center">VIEW</a>
          <button class="btn" data-a="${p.id}" style="flex:1;padding:6px;font-size:0.74rem;background:#0F766E;color:#FFFFFF;border:none;border-radius:6px;font-weight:600;cursor:pointer">ADD</button>
        </div>
      </article>
    `;
  }
};
