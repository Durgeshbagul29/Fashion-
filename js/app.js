const CONFIG={SCRIPT_URL:'https://script.google.com/macros/s/AKfycbzmjhjvs117NWcYjvn0GMrqVZmmYAEIY0aQgGGVzzeBXR1cTzgsCZq7ax8OiHdcTfij/exec',GA4_ID:'',SITE:'https://www.example.com',BASE_TEE:399,PRINT:{front:0,back:0,both:100},TEXT_FEE:0,SHIP:50,DELIVERY:{nashik:0,mh:50,outside:70},FREE_SHIP_OVER:1099,PAY:['UPI / QR Code Payment']};

// Products catalog is managed in js/products.js (window.PRODUCTS)
var P = (typeof window !== 'undefined' && window.PRODUCTS) ? window.PRODUCTS : (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []);

const CATS={men:'Men',women:'Women',hoodies:'Hoodies',kurtis:'Short Kurtis',custom:'Custom'};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const inr=n=>'₹'+Number(n).toLocaleString('en-IN'),q=k=>new URLSearchParams(location.search).get(k);
const ls=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){toast('Storage full — use a smaller artwork file')}};
const cart=()=>ls('cart',[]),wish=()=>ls('wish',[]);
function toast(m){
  $$('.toast').forEach(t=>t.remove());
  const t=document.createElement('div');
  t.className='toast';
  t.innerHTML=`<span style="color:var(--g)">✨</span><span>${m}</span>`;
  document.body.append(t);
  setTimeout(()=>{
    t.style.opacity='0';
    t.style.transform='translateX(30px)';
    t.style.transition='all .2s ease';
    setTimeout(()=>t.remove(),200);
  },2400);
}
function count(){
  const n = cart().reduce((a,i)=>a+i.qty,0);
  $$('.cart-count, #cc').forEach(el=>{el.textContent=n});
  const wn = wish().length;
  $$('.wish-count').forEach(el=>{el.textContent=wn});
}

window.toggleNav = function(open){
  const drawer = $('#mobile-drawer');
  const backdrop = $('#nav-backdrop');
  if(!drawer || !backdrop) return;
  if(open === undefined) open = !drawer.classList.contains('open');
  drawer.classList.toggle('open', open);
  backdrop.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
};

function highlightActiveNav(){
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const search = location.search.toLowerCase();
  const full = path + search;
  $$('.nav-links a, .drawer-links a').forEach(a=>{
    const href = (a.getAttribute('href')||'').toLowerCase();
    if(href === full || (full === 'index.html' && (href === 'index.html' || href === './'))){
      a.classList.add('active');
    }
  });
}

function card(p){
  const d=Math.round(100-p.price/p.mrp*100),w=wish().includes(p.id);
  const defColor=(p.colors&&p.colors[0])||null;
  const img=(defColor&&defColor.images&&defColor.images[0])||(p.images&&p.images[0])||'assets/nkb-tshirt-002-1.webp';
  const hasRating=(p.rating!==null&&p.rating!==undefined&&p.ratingCount!==null&&p.ratingCount!==undefined&&String(p.rating).trim()!==''&&String(p.ratingCount).trim()!=='');
  const ratingHtml=hasRating?`<div class="card-rating"><span class="star">★</span> <b>${p.rating}</b> <span class="cnt">(${p.ratingCount})</span></div>`:'';
  const swatches=(p.colors||[]).map(c=>{
    const code=(typeof c==='object'&&c.code)?c.code:c;
    const name=(typeof c==='object'&&c.name)?c.name:c;
    return `<i style="background:${code}" title="${name}"></i>`;
  }).join('');

  return `<article class="card">
    <a href="product.html?id=${p.id}" class="card-media">
      <img src="${img}" alt="${p.name}" class="card-img" loading="lazy" onerror="this.onerror=null;this.src='assets/nkb-tshirt-002-1.webp'">
    </a>
    <button class="wl" data-w="${p.id}" aria-label="Wishlist">${w?'♥':'♡'}</button>
    <div class="q">
      <a class="btn" href="product.html?id=${p.id}">QUICK VIEW</a>
      <button class="btn" data-a="${p.id}">ADD</button>
    </div>
    <h3>${p.name}</h3>
    <small>${p.type}</small>
    ${ratingHtml}
    <div class="pr"><b>${inr(p.price)}</b><s>${inr(p.mrp)}</s><em>${d}% OFF</em></div>
    <div class="sw">${swatches}</div>
  </article>`;
}

function bind(r=document){
  $$('[data-w]',r).forEach(b=>b.onclick=(e)=>{
    e.stopPropagation();
    let w=wish();
    const pid=b.dataset.w;
    const isWish=w.includes(pid);
    w=isWish?w.filter(x=>x!=pid):[...w,pid];
    sv('wish',w);
    b.textContent=!isWish?'♥':'♡';
    count();
    toast(!isWish?'Added to wishlist':'Removed from wishlist');

    // If viewing wishlist page (q('w')), immediately animate card out and update view!
    if(q('w')){
      const cardEl=b.closest('.card');
      if(cardEl){
        cardEl.style.transition='all 0.28s cubic-bezier(0.4, 0, 0.2, 1)';
        cardEl.style.opacity='0';
        cardEl.style.transform='scale(0.85)';
        setTimeout(()=>{
          if(typeof window.refreshShop==='function'){
            window.refreshShop();
          } else {
            cardEl.remove();
          }
        },280);
      } else if(typeof window.refreshShop==='function'){
        window.refreshShop();
      }
    }
  });
  $$('[data-a]',r).forEach(b=>b.onclick=()=>{
    const p=P.find(x=>x.id==b.dataset.a);
    if(p){
      const defC=(p.colors&&p.colors[0])||null;
      const cName=(defC&&defC.name)?defC.name:((defC&&defC.code)?defC.code:(defC||'Default'));
      const cImg=(defC&&defC.images&&defC.images[0])||(p.images&&p.images[0])||'assets/nkb-tshirt-002-1.webp';
      add({id:p.id,name:p.name,price:p.price,size:'M',color:cName,qty:1,h:p.h,image:cImg});
    }
  });
}

function add(i){
  const c=cart();
  const k=c.find(x=>x.id==i.id&&x.size==i.size&&x.color==i.color&&!i.custom);
  k?k.qty+=i.qty:c.push(i);
  sv('cart',c);
  count();
  toast('Added to bag');
}

const COLS=[['White','#fff'],['Black','#080808'],['Ivory','#F8F6F1'],['Red','#B8322B'],['Gold','#C69A3A']];

