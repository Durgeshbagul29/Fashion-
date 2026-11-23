/**
 * Globe Hunter - Interactive Drag, Touch, Click, and Zoom Controls
 * Enables fluid manual interaction, click-to-pin, and touch navigation on desktop & mobile.
 */
window.GH_CONTROLS = {
  isDragging: false,
  hasMoved: false,
  previousMousePosition: { x: 0, y: 0 },
  startPointerPosition: { x: 0, y: 0 },
  zoomLevel: 2.75,

  init(containerEl) {
    if (!containerEl) return;

    // Mouse events
    containerEl.addEventListener('mousedown', (e) => this.onPointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => this.onPointerMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', (e) => this.onPointerUp(e, containerEl));

    // Touch events
    containerEl.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        this.onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length === 1) {
        this.onPointerUp(e.changedTouches[0], containerEl);
      } else {
        this.onPointerUp(e, containerEl);
      }
    });

    // Scroll wheel zoom
    containerEl.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (!window.GH_GLOBE.camera) return;
      this.zoomLevel += e.deltaY * 0.0015;
      this.zoomLevel = Math.max(1.8, Math.min(4.2, this.zoomLevel));
      window.GH_GLOBE.camera.position.z = this.zoomLevel;
    }, { passive: false });
  },

  onPointerDown(x, y) {
    if (window.GH_GLOBE.isSpinning) return;
    this.isDragging = true;
    this.hasMoved = false;
    this.previousMousePosition = { x, y };
    this.startPointerPosition = { x, y };
  },

  onPointerMove(x, y) {
    if (!this.isDragging || !window.GH_GLOBE.earthMesh) return;

    const deltaX = x - this.previousMousePosition.x;
    const deltaY = y - this.previousMousePosition.y;

    if (Math.abs(x - this.startPointerPosition.x) > 4 || Math.abs(y - this.startPointerPosition.y) > 4) {
      this.hasMoved = true;
    }

    const factor = 0.005;
    window.GH_GLOBE.earthMesh.rotation.y += deltaX * factor;
    window.GH_GLOBE.earthMesh.rotation.x += deltaY * factor;

    // Clamp pitch so globe doesn't invert
    window.GH_GLOBE.earthMesh.rotation.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, window.GH_GLOBE.earthMesh.rotation.x));

    this.previousMousePosition = { x, y };

    // In Explore mode, keep pin following center coordinates
    const centerCoords = window.GH_GLOBE.getCurrentCenterCoords();
    if (window.GH_ENGINE && window.GH_ENGINE.state.mode === 'explore') {
      window.GH_GLOBE.showLocationPin(centerCoords.lat, centerCoords.lng);
    }

    if (typeof window.onGlobeRotated === 'function') {
      window.onGlobeRotated(centerCoords);
    }
  },

  onPointerUp(e, containerEl) {
    if (!this.isDragging) return;
    this.isDragging = false;

    // If user clicked without dragging, perform raycast to set pin directly at clicked point
    if (!this.hasMoved && e && containerEl && window.GH_GLOBE.camera && window.GH_GLOBE.earthMesh) {
      const rect = containerEl.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

      const mouse = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, window.GH_GLOBE.camera);
      const intersects = raycaster.intersectObject(window.GH_GLOBE.earthMesh);

      if (intersects.length > 0) {
        // Point in local object space
        const localPoint = window.GH_GLOBE.earthMesh.worldToLocal(intersects[0].point.clone());
        const coords = window.GH_GLOBE.vector3ToLatLng(localPoint);

        window.GH_GLOBE.showLocationPin(coords.lat, coords.lng);

        if (typeof window.onGlobeRotated === 'function') {
          window.onGlobeRotated(coords);
        }
      }
    }
  }
};
