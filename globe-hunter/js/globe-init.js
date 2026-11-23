/**
 * Globe Hunter - Three.js Geographical Atlas 3D Earth
 * Renders a classic blue-and-green geographical atlas globe with
 * natural oceans, green continents, detailed country boundaries (no text names),
 * and an active 3D location pin.
 */
window.GH_GLOBE = {
  scene: null,
  camera: null,
  renderer: null,
  earthMesh: null,
  pinGroup: null,
  container: null,
  animId: null,
  isSpinning: false,
  spinSpeed: 0.005,
  currentPinCoords: { lat: 20.59, lng: 78.96 },
  hasWebGL: true,

  checkWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      return false;
    }
  },

  /**
   * Generates the classic Atlas-style Earth texture:
   * - Natural Bright Blue Oceans (#2575b8)
   * - Natural Green Continents (#38a169 / #2f855a)
   * - Detailed Country Boundaries outlined in crisp lines (NO TEXT NAMES)
   * - Thin white graticule latitude & longitude lines
   */
  createAtlasEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Natural Bright Blue Ocean Base (No washed out gradients, natural atlas azure)
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGrad.addColorStop(0, '#1c5e93');
    oceanGrad.addColorStop(0.2, '#2575b8');
    oceanGrad.addColorStop(0.5, '#2b82c9');
    oceanGrad.addColorStop(0.8, '#2575b8');
    oceanGrad.addColorStop(1, '#1c5e93');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Coordinate conversion helper: [lng (-180..180), lat (-90..90)] -> canvas [x, y]
    const toXY = (lng, lat) => ({
      x: ((lng + 180) / 360) * 2048,
      y: ((90 - lat) / 180) * 1024
    });

    // Helper: draw filled continental landmass
    const drawLandmass = (points, fill = '#3ba55d') => {
      if (points.length < 3) return;
      ctx.fillStyle = fill;
      ctx.beginPath();
      const start = toXY(points[0][0], points[0][1]);
      ctx.moveTo(start.x, start.y);
      for (let i = 1; i < points.length; i++) {
        const pt = toXY(points[i][0], points[i][1]);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.fill();
    };

    // Helper: draw crisp country boundary lines (NO TEXT)
    const drawBorderLine = (points, color = 'rgba(255, 255, 255, 0.65)', width = 1.2) => {
      if (points.length < 2) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      const start = toXY(points[0][0], points[0][1]);
      ctx.moveTo(start.x, start.y);
      for (let i = 1; i < points.length; i++) {
        const pt = toXY(points[i][0], points[i][1]);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    };

    // 2. Continental Landmasses (Detailed Natural Bright Green)
    // North America (USA, Canada, Alaska)
    drawLandmass([
      [-168, 65], [-160, 71], [-130, 70], [-105, 74], [-82, 72], [-65, 60],
      [-55, 52], [-60, 44], [-70, 42], [-75, 35], [-80, 25], [-82, 23],
      [-90, 30], [-97, 26], [-105, 20], [-110, 23], [-117, 32], [-124, 40],
      [-125, 49], [-135, 57], [-150, 60], [-165, 60], [-168, 65]
    ], '#38a169');

    // Central America & Mexico
    drawLandmass([
      [-117, 32], [-105, 20], [-97, 26], [-90, 20], [-83, 10], [-77, 8],
      [-82, 8], [-88, 14], [-100, 16], [-106, 22], [-112, 28], [-117, 32]
    ], '#3ba55d');

    // Greenland
    drawLandmass([
      [-55, 60], [-40, 60], [-20, 70], [-25, 82], [-50, 83], [-60, 76], [-55, 60]
    ], '#52b788');

    // South America (Brazil, Argentina, Chile, Colombia, Peru)
    drawLandmass([
      [-77, 8], [-60, 10], [-50, 0], [-35, -5], [-35, -12], [-40, -22],
      [-50, -30], [-60, -42], [-68, -55], [-75, -50], [-72, -40], [-70, -20],
      [-81, -5], [-77, 8]
    ], '#2f855a');

    // Europe (UK, France, Germany, Spain, Scandinavia, Italy, Balkans)
    drawLandmass([
      [-9, 36], [-9, 43], [-1, 44], [-5, 48], [2, 51], [8, 55], [12, 56],
      [10, 60], [15, 65], [25, 71], [30, 70], [38, 65], [30, 55], [25, 45],
      [18, 40], [15, 38], [8, 38], [3, 42], [-2, 36], [-9, 36]
    ], '#38a169');

    // United Kingdom & Ireland
    drawLandmass([
      [-5, 50], [1, 51], [0, 54], [-2, 58], [-5, 58], [-5, 50]
    ], '#48bb78');
    drawLandmass([
      [-10, 51], [-6, 52], [-6, 55], [-10, 54], [-10, 51]
    ], '#48bb78');

    // Africa
    drawLandmass([
      [-17, 30], [-5, 36], [10, 37], [25, 32], [35, 30], [43, 12], [51, 10],
      [45, -5], [40, -15], [35, -25], [32, -34], [18, -34], [12, -20], [8, 4],
      [-5, 5], [-15, 12], [-17, 22], [-17, 30]
    ], '#2f855a');

    // Madagascar
    drawLandmass([
      [44, -12], [50, -14], [48, -25], [44, -25], [44, -12]
    ], '#3ba55d');

    // Asia (Russia, China, Mongolia, Central Asia)
    drawLandmass([
      [38, 65], [60, 68], [90, 75], [140, 72], [170, 66], [170, 60], [150, 50],
      [140, 42], [130, 32], [120, 22], [110, 20], [105, 10], [100, 2], [98, 10],
      [80, 20], [60, 25], [50, 30], [40, 40], [38, 65]
    ], '#38a169');

    // India Subcontinent
    drawLandmass([
      [68, 24], [72, 32], [76, 35], [88, 28], [92, 26], [88, 22], [80, 14],
      [77, 8], [74, 15], [70, 21], [68, 24]
    ], '#2d6a4f');

    // Sri Lanka
    drawLandmass([
      [80, 6], [82, 7], [81, 9], [80, 8], [80, 6]
    ], '#38a169');

    // Japan Archipelago
    drawLandmass([
      [130, 33], [135, 34], [140, 36], [142, 43], [145, 44], [141, 45], [139, 40], [133, 35], [130, 33]
    ], '#48bb78');

    // Southeast Asia & Indonesia
    drawLandmass([
      [95, 5], [105, -6], [115, -8], [120, -8], [120, 0], [105, 5], [95, 5]
    ], '#3ba55d');
    drawLandmass([
      [110, -3], [118, -3], [118, 5], [110, 5], [110, -3]
    ], '#3ba55d');

    // Australia
    drawLandmass([
      [114, -22], [125, -14], [136, -12], [142, -10], [153, -28], [150, -37],
      [140, -38], [135, -34], [124, -33], [115, -34], [114, -22]
    ], '#38a169');

    // New Zealand
    drawLandmass([
      [166, -46], [174, -41], [178, -37], [174, -35], [168, -44], [166, -46]
    ], '#48bb78');

    // 3. Clear, Detailed Country Boundary Lines (Outlined in crisp white/light borders, strictly NO text)
    const bColor = 'rgba(255, 255, 255, 0.65)';

    // India national borders
    drawBorderLine([
      [68.1, 23.7], [70.5, 27.5], [74.0, 32.5], [76.8, 34.6], [78.5, 35.5],
      [80.2, 31.0], [88.0, 27.5], [92.5, 27.8], [97.3, 28.2], [93.2, 22.5],
      [89.0, 21.6], [80.3, 16.0], [77.5, 8.1], [72.8, 19.0], [68.1, 23.7]
    ], bColor, 1.4);

    // North America: USA - Canada (49th parallel & Great Lakes)
    drawBorderLine([
      [-125, 49], [-110, 49], [-95, 49], [-89, 48], [-84, 45], [-75, 45], [-67, 45]
    ], bColor, 1.4);
    // USA - Mexico border
    drawBorderLine([
      [-117, 32.5], [-111, 31.3], [-106.5, 31.8], [-103, 29], [-97.1, 25.9]
    ], bColor, 1.3);

    // South America national borders:
    // Brazil - Argentina / Uruguay / Paraguay
    drawBorderLine([
      [-57, -30], [-54, -26], [-58, -22], [-60, -19], [-65, -10], [-70, -4], [-60, 4]
    ], bColor, 1.2);
    // Chile - Argentina Andes boundary
    drawBorderLine([
      [-70, -18], [-68, -24], [-69, -32], [-71, -40], [-73, -50], [-68, -55]
    ], bColor, 1.2);

    // Europe Country Boundaries:
    // France - Spain (Pyrenees)
    drawBorderLine([[-2, 43.4], [0, 42.8], [3.1, 42.4]], bColor, 1.3);
    // France - Germany (Rhine)
    drawBorderLine([[7.5, 49], [8, 48.5], [7.5, 47.6]], bColor, 1.3);
    // Germany - Poland
    drawBorderLine([[14.2, 53.8], [14.6, 52.0], [15.0, 51.0]], bColor, 1.2);
    // Italy alpine border (with France, Switzerland, Austria)
    drawBorderLine([[7.0, 43.5], [6.8, 45.8], [10.5, 46.5], [13.8, 46.5]], bColor, 1.3);
    // Scandinavia: Norway - Sweden
    drawBorderLine([[12, 59], [12.5, 62], [14, 64], [19, 68], [24, 69]], bColor, 1.2);

    // Africa Country Boundaries:
    // Egypt - Sudan (22nd parallel)
    drawBorderLine([[25, 22], [36.9, 22]], bColor, 1.2);
    // Egypt - Libya (25th meridian)
    drawBorderLine([[25, 31.5], [25, 22]], bColor, 1.2);
    // South Africa border
    drawBorderLine([[17, -29], [20, -26], [30, -22.5], [32.5, -27]], bColor, 1.2);

    // Asia Country Boundaries:
    // China - Russia border
    drawBorderLine([[87, 49], [118, 50], [120, 53], [131, 48], [134, 43]], bColor, 1.3);
    // China - Mongolia border
    drawBorderLine([[90, 47], [100, 43], [115, 45], [118, 50]], bColor, 1.2);
    // Korean 38th parallel
    drawBorderLine([[125.8, 38.0], [128.5, 38.6]], bColor, 1.3);

    // Australia State Lines
    drawBorderLine([[129, -15], [129, -32]], 'rgba(255, 255, 255, 0.45)', 1.0);
    drawBorderLine([[138, -16], [138, -38]], 'rgba(255, 255, 255, 0.45)', 1.0);

    // 4. Thin White Graticule Lines (Latitude & Longitude grid)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.lineWidth = 1;

    for (let lat = -75; lat <= 75; lat += 15) {
      const y = ((90 - lat) / 180) * 1024;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(2048, y);
      if (lat === 0) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.6;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
        ctx.lineWidth = 0.9;
      }
      ctx.stroke();
    }

    for (let lng = -180; lng <= 180; lng += 15) {
      const x = ((lng + 180) / 360) * 2048;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      if (lng === 0 || lng === 180 || lng === -180) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.4;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 0.85;
      }
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  },

  init(containerEl) {
    this.container = containerEl;
    this.hasWebGL = this.checkWebGL();

    if (!this.hasWebGL || typeof THREE === 'undefined') {
      this.initFallback();
      return;
    }

    const width = containerEl.clientWidth || 600;
    const height = containerEl.clientHeight || 520;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 2.75;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerEl.innerHTML = '';
    containerEl.appendChild(this.renderer.domElement);

    // Natural even daylight illumination (zero specular glares, zero hot-spot circles)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.98);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.28);
    sunLight.position.set(2, 4, 3);
    this.scene.add(sunLight);

    // 3D Earth Sphere Geometry
    const sphereGeo = new THREE.SphereGeometry(1, 64, 64);
    const atlasTexture = this.createAtlasEarthTexture();

    // MeshLambertMaterial provides smooth, matte diffuse reflection with ZERO shiny glowing circular hot-spots
    const earthMat = new THREE.MeshLambertMaterial({
      map: atlasTexture
    });

    this.earthMesh = new THREE.Mesh(sphereGeo, earthMat);
    this.scene.add(this.earthMesh);

    // Group for single attached 3D Location Pin
    this.pinGroup = new THREE.Group();
    this.earthMesh.add(this.pinGroup);

    // Initial default orientation facing India & show initial location pin
    this.orientToLatLng(20.59, 78.96);
    this.showLocationPin(20.59, 78.96);

    // Animation Loop
    this.animate();

    window.addEventListener('resize', () => this.onResize());
  },

  orientToLatLng(lat, lng) {
    if (!this.earthMesh) return;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    this.earthMesh.rotation.x = phi - Math.PI / 2;
    this.earthMesh.rotation.y = -theta + Math.PI / 2;
  },

  latLngToVector3(lat, lng, radius = 1) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  },

  vector3ToLatLng(vector) {
    const norm = vector.clone().normalize();
    const lat = 90 - (Math.acos(norm.y) * 180 / Math.PI);
    let lng = ((Math.atan2(norm.z, -norm.x) * 180 / Math.PI) - 180);
    while (lng > 180) lng -= 360;
    while (lng < -180) lng += 360;
    return { lat, lng };
  },

  getCurrentCenterCoords() {
    if (!this.earthMesh) return { lat: 20.59, lng: 78.96 };
    const euler = new THREE.Euler(-this.earthMesh.rotation.x, -this.earthMesh.rotation.y, 0, 'YXZ');
    const forward = new THREE.Vector3(0, 0, 1).applyEuler(euler);
    return this.vector3ToLatLng(forward);
  },

  getPinCoords() {
    return this.currentPinCoords || this.getCurrentCenterCoords();
  },

  /**
   * Displays exactly ONE 3D Location Pin attached to the sphere surface.
   * Pin consists of a turquoise/gold needle, sphere top, and ground ring.
   */
  showLocationPin(lat, lng) {
    this.clearLocationPin();
    if (!this.pinGroup) return;

    this.currentPinCoords = { lat, lng };

    const marker = new THREE.Group();
    const pos = this.latLngToVector3(lat, lng, 1.0);

    // Calculate normal rotation so pin points straight out of spherical surface
    const normal = pos.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);

    // Ground target ring
    const ringGeo = new THREE.RingGeometry(0.02, 0.04, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x0f766e, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    marker.add(ringMesh);

    // Needle Stem (Cone)
    const coneGeo = new THREE.ConeGeometry(0.016, 0.08, 16);
    const coneMat = new THREE.MeshLambertMaterial({ color: 0x0f766e });
    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.position.y = 0.04;
    coneMesh.rotation.x = Math.PI; // Point tip down to surface
    marker.add(coneMesh);

    // Pin Head (Gold Sphere)
    const headGeo = new THREE.SphereGeometry(0.034, 16, 16);
    const headMat = new THREE.MeshLambertMaterial({
      color: 0xd6a84f
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.y = 0.085;
    marker.add(headMesh);

    marker.position.copy(pos);
    marker.setRotationFromQuaternion(quaternion);

    this.pinGroup.add(marker);
  },

  clearLocationPin() {
    if (!this.pinGroup) return;
    while (this.pinGroup.children.length > 0) {
      const obj = this.pinGroup.children[0];
      this.pinGroup.remove(obj);
    }
  },

  startFastSpin() {
    this.isSpinning = true;
    this.spinSpeed = 0.075;
  },

  stopSpinDecelerate(targetCountry, onComplete) {
    let speed = this.spinSpeed;
    const step = () => {
      if (speed > 0.008) {
        speed *= 0.94;
        this.earthMesh.rotation.y += speed;
        requestAnimationFrame(step);
      } else {
        this.isSpinning = false;
        if (targetCountry) {
          this.spinToCountry(targetCountry, () => {
            this.showLocationPin(targetCountry.lat, targetCountry.lng);
            if (onComplete) onComplete();
          });
        } else if (onComplete) {
          onComplete();
        }
      }
    };
    requestAnimationFrame(step);
  },

  spinToCountry(country, callback) {
    if (!this.earthMesh || !country) return;
    const phi = (90 - country.lat) * (Math.PI / 180);
    const theta = (country.lng + 180) * (Math.PI / 180);

    const targetX = phi - Math.PI / 2;
    const targetY = -theta + Math.PI / 2;

    this.spinTo(targetX, targetY, 1400, callback);
  },

  spinTo(targetX, targetY, duration = 1400, callback) {
    const startX = this.earthMesh.rotation.x;
    const startY = this.earthMesh.rotation.y;
    const startTime = performance.now();

    const animateSpin = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // Smooth ease-out cubic

      this.earthMesh.rotation.x = startX + (targetX - startX) * ease;
      this.earthMesh.rotation.y = startY + (targetY - startY) * ease;

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else if (callback) {
        callback();
      }
    };
    requestAnimationFrame(animateSpin);
  },

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());

    if (this.earthMesh) {
      if (this.isSpinning) {
        this.earthMesh.rotation.y += this.spinSpeed;
      } else {
        // Slow ambient rotation when idle
        this.earthMesh.rotation.y += 0.0012;
      }
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  },

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  },

  initFallback() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="gh-fallback-earth">
        <div class="gh-fallback-sphere">
          <div class="gh-fallback-grid"></div>
          <div class="gh-fallback-pin">📍</div>
        </div>
      </div>
    `;
  }
};