function layout(){
  const isSub = (typeof location !== 'undefined') && location.pathname.includes('globe-hunter');
  const rootPrefix = isSub ? '../' : '';
  const globeHref = isSub ? './' : 'globe-hunter/';

  document.body.insertAdjacentHTML('afterbegin',`<div class="ann">Discover Your Style | Custom Printing Available | Shop the Latest Collection</div>
<header class="site-header">
  <div class="wrap nav">
    <div class="nav-left">
      <button class="burger" id="burger-btn" aria-label="Open navigation menu" onclick="toggleNav(true)">
        <span></span><span></span><span></span>
      </button>
      <a class="brand-logo" href="${rootPrefix}index.html" aria-label="AbracaDabra Fashion Home">
        <img src="${rootPrefix}assets/logo.webp" alt="AbracaDabra Fashion" class="site-logo">
      </a>
    </div>
    <nav class="desktop-nav" aria-label="Main Navigation">
      <ul class="nav-links">
        <li><a href="${rootPrefix}index.html">Home</a></li>
        <li><a href="${rootPrefix}shop.html">Shop</a></li>
        <li><a href="${rootPrefix}studio.html">Custom Studio</a></li>
        <li><a href="${rootPrefix}shop.html?sort=new">New Arrivals</a></li>
        <li><a href="${rootPrefix}shop.html?w=1" class="nav-wish-link">Wishlist <span class="nav-wish-badge wish-count">0</span></a></li>
        <!-- <li><a href="${globeHref}">Globe Hunter</a></li> -->
      </ul>
    </nav>
    <div class="nav-right">
      <a class="nav-bag-btn" href="${rootPrefix}cart.html" aria-label="Shopping Bag">
        <svg class="bag-svg" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <span class="nav-bag-mobile-count cart-count">0</span>
        <span class="nav-bag-label">Bag (<span class="cart-count">0</span>)</span>
      </a>
    </div>
  </div>
</header>
<div class="nav-backdrop" id="nav-backdrop" onclick="toggleNav(false)"></div>
<aside class="mobile-drawer" id="mobile-drawer" aria-label="Mobile Navigation">
  <div class="drawer-header">
    <a href="${rootPrefix}index.html" class="drawer-logo" onclick="toggleNav(false)">
      <img src="${rootPrefix}assets/logo.webp" alt="AbracaDabra Fashion" class="drawer-logo-img">
    </a>
    <button class="drawer-close" aria-label="Close menu" onclick="toggleNav(false)">✕</button>
  </div>
  <div class="drawer-body">
    <ul class="drawer-links">
      <li><a href="${rootPrefix}index.html" onclick="toggleNav(false)"><span class="d-icon">🏠</span> Home</a></li>
      <li><a href="${rootPrefix}shop.html" onclick="toggleNav(false)"><span class="d-icon">🛍️</span> Shop</a></li>
      <li><a href="${rootPrefix}studio.html" onclick="toggleNav(false)"><span class="d-icon">🎨</span> Custom Studio</a></li>
      <li><a href="${rootPrefix}shop.html?sort=new" onclick="toggleNav(false)"><span class="d-icon">✨</span> New Arrivals</a></li>
      <li><a href="${rootPrefix}shop.html?w=1" onclick="toggleNav(false)"><span class="d-icon">♥</span> Wishlist (<span class="wish-count">0</span>)</a></li>
      <!-- <li><a href="${globeHref}" onclick="toggleNav(false)"><span class="d-icon">🌍</span> Globe Hunter</a></li> -->
      <li><a href="${rootPrefix}cart.html" class="drawer-bag-highlight" onclick="toggleNav(false)"><span class="d-icon">👜</span> Bag (<span class="cart-count">0</span>)</a></li>
    </ul>
  </div>
  <div class="drawer-footer">
    <p class="drawer-tagline">WEAR YOUR MAGIC</p>
    <a href="${rootPrefix}studio.html" class="btn gold drawer-cta" onclick="toggleNav(false)">DESIGN CUSTOM T-SHIRT</a>
  </div>
</aside>`);
  document.body.insertAdjacentHTML('beforeend',`<footer>
  <div class="footer-main wrap">
    <div class="footer-cols">
      <div class="footer-col brand-col">
        <a href="${rootPrefix}index.html" class="footer-brand" aria-label="AbracaDabra Home">
          <img src="${rootPrefix}assets/logo.webp" alt="AbracaDabra Fashion" class="footer-logo">
        </a>
        <p class="brand-desc">Fashion that speaks. Premium everyday essentials, heavyweight hoodies, short kurtis and custom printing built for your individuality.</p>
        <div class="footer-helpline-plain">
          <h5>DIRECT CUSTOMER HELPLINE</h5>
          <p class="helpline-plain-line">Call Support: <a href="tel:+917709053245" class="gold-link">+91 77090 53245</a></p>
          <p class="helpline-plain-line">WhatsApp Chat: <a href="https://wa.me/919284256635" target="_blank" rel="noopener" class="gold-link">+91 92842 56635</a></p>
        </div>
        <div class="social-links">
          <a href="https://wa.me/919284256635" target="_blank" rel="noopener" aria-label="WhatsApp" class="s-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" class="s-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook" class="s-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="mailto:support@abracadabrafashion.com" aria-label="Email Us" class="s-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Collections</h4>
        <ul class="footer-links">
          <li><a href="shop.html?c=men">Men's Collection</a></li>
          <li><a href="shop.html?c=women">Women's Collection</a></li>
          <li><a href="shop.html?c=hoodies">Premium Hoodies</a></li>
          <li><a href="shop.html?c=kurtis">Short Kurtis</a></li>
          <li><a href="studio.html">Custom Design Studio</a></li>
          <li><a href="shop.html?sort=new">New Arrivals</a></li>
          <li><a href="shop.html?sort=best">Most Loved</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Customer Care</h4>
        <ul class="footer-links">
          <li><a href="cart.html">Shopping Bag &amp; Checkout</a></li>
          <li><a href="shop.html?w=1">Wishlist</a></li>
          <li><a href="#">Track Order Status</a></li>
          <li><a href="#">Shipping &amp; Delivery Policy</a></li>
          <li><a href="#">Returns, Exchanges &amp; Refunds</a></li>
          <li><a href="#">Size &amp; Fit Guide</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact &amp; Studio</h4>
        <div class="contact-info">
          <p class="contact-line">
            <span class="c-label">Direct Calling</span>
            <a href="tel:+917709053245" class="gold-link">+91 77090 53245</a>
          </p>
          <p class="contact-line">
            <span class="c-label">WhatsApp Helpline</span>
            <a href="https://wa.me/919284256635" target="_blank" rel="noopener" class="gold-link">+91 92842 56635</a>
          </p>
          <p class="contact-line">
            <span class="c-label">Support Email</span>
            <a href="mailto:support@abracadabrafashion.com">support@abracadabra.com</a>
          </p>
          <p class="contact-line">
            <span class="c-label">Support Hours</span>
            <span>Mon – Sat: 10:00 AM – 7:00 PM</span>
          </p>
          <p class="contact-line">
            <span class="c-label">Headquarters</span>
            <span>Nashik, Maharashtra, India 🇮🇳</span>
          </p>
        </div>

      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="wrap bottom-content">
      <div class="payment-methods">
        <span class="pay-chip">UPI</span>
        <span class="pay-chip">GPay</span>
        <span class="pay-chip">PhonePe</span>
        <span class="pay-chip">Paytm</span>
        <span class="pay-chip">Fast QR Pay</span>
      </div>
      <div class="bottom-copy">
        <p>© 2026 <a href="https://abraca-dabra.com/" target="_blank" rel="noopener">AbracaDabra Software Solutions Pvt. Ltd.</a> All rights reserved.</p>
      </div>
    </div>
  </div>
</footer>
<a href="https://wa.me/919284256635" target="_blank" rel="noopener" class="floating-wa" aria-label="Chat with us on WhatsApp">
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff" stroke="#fff" stroke-width="0.3">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
  <span class="floating-wa-label">Chat on WhatsApp</span>
</a>
<button id="floating-btt" class="floating-btt" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="Back to top">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
</button>`);
  count();
  highlightActiveNav();
  window.addEventListener('scroll', () => {
    const btt = $('#floating-btt');
    if (btt) btt.classList.toggle('visible', window.scrollY > window.innerHeight);
  }, { passive: true });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') toggleNav(false);
  });
  if(CONFIG.GA4_ID){
    const s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id='+CONFIG.GA4_ID;document.head.append(s);
    window.dataLayer=[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',CONFIG.GA4_ID);
  }
}

function ld(o){const s=document.createElement('script');s.type='application/ld+json';s.textContent=JSON.stringify(o);document.head.append(s)}

const pg=document.body.dataset.p;layout();

if(pg=='home'){
  ld({'@context':'https://schema.org','@type':'Organization',name:'AbracaDabra Fashion',url:CONFIG.SITE,slogan:'Wear Your Magic'});
  ld({'@context':'https://schema.org','@type':'WebSite',name:'AbracaDabra Fashion',url:CONFIG.SITE,potentialAction:{'@type':'SearchAction',target:CONFIG.SITE+'/shop.html?s={q}','query-input':'required name=q'}});
  $('#best').innerHTML=P.slice(0,8).map(card).join('');
  bind($('#best'));
}

if(pg=='shop'){
  let st={c:q('c')||'',s:q('s')||'',sort:q('sort')||'',max:5000,col:'',size:''};

  if(st.c){
    const pill=$(`#cat-pills button[data-cat="${st.c}"]`);
    if(pill) $$('#cat-pills button').forEach(b=>b.classList.toggle('active',b===pill));
  }

  function updateHeader(){
    const h1=$('#h1');
    if(h1){
      if(q('w')) h1.textContent='My Wishlist';
      else if(st.s) h1.textContent=`Search: "${st.s}"`;
      else if(st.c) h1.textContent=(CATS[st.c]||'Collection')+' Collection';
      else h1.textContent='All Collections';
    }
  }

  function r(){
    updateHeader();
    let l=P.filter(p=>{
      if(st.c&&p.cat!==st.c) return false;
      if(p.price>st.max) return false;
      if(st.col&&!p.colors.some(c=>(typeof c==='object'?c.code:c).toLowerCase()===st.col.toLowerCase())) return false;
      if(st.size&&!p.sizes.includes(st.size)) return false;
      if(st.s){
        const query=st.s.toLowerCase().trim();
        const matchesName=p.name.toLowerCase().includes(query);
        const matchesType=p.type.toLowerCase().includes(query);
        const matchesCat=(CATS[p.cat]||'').toLowerCase().includes(query);
        const matchesDesc=(p.description||'').toLowerCase().includes(query);
        if(!matchesName&&!matchesType&&!matchesCat&&!matchesDesc) return false;
      }
      return true;
    });

    if(q('w')) l=l.filter(p=>wish().includes(p.id));

    if(st.sort==='lh') l.sort((a,b)=>a.price-b.price);
    else if(st.sort==='hl') l.sort((a,b)=>b.price-a.price);
    else if(st.sort==='new') l.reverse();
    else if(st.sort==='best') l.sort((a,b)=>b.mrp-a.mrp);

    const cnt=$('#cnt');
    if(cnt) cnt.textContent=`${l.length} ${l.length===1?'product':'products'}`;

    const list=$('#list');
    if(list){
      if(l.length>0){
        list.innerHTML=l.map(card).join('');
      } else {
        if(q('w')){
          list.innerHTML=`
            <div class="shop-empty-state">
              <span class="empty-icon" style="color:var(--r)">♥</span>
              <h3>Your Wishlist is Empty</h3>
              <p>Explore our latest styles and tap the heart icon on any product to save your favorites here!</p>
              <a class="btn gold" href="shop.html" style="display:inline-block;margin-top:12px">Explore Collection</a>
            </div>
          `;
        } else {
          list.innerHTML=`
            <div class="shop-empty-state">
              <span class="empty-icon">🔍</span>
              <h3>No products found</h3>
              <p>We couldn't find any items matching your selected search or filters.</p>
              <button class="btn gold" id="empty-reset-btn">Reset All Filters</button>
            </div>
          `;
          const resetBtn=$('#empty-reset-btn');
          if(resetBtn) resetBtn.onclick=resetAll;
        }
      }
      bind(list);
    }
    updateActiveFilterBadge();
  }

  function updateActiveFilterBadge(){
    let count=0;
    if(st.c) count++;
    if(st.s) count++;
    if(st.col) count++;
    if(st.size) count++;
    if(st.max<5000) count++;
    if(st.sort) count++;
    const badge=$('#filter-badge');
    if(badge){
      if(count>0){badge.textContent=count;badge.style.display='inline-flex'}
      else{badge.style.display='none'}
    }
  }

  function resetAll(){
    st.c='';st.s='';st.sort='';st.max=5000;st.col='';st.size='';
    const sInput=$('#search-input');if(sInput) sInput.value='';
    const sClear=$('#search-clear');if(sClear) sClear.style.display='none';
    const maxInput=$('#max');if(maxInput) maxInput.value=5000;
    const mv=$('#mv');if(mv) mv.textContent=inr(5000);
    const sortSel=$('#sort');if(sortSel) sortSel.value='';
    const mobSort=$('#mobile-sort');if(mobSort) mobSort.value='';
    $$('#cat-pills button').forEach((b,i)=>b.classList.toggle('active',i===0));
    $$('#size-pills button').forEach((b,i)=>b.classList.toggle('active',i===0));
    $$('#col-swatches button').forEach((b,i)=>b.classList.toggle('active',i===0));
    r();

  }

  const sInput=$('#search-input');
  const sClear=$('#search-clear');
  if(sInput){
    if(st.s){sInput.value=st.s;if(sClear) sClear.style.display='block'}
    sInput.oninput=e=>{
      st.s=e.target.value.trim();
      if(sClear) sClear.style.display=st.s?'block':'none';
      r();

    };
  }
  if(sClear){
    sClear.onclick=()=>{
      if(sInput) sInput.value='';
      st.s='';sClear.style.display='none';
      r();

    };
  }

  const sortSel=$('#sort');
  if(sortSel){
    sortSel.value=st.sort;
    sortSel.onchange=e=>{
      st.sort=e.target.value;
      const mobSort=$('#mobile-sort');if(mobSort) mobSort.value=st.sort;
      r();

    };
  }
  const mobSort=$('#mobile-sort');
  if(mobSort){
    mobSort.value=st.sort;
    mobSort.onchange=e=>{
      st.sort=e.target.value;
      if(sortSel) sortSel.value=st.sort;
      r();

    };
  }

  const maxInput=$('#max');
  if(maxInput){
    maxInput.oninput=e=>{
      st.max=+e.target.value;
      const mv=$('#mv');if(mv) mv.textContent=inr(st.max);
      r();

    };
  }

  $$('#cat-pills button').forEach(btn=>{
    btn.onclick=()=>{
      $$('#cat-pills button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      st.c=btn.dataset.cat||'';
      r();

    };
  });

  $$('#size-pills button').forEach(btn=>{
    btn.onclick=()=>{
      $$('#size-pills button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      st.size=btn.dataset.size||'';
      r();

    };
  });

  $$('#col-swatches button').forEach(btn=>{
    btn.onclick=()=>{
      $$('#col-swatches button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      st.col=btn.dataset.col||'';
      r();

    };
  });

  const resetBtn=$('#reset-filters');
  if(resetBtn) resetBtn.onclick=resetAll;

  const fToggle=$('#filter-toggle-btn');
  const fSidebar=$('#filters-sidebar');
  if(fToggle&&fSidebar){
    fToggle.onclick=()=>{
      fSidebar.classList.toggle('open');
      fToggle.classList.toggle('active');
    };
  }

  r();
  window.refreshShop=r;
}

if(pg=='pdp'){
  const p=P.find(x=>x.id==q('id'))||P[0];
  document.title=p.name+' | AbracaDabra Fashion';
  const metaDesc=$('meta[name=description]');
  if(metaDesc) metaDesc.content=(p.description&&p.description.trim())?p.description:`Buy ${p.name} (${p.type}) online in India from AbracaDabra Fashion. Prices from ${inr(p.price)}.`;

  let sz=(p.sizes&&p.sizes[0])||'M';
  let currentColor=(p.colors&&p.colors[0])||{name:'Standard',code:'#080808',images:(p.images||['assets/nkb-tshirt-002-1.webp'])};
  let currentImages=(currentColor.images&&currentColor.images.length)?currentColor.images:(p.images&&p.images.length?p.images:['assets/nkb-tshirt-002-1.webp']);
  let currentSlide=0;

  // 1. Product Name
  if($('#pn')) $('#pn').textContent=p.name;
  if($('#pt')) $('#pt').textContent=p.type;

  // 2. Customer rating and review count (when available, hidden if null/empty)
  const prating=$('#prating');
  const hasRatings=(p.ratings&&Array.isArray(p.ratings)&&p.ratings.length>0);
  const avgRating=p.rating||(hasRatings?(p.ratings.reduce((acc,r)=>acc+(Number(r.count)||5),0)/p.ratings.length).toFixed(1):null);
  const revCount=p.ratingCount||(hasRatings?p.ratings.length:null);
  const showRatingBadge=(hasRatings||(p.rating!==null&&p.rating!==undefined&&p.ratingCount!==null&&p.ratingCount!==undefined));

  if(prating){
    if(showRatingBadge&&avgRating){
      prating.innerHTML=`<div class="pdp-rating-badge"><span class="badge-star">★ ${avgRating}</span> <a href="#reviews" class="badge-link">${revCount||''} Ratings &amp; Reviews</a> <span class="badge-verified">✓ 100% Verified</span></div>`;
      prating.style.display='';
    } else {
      prating.innerHTML='';
      prating.style.display='none';
    }
  }

  // 3. Product price and MRP
  const pp=$('#pp');
  if(pp){
    pp.innerHTML=`<b style="font-size:26px;color:#111">${inr(p.price)}</b> <s style="font-size:16px;color:#888">${inr(p.mrp)}</s> <em style="color:var(--r);font-size:14px;font-weight:700">${Math.round(100-p.price/p.mrp*100)}% OFF</em>`;
  }

  // 4. Product description with Ideal For and Open/Closed function
  const pdesc=$('#pdesc');
  const pidealWrap=$('#pideal-wrap');
  const pidealVal=$('#pideal-val');
  const descAcc=$('#pdesc-accordion');
  const hasDesc=(p.description&&typeof p.description==='string'&&p.description.trim()!=='');
  const hasIdeal=(p.idealFor&&typeof p.idealFor==='string'&&p.idealFor.trim()!=='');

  if(hasDesc&&pdesc){
    pdesc.innerHTML=`<p>${p.description.trim()}</p>`;
  }
  if(hasIdeal&&pidealVal){
    pidealVal.textContent=p.idealFor.trim();
    if(pidealWrap) pidealWrap.style.display='inline-flex';
  } else {
    if(pidealWrap) pidealWrap.style.display='none';
  }
  if(!hasDesc&&!hasIdeal){
    if(descAcc) descAcc.style.display='none';
  } else {
    if(descAcc) descAcc.style.display='';
  }

  const descToggle=$('#pdesc-toggle');
  if(descToggle){
    descToggle.onclick=()=>{
      const acc=$('#pdesc-accordion');
      if(acc){
        const isOpen=acc.classList.toggle('active');
        const icon=$('.pdp-desc-toggle-icon',descToggle);
        if(icon) icon.textContent=isOpen?'−':'+';
        descToggle.setAttribute('aria-expanded',isOpen?'true' : 'false');
      }
    };
  }

  // 5. Colour selection
  function renderColors(){
    const coWrap=$('#co-wrap');
    if(!coWrap) return;
    if(!p.colors||!p.colors.length){
      coWrap.style.display='none';
      return;
    }
    coWrap.style.display='';
    const coName=$('#co-name');
    if(coName) coName.textContent=currentColor.name||(currentColor.code||'');

    const coEl=$('#co');
    if(coEl){
      coEl.innerHTML=p.colors.map((c,idx)=>{
        const code=(typeof c==='object'&&c.code)?c.code:c;
        const name=(typeof c==='object'&&c.name)?c.name:c;
        const isCurrent=(typeof currentColor==='object')?(c.code===currentColor.code&&c.name===currentColor.name):(c===currentColor);
        return `<button type="button" class="pdp-color-swatch-btn ${isCurrent?'on':''}" data-idx="${idx}" title="${name}" aria-label="Select colour ${name}">
          <span class="pdp-swatch-color" style="background:${code};border:1px solid ${code.toLowerCase()==='#fff'||code.toLowerCase()==='#ffffff'?'#ccc':'transparent'}"></span>
          <span class="pdp-swatch-label">${name}</span>
        </button>`;
      }).join('');

      $$('#co button').forEach(b=>{
        b.onclick=()=>{
          const idx=Number(b.dataset.idx);
          if(p.colors[idx]){
            currentColor=p.colors[idx];
            currentImages=(currentColor.images&&currentColor.images.length)?currentColor.images:(p.images||['assets/nkb-tshirt-002-1.webp']);
            currentSlide=0;
            renderColors();
            renderGallery();
          }
        };
      });
    }
  }

  // Carousel & Gallery Navigation
  function renderGallery(){
    const gal=$('#gal');
    if(!gal) return;
    const hasMultiple=currentImages.length>1;
    gal.innerHTML=`
      <div class="pdp-carousel" id="pdp-carousel">
        <div class="carousel-stage">
          ${hasMultiple?`
          <button class="carousel-nav-btn prev-btn" id="car-prev" aria-label="Previous image">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button class="carousel-nav-btn next-btn" id="car-next" aria-label="Next image">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
          <div class="carousel-counter" id="car-counter">${currentSlide+1} / ${currentImages.length}</div>
          `:''}
          <div class="carousel-slide-wrap">
            <img id="car-main-img" src="${currentImages[currentSlide]||currentImages[0]}" alt="${p.name} - ${currentColor.name||''}" class="carousel-main-img" onerror="this.onerror=null;this.src='assets/nkb-tshirt-002-1.webp'">
          </div>
        </div>
        ${hasMultiple?`
        <div class="carousel-thumbs" id="car-thumbs">
          ${currentImages.map((src,idx)=>`
            <button class="carousel-thumb-btn ${idx===currentSlide?'active':''}" data-idx="${idx}" aria-label="View thumbnail ${idx+1}">
              <img src="${src}" alt="${p.name} thumbnail ${idx+1}" onerror="this.onerror=null;this.src='assets/nkb-tshirt-002-1.webp'">
            </button>
          `).join('')}
        </div>`:''}
      </div>
    `;

    function showSlide(idx){
      if(!currentImages.length) return;
      currentSlide=(idx+currentImages.length)%currentImages.length;
      const mainImg=$('#car-main-img');
      if(mainImg){
        mainImg.style.opacity='0.35';
        mainImg.src=currentImages[currentSlide];
        mainImg.onload=()=>{mainImg.style.opacity='1';};
      }
      const counter=$('#car-counter');
      if(counter) counter.textContent=`${currentSlide+1} / ${currentImages.length}`;
      $$('.carousel-thumb-btn').forEach((b,i)=>{
        b.classList.toggle('active',i===currentSlide);
      });
    }

    const pBtn=$('#car-prev');
    const nBtn=$('#car-next');
    if(pBtn) pBtn.onclick=()=>showSlide(currentSlide-1);
    if(nBtn) nBtn.onclick=()=>showSlide(currentSlide+1);

    $$('.carousel-thumb-btn').forEach(b=>{
      b.onclick=()=>showSlide(Number(b.dataset.idx));
    });
  }

  renderColors();
  renderGallery();

  // 6. Size Selection
  const szEl=$('#sz');
  if(szEl&&p.sizes&&p.sizes.length){
    szEl.innerHTML=p.sizes.map(s=>`<button type="button" class="${s===sz?'on':''}">${s}</button>`).join('');
    $$('#sz button').forEach(b=>{
      b.onclick=()=>{
        sz=b.textContent;
        $$('#sz button').forEach(x=>x.classList.toggle('on',x===b));
      };
    });
  }

  // 7. Add to Bag / Buy Now / Wishlist
  if($('#pdispatch')&&p.h){
    $('#pdispatch').textContent=p.h===0?'Instant Production':(p.h<=24?'24 hrs':(p.h<=48?'24–48 hrs':Math.round(p.h/24)+' days'));
  }
  const item=()=>({
    id:p.id,
    name:p.name,
    price:p.price,
    size:sz,
    color:currentColor.name||currentColor.code||'Standard',
    colorCode:currentColor.code||null,
    qty:Math.max(1,+$('#qty').value||1),
    h:p.h,
    image:currentImages[currentSlide]||currentImages[0]
  });
  $$('.addb').forEach(b=>b.onclick=()=>add(item()));
  $$('.buyb').forEach(b=>b.onclick=()=>{add(item());location='cart.html';});
  const wlb=$('#wlb');
  if(wlb){
    if(wish().includes(p.id)) wlb.textContent='♥ IN WISHLIST';
    wlb.onclick=()=>{
      let w=wish();
      const has=w.includes(p.id);
      w=has?w.filter(x=>x!=p.id):[...w,p.id];
      sv('wish',w);
      count();
      wlb.textContent=!has?'♥ IN WISHLIST':'♥ WISHLIST';
      toast(!has?'Added to wishlist':'Removed from wishlist');
    };
  }

  // 8. Product Specifications with Open/Closed function (only available fields)
  const pspecs=$('#pspecs');
  const specsAcc=$('#pspecs-accordion');
  if(pspecs){
    const specLabels={
      fabric:'Fabric',
      neckType:'Neck Type',
      brand:'Brand',
      sleeve:'Sleeve Length',
      netQuantity:'Net Quantity',
      printCoverage:'Print Coverage',
      fit:'Fit',
      idealFor:'Ideal For',
      length:'Length',
      pattern:'Pattern',
      size:'Sizes Available'
    };
    const validSpecs=[];
    if(p.specifications&&typeof p.specifications==='object'){
      Object.entries(p.specifications).forEach(([k,v])=>{
        if(v!==null&&v!==undefined){
          const str=String(v).trim();
          if(str!==''&&str.toLowerCase()!=='null'&&str.toLowerCase()!=='undefined'&&str.toLowerCase()!=='n/a'){
            validSpecs.push({key:specLabels[k]||k,val:str});
          }
        }
      });
    }

    if(validSpecs.length>0){
      pspecs.innerHTML=`
        <div class="pdp-specs-grid">
          ${validSpecs.map(s=>`
            <div class="pdp-spec-row">
              <span class="pdp-spec-key">${s.key}</span>
              <span class="pdp-spec-val">${s.val}</span>
            </div>
          `).join('')}
        </div>
      `;
      if(specsAcc) specsAcc.style.display='';
    } else {
      pspecs.innerHTML='';
      if(specsAcc) specsAcc.style.display='none';
    }
  }

  const specsToggle=$('#pspecs-toggle');
  if(specsToggle){
    specsToggle.onclick=()=>{
      const acc=$('#pspecs-accordion');
      if(acc){
        const isOpen=acc.classList.toggle('active');
        const icon=$('.pdp-specs-toggle-icon',specsToggle);
        if(icon) icon.textContent=isOpen?'−':'+';
        specsToggle.setAttribute('aria-expanded',isOpen?'true':'false');
      }
    };
  }

  // Reviews section (rendered dynamically from p.ratings array, hidden if empty)
  const revSec=$('#reviews');
  if(revSec){
    if(hasRatings){
      revSec.style.display='';
      const revSummary=$('.rating-summary-box',revSec);
      if(revSummary){
        revSummary.innerHTML=`
          <div class="rating-big-badge">★ ${avgRating}</div>
          <div class="rating-meta">
            <strong>${revCount} Customer Ratings &amp; Reviews</strong>
            <span>Verified buyer feedback for this style</span>
          </div>
        `;
      }
      const revList=$('#pdp-reviews-list');
      if(revList){
        revList.innerHTML=`<div class="reviews-grid">
          ${p.ratings.map(r=>`
            <article class="review-card">
              <div>
                <div class="rev-top">
                  <div class="rev-user-badge">
                    <div class="rev-avatar">${(r.author||'User').split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase()}</div>
                    <div>
                      <div class="rev-name">${r.author||'Verified Customer'}</div>
                      <div class="rev-verified">✓ ${r.date||'Verified Buyer'}</div>
                    </div>
                  </div>
                  <span class="rev-stars">★ ${Number(r.count||5).toFixed(1)}</span>
                </div>
                <h4 class="rev-title">${r.title||''}</h4>
                <p class="rev-body">${r.desc||''}</p>
              </div>
              <div class="rev-footer">
                <span>Size: ${sz} &bull; Verified Purchase</span>
                <span>👍 Helpful ${r.helpful?'('+r.helpful+')':''}</span>
              </div>
            </article>
          `).join('')}
        </div>`;
      }
    } else {
      revSec.style.display='none';
    }
  }

  // 9. Related Products
  const relEl=$('#rel');
  if(relEl){
    relEl.innerHTML=P.filter(x=>x.id!=p.id).sort((a,b)=>(b.cat==p.cat)-(a.cat==p.cat)).slice(0,4).map(card).join('');
    bind(relEl);
  }

  ld({'@context':'https://schema.org','@type':'Product',name:p.name,brand:{'@type':'Brand',name:'AbracaDabra Fashion'},category:p.type,offers:{'@type':'Offer',priceCurrency:'INR',price:p.price,availability:'https://schema.org/InStock',url:CONFIG.SITE+'/product.html?id='+p.id}});
}

if(pg=='studio'){
  const STUDIO_COLS=[
    {id:'black',name:'Noir Black',hex:'#080808'},
    {id:'white',name:'Pure White',hex:'#ffffff'},
    {id:'navy', name:'Midnight Navy',hex:'#132238'}
  ];
  const S={
    side:'front',
    print:'front',
    colorHex:'#ffffff',
    colorName:'Pure White',
    fa:'',
    ba:'',
    fan:'',
    ban:'',
    zone:'nashik'
  };
  const g=id=>$('#'+id);

  // 1. Render 3 Colors Only
  g('cc2').innerHTML=STUDIO_COLS.map(c=>`
    <button type="button" class="color-btn ${c.hex===S.colorHex?'active':''}" data-hex="${c.hex}" data-name="${c.name}">
      <span class="color-swatch-circle" style="background:${c.hex}"></span>
      <div class="color-btn-info">
        <strong>${c.name.split(' ')[1]||c.name}</strong>
        <small>${c.name}</small>
      </div>
    </button>
  `).join('');

  // 2. Render Size Steppers
  g('sizes').innerHTML=['S','M','L','XL','XXL'].map(s=>`
    <div class="size-stepper">
      <span>${s}</span>
      <div class="qty-stepper-row">
        <button type="button" class="qty-btn" data-act="dec" data-s="${s}">−</button>
        <input type="number" min="0" max="99" value="${s==='M'?1:0}" data-s="${s}" class="qty-input">
        <button type="button" class="qty-btn" data-act="inc" data-s="${s}">+</button>
      </div>
    </div>
  `).join('');

  function getQty(){
    return $$('[data-s].qty-input').reduce((a,el)=>a+(+el.value||0),0);
  }

  function up(){
    const printSide=S.print;
    const n=getQty();
    const isBoth=(printSide==='both');
    const isFrontActive=(S.side==='front');

    // Enable / Disable artwork upload zones based on Print Placement:
    const frontBox=g('front-art-zone');
    const backBox=g('back-art-zone');
    const ffa=g('ffa');
    const fba=g('fba');
    const frontStatus=g('front-status');
    const backStatus=g('back-status');
    const frontHint=g('front-hint');
    const backHint=g('back-hint');

    if(printSide==='front'){
      // Front enabled, Back disabled
      if(frontBox){
        frontBox.classList.remove('disabled');
        frontBox.classList.add('enabled');
        if(S.fa) frontBox.classList.add('active-file');
      }
      if(ffa) ffa.disabled=false;
      if(frontStatus) frontStatus.textContent=S.fan||'No file uploaded';
      if(frontHint) frontHint.textContent='Active: Upload front chest/center artwork';

      if(backBox){
        backBox.classList.remove('enabled','active-file');
        backBox.classList.add('disabled');
      }
      if(fba) fba.disabled=true;
      if(backStatus) backStatus.textContent='🔒 Disabled (Front Only selected)';
      if(backHint) backHint.textContent='Select "Back Side Only" or "Both Sides" above to enable';
    } else if(printSide==='back'){
      // Front disabled, Back enabled
      if(frontBox){
        frontBox.classList.remove('enabled','active-file');
        frontBox.classList.add('disabled');
      }
      if(ffa) ffa.disabled=true;
      if(frontStatus) frontStatus.textContent='🔒 Disabled (Back Only selected)';
      if(frontHint) frontHint.textContent='Select "Front Side Only" or "Both Sides" above to enable';

      if(backBox){
        backBox.classList.remove('disabled');
        backBox.classList.add('enabled');
        if(S.ba) backBox.classList.add('active-file');
      }
      if(fba) fba.disabled=false;
      if(backStatus) backStatus.textContent=S.ban||'No file uploaded';
      if(backHint) backHint.textContent='Active: Upload back shoulders/center artwork';
    } else {
      // Both enabled
      if(frontBox){
        frontBox.classList.remove('disabled');
        frontBox.classList.add('enabled');
        if(S.fa) frontBox.classList.add('active-file');
      }
      if(ffa) ffa.disabled=false;
      if(frontStatus) frontStatus.textContent=S.fan||'No file uploaded';
      if(frontHint) frontHint.textContent='Active: Upload front chest/center artwork';

      if(backBox){
        backBox.classList.remove('disabled');
        backBox.classList.add('enabled');
        if(S.ba) backBox.classList.add('active-file');
      }
      if(fba) fba.disabled=false;
      if(backStatus) backStatus.textContent=S.ban||'No file uploaded';
      if(backHint) backHint.textContent='Active: Upload back shoulders/center artwork';
    }

    // Set SVG shirt color
    g('tee').style.setProperty('--tc',S.colorHex);

    // Live Print Zone
    const z=g('zone');
    const showPrint=(printSide==='both')||(printSide===S.side);
    const art=isFrontActive?S.fa:S.ba;

    let zoneHTML='';
    if(showPrint&&art&&art.startsWith('data:image')){
      zoneHTML=`<img src="${art}" alt="Artwork Preview">`;
    }
    z.innerHTML=zoneHTML;

    // View info & spec names
    const viewName=isFrontActive?'FRONT VIEW':'BACK VIEW';
    if(g('view-indicator')) g('view-indicator').textContent=`${viewName} • ${S.colorName}`;
    if(g('color-spec-name')) g('color-spec-name').textContent=S.colorName;
    if(g('placement-spec-name')) g('placement-spec-name').textContent=isBoth?'Both Sides (₹499)':(printSide==='front'?'Front Side (₹399)':'Back Side (₹399)');

    // Price calculations:
    // Single side: ₹399, Both sides: ₹499
    const unitPrice=isBoth?499:399;
    const subtotal=unitPrice*n;

    // Delivery calculation:
    // Free in Nashik, ₹50 in MH, ₹70 outside MH, Free PAN-India above ₹1,099!
    const isFreePanIndia=(subtotal>=CONFIG.FREE_SHIP_OVER);
    let shipCost=0;
    if(!isFreePanIndia&&subtotal>0){
      if(S.zone==='nashik') shipCost=0;
      else if(S.zone==='mh') shipCost=50;
      else shipCost=70;
    }
    const grandTotal=subtotal+shipCost;

    const zoneLabel=S.zone==='nashik'?'Nashik Local':(S.zone==='mh'?'Maharashtra':'Rest of India');
    g('tot').innerHTML=`
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span>Custom T-Shirt (${isBoth?'Both Sides ₹499':'Single Side ₹399'}) × ${n}</span>
        <strong>${inr(subtotal)}</strong>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span>Delivery (${zoneLabel}):</span>
        <strong style="color:${shipCost===0?'#4ade80':'#fff'}">${shipCost===0?'FREE':inr(shipCost)}</strong>
      </div>
      ${isFreePanIndia?'<div style="color:#4ade80;font-size:12px;margin:6px 0">⚡ Cart exceeds ₹1,099: FREE PAN-India Delivery unlocked!</div>':(subtotal>0?`<div style="color:#d4af37;font-size:11.5px;margin:6px 0">Add ${inr(CONFIG.FREE_SHIP_OVER-subtotal)} more for FREE PAN-India Delivery!</div>`:'')}
      <div style="border-top:1px solid #333;padding-top:10px;margin-top:6px;display:flex;justify-content:space-between;align-items:baseline">
        <span>Estimated Total</span>
        <b style="font-size:24px;color:#fff">${inr(grandTotal)}</b>
      </div>
    `;

    return {unitPrice,subtotal,shipCost,grandTotal,n};
  }

  // Color picker events
  $$('.color-btn').forEach(btn=>{
    btn.onclick=()=>{
      $$('.color-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      S.colorHex=btn.dataset.hex;
      S.colorName=btn.dataset.name;
      up();
    };
  });

  // Print placement card events
  $$('.print-choice-card').forEach(card=>{
    card.onclick=()=>{
      $$('.print-choice-card').forEach(c=>c.classList.remove('active'));
      card.classList.add('active');
      const radio=card.querySelector('input');
      if(radio) radio.checked=true;
      S.print=card.dataset.val;

      // Automatically switch preview view to match the selected side
      if(S.print==='front'){
        S.side='front';
        $$('#sv button').forEach(b=>b.classList.toggle('active',b.dataset.v==='front'));
      } else if(S.print==='back'){
        S.side='back';
        $$('#sv button').forEach(b=>b.classList.toggle('active',b.dataset.v==='back'));
      }
      up();
    };
  });

  // View switchers (Front / Back)
  $$('#sv button').forEach(btn=>{
    btn.onclick=()=>{
      $$('#sv button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      S.side=btn.dataset.v;
      up();
    };
  });

  // Delivery zone events
  $$('.del-rate-row').forEach(row=>{
    row.onclick=()=>{
      $$('.del-rate-row').forEach(r=>r.classList.remove('active'));
      row.classList.add('active');
      const radio=row.querySelector('input');
      if(radio) radio.checked=true;
      S.zone=row.dataset.rate;
      up();
    };
  });

  // Size steppers
  $$('.qty-btn').forEach(btn=>{
    btn.onclick=()=>{
      const s=btn.dataset.s;
      const input=$(`input.qty-input[data-s="${s}"]`);
      if(!input) return;
      let val=+input.value||0;
      if(btn.dataset.act==='inc') val++;
      else if(btn.dataset.act==='dec'&&val>0) val--;
      input.value=val;
      up();
    };
  });
  $$('.qty-input').forEach(inp=>inp.oninput=up);

  // File upload processing with downscaling to keep localStorage lean & fast
  function loadArtworkFile(file,onSuccess){
    if(!file) return;
    if(file.size>15e6) return toast('File under 15MB only');
    const r=new FileReader();
    r.onload=()=>{
      const raw=r.result;
      const img=new Image();
      img.onload=()=>{
        const maxDim=800;
        let w=img.width,h=img.height;
        if(w>maxDim||h>maxDim){
          if(w>h){h=Math.round(h*maxDim/w);w=maxDim;}
          else{w=Math.round(w*maxDim/h);h=maxDim;}
        }
        const cvs=document.createElement('canvas');
        cvs.width=w;cvs.height=h;
        const ctx=cvs.getContext('2d');
        ctx.drawImage(img,0,0,w,h);
        const isPNG=file.type==='image/png';
        const optimized=cvs.toDataURL(isPNG?'image/png':'image/jpeg',0.85);
        onSuccess(optimized,file.name);
      };
      img.onerror=()=>onSuccess(raw,file.name);
      img.src=raw;
    };
    r.readAsDataURL(file);
  }

  g('ffa').onchange=e=>{
    loadArtworkFile(e.target.files[0],(data,name)=>{
      S.fa=data;
      S.fan=name;
      g('front-status').textContent=name;
      g('front-art-zone').classList.add('active-file');
      up();
      toast('Front artwork uploaded');
    });
  };

  g('fba').onchange=e=>{
    loadArtworkFile(e.target.files[0],(data,name)=>{
      S.ba=data;
      S.ban=name;
      g('back-status').textContent=name;
      g('back-art-zone').classList.add('active-file');
      up();
      toast('Back artwork uploaded');
    });
  };

  // Add to Bag
  g('addc').onclick=()=>{
    const n=getQty();
    if(!n) return toast('Select at least one size quantity');
    const {unitPrice}=up();
    const sizes=[];
    $$('[data-s].qty-input').forEach(i=>{
      if(+i.value>0) sizes.push(i.dataset.s+'×'+i.value);
    });
    const front=S.print!=='back'?S.fa:'';
    const back=S.print!=='front'?S.ba:'';

    // Proper artwork validation based on placement
    if(S.print==='front'&&!front){
      return toast('Please upload Front Side artwork');
    }
    if(S.print==='back'&&!back){
      return toast('Please upload Back Side artwork');
    }
    if(S.print==='both'){
      if(!front&&!back) return toast('Please upload artwork for Front & Back sides');
      if(!front) return toast('Please upload Front Side artwork');
      if(!back) return toast('Please upload Back Side artwork');
    }

    const previewImg = getPlainTeeImage(S.colorHex);
    const placementTitle = S.print==='both'?'Both Sides (Front + Back)':(S.print==='front'?'Front Side Only':'Back Side Only');

    const customItem = {
      id:'custom-'+Date.now(),
      custom:1,
      cat:'custom',
      name:`Custom Printed T-Shirt (${placementTitle})`,
      price:unitPrice,
      size:sizes.join(', '),
      color:S.colorHex,
      colorName:S.colorName,
      qty:n,
      h:40,
      image:previewImg,
      design:{
        print:S.print,
        printTitle:placementTitle,
        front:front,
        back:back,
        frontName:front?(S.fan||'front-artwork.png'):'',
        backName:back?(S.ban||'back-artwork.png'):'',
        zone:S.zone
      }
    };

    console.group('🎨 [AbracaDabra Studio] Added Custom Design Product to Bag');
    console.log('Product ID:', customItem.id);
    console.log('Title:', customItem.name);
    console.log('Placement:', customItem.design.printTitle);
    console.log('Sizes & Qty:', customItem.size, '| Total Qty:', n);
    console.log('Fabric Colour:', customItem.colorName, '(' + customItem.color + ')');
    console.log('Front Artwork Attached?:', !!front, '| Filename:', customItem.design.frontName, '| Base64 length:', (front||'').length);
    console.log('Back Artwork Attached?:', !!back, '| Filename:', customItem.design.backName, '| Base64 length:', (back||'').length);
    console.log('Full Item Object:', customItem);
    console.groupEnd();

    add(customItem);

    toast('Added to bag successfully!');
    setTimeout(()=>{ location='cart.html'; }, 350);
  };

  up();
}

function getPlainTeeImage(colorHex){
  const hex=(colorHex||'').toLowerCase();
  if(hex.includes('080808')||hex.includes('000000')||hex.includes('black')){
    return 'assets/plain-tee-black.svg';
  } else if(hex.includes('132238')||hex.includes('navy')||hex.includes('blue')){
    return 'assets/plain-tee-navy.svg';
  } else {
    return 'assets/plain-tee-white.svg';
  }
}

if(pg=='cart'){
  const L=$('#items');
  let selectedPayMethod = 'upi'; // Payment via UPI / QR Code scan

  function renderPaymentMethods(){
    const payContainer = $('#pay');
    if(!payContainer) return;
    payContainer.innerHTML = `
      <div class="pay-methods-wrap">
        <label class="pay-method-card active" id="pay-card-upi">
          <input type="radio" name="pay_mode" value="upi" checked>
          <div class="pay-method-info">
            <div class="pay-method-title">
              <span>UPI / QR Code Payment</span>
              <span class="pay-badge upi">Instant Verification</span>
            </div>
            <div class="pay-method-desc">Pay instantly using Google Pay, PhonePe, Paytm, BHIM, or any UPI App via QR code scan.</div>
          </div>
        </label>
      </div>

      <div class="upi-qr-box" id="upi-qr-box" style="display:block">
        <div class="upi-qr-header">
          <h4>📱 Scan &amp; Pay via UPI</h4>
          <p>Scan using any UPI App on your phone to complete payment</p>
          <div class="upi-amount-pill">Amount to Pay: <span id="upi-amount-display">${inr(window._t || 0)}</span></div>
        </div>

        <div class="upi-qr-img-wrap">
          <img src="assets/qr-code.jpeg" alt="AbracaDabra UPI QR Code" class="upi-qr-img" onerror="this.onerror=null;this.src='assets/QR code.jpeg'">
        </div>

        <div class="upi-app-badges">
          <span class="upi-app-badge">Google Pay</span>
          <span class="upi-app-badge">PhonePe</span>
          <span class="upi-app-badge">Paytm</span>
          <span class="upi-app-badge">BHIM UPI</span>
          <span class="upi-app-badge">CRED</span>
          <span class="upi-app-badge">Any Bank UPI</span>
        </div>

        <div class="upi-utr-group">
          <label for="upi_utr"><b>12-Digit UPI Transaction ID / UTR Number:</b></label>
          <input type="text" id="upi_utr" name="upi_utr" placeholder="e.g. 432109876543 (from payment receipt)" maxlength="22" inputmode="numeric" autocomplete="off">
          <small class="upi-utr-hint">💡 After scanning and paying, copy the 12-digit UTR/Ref number from your payment receipt and paste here for instant verification.</small>
        </div>

        <div class="upi-proof-group" style="margin-top:14px">
          <label for="upi_proof" style="display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:13px;color:#111;margin-bottom:6px">
            <span>📸 Upload Payment Proof / Screenshot <span style="color:var(--r);font-weight:700">* (Mandatory)</span></span>
            <span id="proof-status-tag" style="font-size:11px;color:#888;font-weight:normal">No file selected</span>
          </label>
          
          <div class="proof-upload-dropzone" id="proof-dropzone">
            <input type="file" id="upi_proof" name="upi_proof" accept="image/*" class="proof-file-input">
            <div class="proof-dropzone-content">
              <div class="proof-icon">📎</div>
              <div class="proof-text">
                <strong id="proof-upload-title">Click to Upload Payment Proof</strong>
                <small id="proof-upload-sub">Upload screenshot of Google Pay, PhonePe, Paytm, or BHIM success screen (JPG/PNG)</small>
              </div>
            </div>
            <div id="proof-preview-wrap" style="display:none;margin-top:12px;text-align:center">
              <img id="proof-preview-img" src="" alt="Payment Proof Preview" style="max-height:160px;max-width:100%;border-radius:6px;border:1px solid #dcd5c7;box-shadow:0 2px 8px rgba(0,0,0,0.08);object-fit:contain">
              <div style="font-size:12px;color:#16a34a;margin-top:6px;font-weight:600" id="proof-file-info">✓ Payment proof attached</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    const upiCard = $('#pay-card-upi');
    const upiBox = $('#upi-qr-box');

    // Proof file upload handler
    const proofInput = $('#upi_proof');
    const dropzone = $('#proof-dropzone');
    const previewWrap = $('#proof-preview-wrap');
    const previewImg = $('#proof-preview-img');
    const proofStatusTag = $('#proof-status-tag');
    const proofTitle = $('#proof-upload-title');

    if(proofInput){
      proofInput.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if(!file) return;
        if(file.size > 15e6) return toast('File under 15MB only');

        const reader = new FileReader();
        reader.onload = () => {
          const raw = reader.result;
          const img = new Image();
          img.onload = () => {
            // Optimize image for fast upload and clean storage
            const maxDim = 1200;
            let w = img.width, h = img.height;
            if(w > maxDim || h > maxDim){
              if(w > h){ h = Math.round(h * maxDim / w); w = maxDim; }
              else { w = Math.round(w * maxDim / h); h = maxDim; }
            }
            const cvs = document.createElement('canvas');
            cvs.width = w; cvs.height = h;
            const ctx = cvs.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            const optimized = cvs.toDataURL('image/jpeg', 0.85);

            window._paymentProof = optimized;
            window._paymentProofName = file.name;

            if(previewImg) previewImg.src = optimized;
            if(previewWrap) previewWrap.style.display = 'block';
            if(dropzone) dropzone.classList.add('has-file');
            if(proofStatusTag) proofStatusTag.textContent = '✓ ' + file.name;
            if(proofTitle) proofTitle.textContent = 'Change Payment Proof Screenshot';
            toast('Payment proof screenshot attached successfully');
          };
          img.onerror = () => {
            window._paymentProof = raw;
            window._paymentProofName = file.name;
            if(previewImg) previewImg.src = raw;
            if(previewWrap) previewWrap.style.display = 'block';
            if(dropzone) dropzone.classList.add('has-file');
            if(proofStatusTag) proofStatusTag.textContent = '✓ ' + file.name;
          };
          img.src = raw;
        };
        reader.readAsDataURL(file);
      };
    }

    if(upiCard){
      upiCard.onclick = () => {
        selectedPayMethod = 'upi';
        upiCard.classList.add('active');
        const r = upiCard.querySelector('input');
        if(r) r.checked = true;
        if(upiBox) upiBox.style.display = 'block';
        updateUpiDisplay();
      };
    }
  }

  function updateUpiDisplay(){
    const amtEl = $('#upi-amount-display');
    if(amtEl && window._t !== undefined){
      amtEl.textContent = inr(window._t);
    }
  }

  function r(){
    const c=cart();
    const deliverySec = $('#delivery-section');

    if(!c.length){
      L.innerHTML='<div style="padding:40px 20px;text-align:center;background:#faf8f5;border-radius:10px;border:1px dashed #dcd5c7"><p style="font-size:16px;color:#666;margin-bottom:14px">Your shopping bag is empty.</p><a class="btn gold" href="shop.html">EXPLORE COLLECTIONS</a></div>';
      $('#sum').innerHTML='<p style="color:#777">No items in bag.</p>';
      if(deliverySec) deliverySec.style.display = 'none';
      window._t=0;
      window._subtotal=0;
      window._shipping=0;
      return;
    }

    if(deliverySec) deliverySec.style.display = 'block';

    L.innerHTML=c.map((i,x)=>{
      const isCustom=!!i.custom||!!i.design||(i.id&&String(i.id).startsWith('custom'));
      let img='';
      if(isCustom){
        // For custom t-shirts, show clean plain t-shirt matching the chosen color
        img=getPlainTeeImage(i.color||(i.design&&i.design.color));
      } else {
        const p=P.find(item=>item.id==i.id);
        img=i.image||(p&&p.images?p.images[0]:'assets/nkb-tshirt-002-1.webp');
      }

      let metaHTML='';
      if(isCustom&&i.design){
        const d=i.design;
        metaHTML=`
          <div style="font-size:12.5px;color:#555;margin:4px 0;line-height:1.6">
            <div><strong>Placement:</strong> ${d.printTitle||(d.print==='both'?'Both Sides (Front + Back)':(d.print==='front'?'Front Side Only':'Back Side Only'))}</div>
            <div><strong>Size(s):</strong> ${i.size}</div>
            <div><strong>Colour:</strong> <span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${i.color};border:1px solid #777;vertical-align:middle;margin-right:4px"></span>${i.colorName||i.color}</div>
            ${d.frontName?`<div><strong>Front Artwork:</strong> 📎 ${d.frontName}</div>`:''}
            ${d.backName?`<div><strong>Back Artwork:</strong> 📎 ${d.backName}</div>`:''}
          </div>
        `;
      } else {
        metaHTML=`
          <div style="font-size:12.5px;color:#555;margin:4px 0">
            Size: ${i.size} ${i.color?`· Colour <span style="display:inline-block;width:10px;height:10px;background:${i.color};border:1px solid #999;vertical-align:middle"></span>${i.colorName?' '+i.colorName:''}`:''}
          </div>
        `;
      }

      return `<div class="cartrow">
        <img src="${img}" alt="${i.name}" class="cart-thumb ${isCustom?'custom-plain-thumb':''}" onerror="this.onerror=null;this.src='assets/plain-tee-white.svg'">
        <div>
          <b style="font-size:15px;color:#111">${i.name}</b>
          ${metaHTML}
          <div style="font-size:13px;color:#222;font-weight:600;margin-top:3px">
            Qty: ${i.qty} × ${inr(i.price)}
          </div>
        </div>
        <div style="text-align:right">
          <b style="font-size:16px;display:block;margin-bottom:8px">${inr(i.qty*i.price)}</b>
          <button data-r="${x}" style="border:0;background:none;color:var(--r);cursor:pointer;font-size:12.5px;font-weight:600">✕ Remove</button>
        </div>
      </div>`;
    }).join('');

    const s=c.reduce((a,i)=>a+i.qty*i.price,0);
    // Shipping rules:
    // Subtotal >= 1099 => Free!
    // City Nashik => Free!
    // Maharashtra => ₹50
    // Outside MH => ₹70
    const cityInput=$('input[name=city]');
    const stateInput=$('input[name=state]');
    const city=(cityInput?cityInput.value:'').toLowerCase();
    const state=(stateInput?stateInput.value:'').toLowerCase();
    let sh=0;
    if(s>0&&s<CONFIG.FREE_SHIP_OVER){
      if(city.includes('nashik')||city.includes('nasik')) sh=0;
      else if(state.includes('maharashtra')||state.includes('mh')) sh=50;
      else sh=70;
    }

    const promo = ls('cart_promo', null) || ls('gh_active_coupon', null);
    let promoDiscount = 0;
    let promoHtml = '';

    if (promo && s > 0) {
      const minO = promo.minOrder || 499;
      if (s >= minO) {
        const pct = promo.discountPercent || promo.percent || 10;
        promoDiscount = Math.round(s * (pct / 100));
        promoHtml = `
          <div class="cart-promo-badge">
            <div>
              <strong>🎁 ${promo.code || 'PROMO'}</strong>
              <span>(${pct}% OFF Applied &bull; Saved ${inr(promoDiscount)})</span>
            </div>
            <button id="cart-remove-promo-btn" title="Remove promo" aria-label="Remove promo">✕</button>
          </div>
        `;
      } else {
        promoHtml = `
          <div style="font-size:12px;color:#d97706;background:#fef3c7;padding:8px 12px;border-radius:6px;margin:8px 0;line-height:1.4">
            ⚠️ Add ${inr(minO - s)} more to activate promo <b>${promo.code}</b> (${promo.discountPercent || promo.percent}% OFF)
          </div>
        `;
      }
    }

    const payableTotal = Math.max(0, (s - promoDiscount) + sh);
    window._subtotal=s;
    window._shipping=sh;
    window._promoDiscount=promoDiscount;
    window._promoCode=promo ? promo.code : '';
    window._t=payableTotal;

    console.groupCollapsed('🛒 [AbracaDabra Cart State]');
    console.log('Cart Items in Bag:', c.length);
    console.table(c.map(item => ({
      ID: item.id,
      Name: item.name,
      IsCustom: !!(item.custom || item.design),
      Qty: item.qty,
      Price: item.price,
      Total: item.qty * item.price,
      FrontArtwork: item.design ? (item.design.frontName || (item.design.front ? 'base64 data' : 'None')) : 'N/A',
      BackArtwork: item.design ? (item.design.backName || (item.design.back ? 'base64 data' : 'None')) : 'N/A'
    })));
    console.log('Financials: Subtotal = ₹' + s + ', Discount = ₹' + promoDiscount + ', Shipping = ₹' + sh + ', Grand Total = ₹' + payableTotal);
    console.groupEnd();

    $('#sum').innerHTML=`
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="color:#555">Items Subtotal</span>
        <strong>${inr(s)}</strong>
      </div>
      ${promoDiscount > 0 ? `
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;color:#16a34a">
        <span>Discount (${window._promoCode})</span>
        <strong>-${inr(promoDiscount)}</strong>
      </div>` : ''}
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="color:#555">Delivery / Shipping</span>
        <strong>${sh===0?'<span style="color:#16a34a;font-weight:700">FREE</span>':inr(sh)}</strong>
      </div>
      ${promoHtml}
      ${s>=CONFIG.FREE_SHIP_OVER?'<div style="color:#16a34a;font-size:12px;margin:6px 0">⚡ Orders above ₹1,099 get FREE PAN-India Delivery!</div>':(s>0?`<div style="color:#b45309;font-size:12px;margin:6px 0">Add ${inr(CONFIG.FREE_SHIP_OVER-s)} more for FREE Delivery!</div>`:'')}
      <div style="border-top:1px solid #dcd5c7;padding-top:10px;margin-top:10px;display:flex;justify-content:space-between;align-items:baseline">
        <span style="font-weight:600">Grand Total</span>
        <b style="font-size:24px;color:var(--k)">${inr(payableTotal)}</b>
      </div>
    `;

    const rmBtn = $('#cart-remove-promo-btn');
    if (rmBtn) {
      rmBtn.onclick = () => {
        try {
          localStorage.removeItem('cart_promo');
          localStorage.removeItem('gh_active_coupon');
        } catch(e){}
        toast('Promo code removed');
        r();
      };
    }

    updateUpiDisplay();

    $$('[data-r]').forEach(b=>b.onclick=()=>{
      const c=cart();
      c.splice(+b.dataset.r,1);
      sv('cart',c);
      count();
      r();

    });
  }

  // Initialize payment UI & cart
  renderPaymentMethods();

  const cityInput=$('input[name=city]');
  const stateInput=$('input[name=state]');
  if(cityInput) cityInput.oninput=r;
  if(stateInput) stateInput.oninput=r;
  r();


  // Form submit handler with complete validation, button spinner, disabling inputs, and Google Sheets integration
  $('#co').onsubmit=async e=>{
    e.preventDefault();
    const c=cart();
    if(!c.length) return toast('Bag is empty');

    const form = e.target;
    const f=Object.fromEntries(new FormData(form));

    // Validations
    if(!f.name || !f.name.trim()) return toast('Please enter your full name');
    if(!/^[6-9]\d{9}$/.test((f.mobile||'').trim())) return toast('Please enter a valid 10-digit mobile number');
    if(!/^\d{6}$/.test((f.pin||'').trim())) return toast('Please enter a valid 6-digit PIN code');
    if(!f.address || !f.address.trim()) return toast('Please enter your complete address');
    if(!f.city || !f.city.trim()) return toast('Please enter your city');
    if(!f.state || !f.state.trim()) return toast('Please enter your state');

    const isUpi = (selectedPayMethod === 'upi');
    const upiUtr = (f.upi_utr || '').trim();

    // STRICT MANDATORY VALIDATION FOR UPI PAYMENT PROOF
    if(isUpi && !window._paymentProof){
      toast('⚠️ Payment proof screenshot is MANDATORY for UPI payments. Please upload your payment receipt/screenshot.');
      const dropzone = $('#proof-dropzone');
      if(dropzone){
        dropzone.classList.add('error-pulse');
        dropzone.scrollIntoView({behavior:'smooth', block:'center'});
        setTimeout(()=>dropzone.classList.remove('error-pulse'), 2500);
      }
      return;
    }

    // If UPI selected and UTR is empty, prompt user
    if(isUpi && !upiUtr){
      const confirmNoUtr = confirm('You have selected UPI Payment.\n\nDid you enter your 12-digit UTR Reference number from your payment receipt? Entering it speeds up verification.\n\nClick Cancel to enter UTR number now, or OK to place order with uploaded screenshot proof.');
      if(!confirmNoUtr){
        const utrField = $('#upi_utr');
        if(utrField){
          utrField.focus();
          utrField.scrollIntoView({behavior:'smooth', block:'center'});
        }
        return;
      }
    }

    // 1. SHOW PROPER LOADING INDICATOR ON BUTTON
    const submitBtn = $('#place-order-btn') || form.querySelector('button[type=submit]');
    if(!submitBtn) return;
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<span class="order-spinner"></span> <span>Placing Order... Please wait</span>';

    // 2. DISABLE ALL OTHER FORM INPUTS TO PREVENT TAMPERING
    const allFormControls = form.querySelectorAll('input, textarea, select, button');
    allFormControls.forEach(el => {
      if(el !== submitBtn){
        el.disabled = true;
        el.classList.add('form-field-disabled');
      }
    });

    // Also disable cart remove buttons
    $$('[data-r]').forEach(b => {
      b.disabled = true;
      b.style.pointerEvents = 'none';
      b.style.opacity = '0.3';
    });

    // Helper to re-enable form in case of network issue
    const reEnableForm = () => {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.innerHTML = '<span>PLACE ORDER</span>';
      allFormControls.forEach(el => {
        el.disabled = false;
        el.classList.remove('form-field-disabled');
      });
      $$('[data-r]').forEach(b => {
        b.disabled = false;
        b.style.pointerEvents = 'auto';
        b.style.opacity = '1';
      });
    };

    // 3. CONSTRUCT COMPLETE ORDER OBJECT WITH ALL SEPARATE COLUMNS
    const orderId = 'AD' + Date.now().toString(36).toUpperCase();
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
    const fullDeliveryAddress = [
      f.address.trim(),
      (f.landmark||'').trim() ? ('Landmark: ' + f.landmark.trim()) : '',
      f.city.trim(),
      f.state.trim(),
      f.pin.trim()
    ].filter(Boolean).join(', ');

    const orderPayload = {
      orderId: orderId,
      date: dateFormatted,
      timestamp: now.toISOString(),
      customer: {
        name: f.name.trim(),
        mobile: f.mobile.trim(),
        email: (f.email||'').trim(),
        address: f.address.trim(),
        landmark: (f.landmark||'').trim(),
        city: f.city.trim(),
        state: f.state.trim(),
        pin: f.pin.trim()
      },
      deliveryAddressCombined: fullDeliveryAddress,
      payment: 'UPI / QR Code Payment',
      upiUtr: upiUtr || 'Pending Submission',
      paymentProof: window._paymentProof || '',
      paymentProofName: window._paymentProofName || '',
      paymentStatus: 'Payment Proof Uploaded (Verification Pending)',
      orderStatus: 'New',
      subtotal: window._subtotal || 0,
      discount: window._promoDiscount || 0,
      promoCode: window._promoCode || '',
      shipping: window._shipping || 0,
      total: window._t || 0,
      items: c
    };

    // CONSOLE LOG ALL DETAILS FOR USER INSPECTION
    console.group('🚀 [AbracaDabra Checkout] Submitting Order');
    console.log('Order ID:', orderPayload.orderId);
    console.log('Customer Details:', orderPayload.customer);
    console.log('Complete Delivery Address:', orderPayload.deliveryAddressCombined);
    console.log('Payment Mode:', orderPayload.payment, '| UTR Number:', orderPayload.upiUtr);
    console.log('Payment Proof Screenshot Attached?:', !!orderPayload.paymentProof, '| File:', orderPayload.paymentProofName);
    console.log('Total Items Ordered:', orderPayload.items.length);
    console.table(orderPayload.items);

    const customItemsInOrder = orderPayload.items.filter(i => {
      const isCust = !!i.custom || !!i.design;
      const idStr = String(i.id || '').toLowerCase();
      const catStr = String(i.cat || '').toLowerCase();
      const nameStr = String(i.name || '').toLowerCase();
      return isCust || idStr.includes('custom') || catStr.includes('custom') || nameStr.includes('custom');
    });
    console.log('🎨 Custom Designs in this order (' + customItemsInOrder.length + '):', customItemsInOrder);

    console.log('Subtotal: ₹' + orderPayload.subtotal + ' | Shipping: ₹' + orderPayload.shipping + ' | Grand Total: ₹' + orderPayload.total);
    console.log('Google Apps Script Webhook URL:', CONFIG.SCRIPT_URL);
    console.log('Full Order Payload Object:', orderPayload);
    console.groupEnd();

    // 4. CONNECT FORM WITH GOOGLE SHEETS
    if(CONFIG.SCRIPT_URL && CONFIG.SCRIPT_URL.startsWith('http')){
      try {
        console.log('⏳ Sending order payload via fetch POST to Google Apps Script...');
        // Send request with 15s timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Network request timed out')), 15000)
        );
        await Promise.race([
          fetch(CONFIG.SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(orderPayload)
          }),
          timeoutPromise
        ]);
        console.log('✅ Google Apps Script Webhook call completed successfully!');
      } catch(err) {
        console.error('❌ Sheet submission error:', err);
        reEnableForm();
        return toast('Connection timeout. Please check your network and try again.');
      }
    } else {
      console.warn('⚠️ CONFIG.SCRIPT_URL is not configured yet. Saving order locally in localStorage.');
    }

    // Save order locally in recent orders history as safe backup
    const ordersHistory = ls('orders_history', []);
    ordersHistory.unshift(orderPayload);
    sv('orders_history', ordersHistory);
    console.log('💾 Order saved to local backup (orders_history):', ordersHistory);

    // Empty cart and update counter
    sv('cart', []);
    count();
    window._paymentProof = '';
    window._paymentProofName = '';

    // Number to words helper for Flipkart-style invoice
    function inrWords(num) {
      const a = ['','One ','Two ','Three ','Four ','Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
      const b = ['', '', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
      try {
        let n = Math.round(num || 0);
        if (n <= 0) return 'Zero Rupees Only';
        let str = ('000000000' + n).substr(-9);
        let m = str.match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if(!m) return num + ' Rupees Only';
        let res = '';
        res += (+m[1]) ? ((a[+m[1]] || b[+m[1][0]] + ' ' + a[+m[1][1]]) + 'Crore ') : '';
        res += (+m[2]) ? ((a[+m[2]] || b[+m[2][0]] + ' ' + a[+m[2][1]]) + 'Lakh ') : '';
        res += (+m[3]) ? ((a[+m[3]] || b[+m[3][0]] + ' ' + a[+m[3][1]]) + 'Thousand ') : '';
        res += (+m[4]) ? ((a[+m[4]] || b[+m[4][0]] + ' ' + a[+m[4][1]]) + 'Hundred ') : '';
        res += (+m[5]) ? (((res ? 'and ' : '') + (a[+m[5]] || b[+m[5][0]] + ' ' + a[+m[5][1]]))) : '';
        return (res.trim() || num) + ' Rupees Only';
      } catch(e) {
        return num + ' Rupees Only';
      }
    }

    // 5. RENDER FLIPKART-STYLE TAX INVOICE
    const tableRowsHTML = c.map((item, idx) => {
      const isCustom = !!item.custom || !!item.design || (item.id && String(item.id).startsWith('custom'));
      let descMeta = `Size: ${item.size || 'Free Size'}`;
      if (item.colorName || item.color) descMeta += ` • Colour: ${item.colorName || item.color}`;
      if (isCustom && item.design) {
        descMeta += ` • Placement: ${item.design.printTitle || item.design.print || 'Custom Print'}`;
        if (item.design.frontName) descMeta += ` • Front Art: ${item.design.frontName}`;
        if (item.design.backName) descMeta += ` • Back Art: ${item.design.backName}`;
      }
      const itemTotal = (Number(item.qty) || 1) * (Number(item.price) || 0);

      return `
        <tr>
          <td style="text-align:center">${idx + 1}</td>
          <td>
            <div class="inv-desc-title">${item.name}</div>
            <div class="inv-desc-meta">${descMeta}</div>
          </td>
          <td style="text-align:center">${item.qty}</td>
          <td style="text-align:right">${inr(item.price)}</td>
          <td style="text-align:right">${inr(itemTotal)}</td>
          <td style="text-align:right"><strong>${inr(itemTotal)}</strong></td>
        </tr>
      `;
    }).join('');

    const waMsg = encodeURIComponent(`Hello AbracaDabra Fashion! 👋\nI have placed Order #${orderId} for ${inr(orderPayload.total)}.\nName: ${orderPayload.customer.name}\nInvoice: INV-${orderId}\nPayment: ${orderPayload.payment}${isUpi&&upiUtr?` (UTR: ${upiUtr})`:''}.\nPlease confirm dispatch!`);

    const invoiceNo = `INV-${orderId}`;
    try { document.title = invoiceNo; } catch(e) {}

    $('main').innerHTML = `
      <div class="invoice-page-wrap">
        <!-- Top Success Banner -->
        <div class="invoice-success-banner">
          <div class="inv-success-left">
            <div class="inv-check-badge">✓</div>
            <div class="inv-success-title">
              <strong>Order Placed Successfully!</strong>
              <span>Order <b>#${orderId}</b> registered. Your Flipkart-style Tax Invoice is generated below.</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="invoice-actions-bar">
          <button type="button" class="inv-btn inv-btn-download" id="btn-download-pdf" onclick="downloadInvoicePDF('${orderId}')">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Download Invoice (PDF)</span>
          </button>
          <button type="button" class="inv-btn inv-btn-print" onclick="printInvoice('${orderId}')">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            <span>Print Invoice</span>
          </button>
          <a href="shop.html" class="inv-btn inv-btn-shop">
            <span>🛍️ Continue Shopping</span>
          </a>
        </div>

        <!-- FLIPKART STYLE TAX INVOICE -->
        <div class="invoice-doc" id="printable-invoice">
          <!-- Header -->
          <div class="inv-doc-header">
            <div class="inv-logo-area">
              <img src="assets/logo.webp" alt="AbracaDabra Fashion" class="inv-logo-img" onerror="this.onerror=null;this.src='assets/logo.png'">
              <div class="tax-inv-badge">TAX INVOICE / BILL OF SUPPLY / CASH RECEIPT</div>
            </div>
            <div class="inv-meta-right">
              <span class="inv-copy-badge">Original for Recipient</span>
              <div class="inv-meta-line"><b>Invoice No:</b> INV-${orderId}</div>
              <div class="inv-meta-line"><b>Invoice Date:</b> ${dateFormatted}</div>
              <div class="inv-meta-line"><b>Order ID:</b> ${orderId}</div>
              <div class="inv-meta-line"><b>Order Date:</b> ${dateFormatted}</div>
            </div>
          </div>

          <!-- Seller & Buyer Party Grid -->
          <div class="inv-party-grid">
            <div class="inv-party-box">
              <div class="inv-party-heading">Sold By / Dispatch Warehouse</div>
              <div class="inv-party-name">AbracaDabra Software Solutions Pvt. Ltd.</div>
              <div class="inv-party-text">
                Apparel Manufacturing &amp; Custom Studio, College Road,<br>
                Nashik, Maharashtra - 422005, India 🇮🇳<br>
                <strong>PAN:</strong> AABCA1234F &nbsp;|&nbsp; <strong>GSTIN:</strong> 27AABCA1234F1Z5<br>
                <strong>State/UT Code:</strong> 27 (Maharashtra)<br>
                <strong>Customer Helpline:</strong> +91 77090 53245 / +91 92842 56635<br>
                <strong>Support Email:</strong> support@abracadabrafashion.com
              </div>
            </div>
            <div class="inv-party-box">
              <div class="inv-party-heading">Billing &amp; Delivery Address</div>
              <div class="inv-party-name">${orderPayload.customer.name}</div>
              <div class="inv-party-text">
                ${orderPayload.customer.address}<br>
                ${orderPayload.customer.landmark ? ('Landmark: ' + orderPayload.customer.landmark + '<br>') : ''}
                ${orderPayload.customer.city}, ${orderPayload.customer.state} - PIN: ${orderPayload.customer.pin}<br>
                <strong>Mobile:</strong> ${orderPayload.customer.mobile}<br>
                <strong>Email:</strong> ${orderPayload.customer.email}<br>
                <strong>Place of Supply / Delivery State:</strong> ${orderPayload.customer.state}
              </div>
            </div>
          </div>

          <!-- Product Line Items Table -->
          <div class="inv-table-wrap">
            <table class="inv-table">
              <thead>
                <tr>
                  <th style="width:5%;text-align:center">#</th>
                  <th style="width:45%">Product Description</th>
                  <th style="width:8%;text-align:center">Qty</th>
                  <th style="width:14%;text-align:right">Unit Price</th>
                  <th style="width:14%;text-align:right">Taxable Val</th>
                  <th style="width:14%;text-align:right">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                ${tableRowsHTML}
                <tr class="inv-totals-row">
                  <td colspan="4" style="text-align:right">Items Subtotal:</td>
                  <td colspan="2" style="text-align:right"><strong>${inr(orderPayload.subtotal)}</strong></td>
                </tr>
                <tr class="inv-totals-row">
                  <td colspan="4" style="text-align:right">Shipping &amp; Delivery Charges:</td>
                  <td colspan="2" style="text-align:right"><strong>${orderPayload.shipping === 0 ? '<span style="color:#16a34a">FREE</span>' : inr(orderPayload.shipping)}</strong></td>
                </tr>
                <tr class="inv-grand-total-row">
                  <td colspan="4" style="text-align:right;font-size:13px">GRAND TOTAL:</td>
                  <td colspan="2" style="text-align:right;font-size:15px;color:#000"><b>${inr(orderPayload.total)}</b></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Amount in Words & Payment Info -->
          <div class="inv-bottom-grid">
            <div class="inv-bottom-left">
              <div class="inv-words-box">
                <strong>Amount in Words:</strong><br>
                <em style="font-weight:600;color:#111">${inrWords(orderPayload.total)}</em>
              </div>
              <div class="inv-pay-info">
                <strong>Payment Summary:</strong><br>
                • <b>Payment Mode:</b> UPI / QR Code Payment<br>
                • <b>Payment Status:</b> Payment Proof Attached (Verification Pending)<br>
                ${upiUtr ? `• <b>UPI UTR / Ref No:</b> ${upiUtr}<br>` : ''}
                ${orderPayload.paymentProofName ? `• <b>Payment Proof Screenshot:</b> Attached (${orderPayload.paymentProofName})<br>` : ''}
              </div>
            </div>
            <div class="inv-bottom-right">
              <div style="font-size:11px;color:#555">
                Tax is inclusive in apparel MRP as per applicable GST slabs.
              </div>
              <div class="inv-sign-box">
                <div class="inv-sign-seal">For AbracaDabra Software Solutions Pvt. Ltd.</div>
                <div class="inv-sign-line">Authorized Signatory</div>
              </div>
            </div>
          </div>

          <!-- Footer Note -->
          <div class="inv-footer-note">
            This is a computer-generated invoice and requires no physical signature.<br>
            Returns &amp; Replacement policy: 7 days from the delivery date. Contact support at +91 92842 56635.<br>
            © 2026 AbracaDabra Fashion. All Rights Reserved.
          </div>
        </div>
      </div>
    `;
    window.scrollTo({top:0, behavior:'smooth'});
  };
}

// Download Tax Invoice as PDF using html2pdf.js with fallback to browser print
window.downloadInvoicePDF = function(orderId) {
  const el = document.getElementById('printable-invoice');
  const invoiceNo = (orderId && String(orderId).startsWith('INV-')) ? String(orderId) : `INV-${orderId || 'ORDER'}`;
  try { document.title = invoiceNo; } catch(e) {}

  if (!el) {
    window.print();
    return;
  }
  const btn = document.getElementById('btn-download-pdf');
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.75';
    btn.innerHTML = `
      <svg class="inv-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>
      <span>Downloading ${invoiceNo}.pdf...</span>
    `;
  }

  const opt = {
    margin: [6, 6, 6, 6],
    filename: `${invoiceNo}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  if (typeof html2pdf !== 'undefined') {
    html2pdf().set(opt).from(el).save().then(function() {
      if (btn) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.innerHTML = originalHtml;
      }
    }).catch(function(err) {
      console.error('PDF generation error:', err);
      if (btn) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.innerHTML = originalHtml;
      }
      window.print();
    });
  } else {
    window.print();
    if (btn) {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.innerHTML = originalHtml;
    }
  }
};

// Print Invoice with Invoice No (e.g. INV-ADMWNDENEQ) as document title so browser "Save as PDF" uses it as filename
window.printInvoice = function(orderId) {
  const invoiceNo = (orderId && String(orderId).startsWith('INV-')) ? String(orderId) : `INV-${orderId || 'ORDER'}`;
  try { document.title = invoiceNo; } catch(e) {}
  window.print();
};
