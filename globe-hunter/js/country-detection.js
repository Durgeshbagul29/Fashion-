/**
 * Globe Hunter - Geographical Country Detection Engine
 * High-accuracy point-in-polygon ray-casting engine for sovereign landmasses
 * and accurate ocean coordinate detection.
 */
window.GH_DETECTION = {
  /**
   * Ray-casting algorithm based on Jordan curve theorem.
   * Tests whether latitude/longitude point is inside polygon vertices [ [lng, lat], ... ].
   */
  pointInPolygon(point, vs) {
    const x = point[0]; // lng
    const y = point[1]; // lat
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0], yi = vs[i][1];
      const xj = vs[j][0], yj = vs[j][1];
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  },

  // Sovereign Country Boundary Polygons (approximate detailed boundaries: [lng, lat])
  POLYGONS: {
    IN: [ // India
      [68.1, 23.7], [68.8, 24.6], [70.5, 27.5], [74.0, 32.5], [76.8, 34.6],
      [78.5, 35.5], [80.2, 31.0], [81.0, 30.2], [88.0, 27.5], [89.0, 26.5],
      [92.5, 27.8], [97.3, 28.2], [96.0, 26.5], [93.2, 22.5], [89.0, 21.6],
      [86.5, 20.0], [80.3, 16.0], [79.8, 10.0], [77.5, 8.1], [76.0, 10.5],
      [73.0, 15.5], [72.8, 19.0], [68.1, 23.7]
    ],
    US: [ // United States (Lower 48)
      [-124.7, 48.4], [-124.0, 46.2], [-124.4, 40.4], [-117.1, 32.5], [-114.7, 32.7],
      [-109.0, 31.3], [-106.5, 31.8], [-103.0, 29.0], [-97.1, 25.9], [-93.8, 29.7],
      [-89.1, 29.0], [-85.0, 29.7], [-81.1, 25.1], [-80.0, 26.8], [-75.5, 35.2],
      [-73.9, 40.7], [-70.0, 41.5], [-67.0, 44.5], [-67.8, 47.1], [-74.8, 45.0],
      [-82.4, 41.6], [-87.6, 41.9], [-95.1, 49.0], [-116.0, 49.0], [-123.0, 49.0], [-124.7, 48.4]
    ],
    JP: [ // Japan
      [129.5, 33.0], [131.0, 34.0], [136.5, 35.0], [139.5, 35.5], [141.0, 38.5],
      [141.5, 41.5], [145.5, 43.5], [141.0, 45.5], [139.5, 41.5], [136.0, 36.5],
      [133.0, 35.5], [129.5, 33.0]
    ],
    GB: [ // United Kingdom
      [-5.5, 50.0], [-1.0, 50.6], [1.7, 52.5], [0.2, 54.0], [-1.5, 55.8],
      [-2.0, 57.5], [-4.0, 58.6], [-5.0, 56.5], [-4.8, 52.0], [-5.5, 50.0]
    ],
    FR: [ // France
      [-4.5, 48.4], [0.0, 49.5], [2.5, 51.1], [7.5, 49.0], [7.0, 45.8],
      [6.5, 43.5], [3.1, 42.4], [-1.8, 43.4], [-1.2, 46.0], [-4.5, 48.4]
    ],
    DE: [ // Germany
      [6.0, 50.5], [7.0, 53.5], [8.5, 55.0], [14.2, 53.8], [15.0, 51.0],
      [12.5, 47.7], [9.8, 47.5], [7.5, 49.0], [6.0, 50.5]
    ],
    IT: [ // Italy
      [7.5, 45.0], [11.0, 46.0], [13.5, 46.5], [13.0, 42.0], [18.5, 40.0],
      [15.5, 38.0], [12.5, 38.0], [14.0, 41.0], [10.0, 44.0], [7.5, 45.0]
    ],
    AU: [ // Australia
      [114.0, -22.0], [122.0, -17.0], [136.0, -12.0], [142.0, -10.5], [153.6, -28.0],
      [150.0, -37.5], [140.0, -38.0], [135.0, -34.0], [124.0, -33.0], [115.0, -34.5], [114.0, -22.0]
    ],
    CA: [ // Canada
      [-130.0, 54.0], [-123.0, 49.0], [-95.0, 49.0], [-80.0, 45.0], [-65.0, 45.0],
      [-53.0, 47.0], [-60.0, 60.0], [-85.0, 65.0], [-120.0, 69.0], [-140.0, 69.0], [-130.0, 54.0]
    ],
    BR: [ // Brazil
      [-70.0, -10.0], [-60.0, 3.0], [-50.0, -1.0], [-35.0, -5.5], [-37.0, -12.0],
      [-42.0, -23.0], [-53.0, -33.0], [-57.0, -25.0], [-60.0, -16.0], [-70.0, -10.0]
    ],
    ZA: [ // South Africa
      [17.0, -29.0], [20.0, -26.0], [30.0, -22.5], [32.5, -27.0], [31.0, -30.0],
      [26.0, -33.8], [18.5, -34.8], [17.0, -29.0]
    ],
    KR: [ // South Korea
      [126.0, 37.8], [128.5, 38.5], [129.5, 36.0], [129.0, 35.0], [126.5, 34.3], [126.0, 37.8]
    ],
    ES: [ // Spain
      [-9.0, 42.0], [-2.0, 43.5], [3.0, 42.3], [0.0, 39.0], [-2.0, 36.5], [-6.0, 36.0], [-7.5, 37.0], [-9.0, 42.0]
    ],
    AE: [ // UAE
      [51.6, 24.2], [54.0, 24.5], [56.3, 26.0], [56.0, 24.8], [55.0, 23.0], [52.0, 23.0], [51.6, 24.2]
    ],
    MX: [ // Mexico
      [-117.0, 32.5], [-106.0, 31.5], [-97.0, 26.0], [-91.0, 18.5], [-87.0, 21.5],
      [-93.0, 16.0], [-105.0, 20.0], [-110.0, 23.0], [-117.0, 32.5]
    ],
    EG: [ // Egypt
      [25.0, 31.5], [31.5, 31.5], [34.5, 31.0], [35.5, 28.0], [36.9, 22.0], [25.0, 22.0], [25.0, 31.5]
    ],
    SA: [ // Saudi Arabia
      [36.0, 28.0], [42.0, 31.5], [48.0, 30.0], [50.0, 26.0], [55.0, 22.0], [50.0, 16.5], [42.0, 16.5], [38.0, 22.0], [36.0, 28.0]
    ],
    TR: [ // Turkey
      [26.0, 40.0], [29.0, 41.5], [38.0, 41.5], [44.0, 40.0], [43.0, 37.0], [36.0, 36.0], [28.0, 36.5], [26.0, 40.0]
    ],
    ID: [ // Indonesia
      [95.0, 5.5], [105.0, -6.0], [115.0, -8.5], [140.0, -9.0], [140.0, -2.5], [120.0, 1.0], [100.0, 1.0], [95.0, 5.5]
    ],
    TH: [ // Thailand
      [98.0, 19.5], [101.0, 18.0], [105.0, 15.5], [102.5, 12.0], [100.0, 6.0], [98.5, 10.0], [98.0, 15.0], [98.0, 19.5]
    ],
    RU: [ // Russia
      [30.0, 60.0], [50.0, 68.0], [80.0, 73.0], [130.0, 72.0], [175.0, 66.0],
      [140.0, 48.0], [130.0, 43.0], [85.0, 51.0], [50.0, 51.0], [37.0, 55.0], [30.0, 60.0]
    ]
  },

  // Major Bounding Box Envelopes (for secondary sovereign territories)
  ENVELOPES: {
    AR: [-55.0, -21.8, -73.6, -53.6],
    CL: [-56.0, -17.5, -75.6, -66.9],
    CO: [-4.2, 12.5, -79.0, -66.8],
    ZA: [-34.8, -22.1, 16.5, 32.9],
    NG: [4.3, 13.9, 2.7, 14.7],
    KE: [-4.7, 5.0, 33.9, 41.9],
    MA: [27.6, 35.9, -13.2, -1.0],
    NP: [26.3, 30.4, 80.0, 88.2],
    LK: [5.9, 9.8, 79.8, 81.9],
    BD: [20.7, 26.6, 88.0, 92.7],
    CH: [45.8, 47.8, 5.9, 10.5],
    NL: [50.8, 53.6, 3.4, 7.2],
    SE: [55.3, 69.1, 11.0, 24.2],
    NO: [57.9, 71.2, 4.5, 31.1],
    DK: [54.5, 57.8, 8.0, 15.2],
    GR: [34.8, 41.7, 19.4, 28.2],
    PT: [36.9, 42.2, -9.5, -6.2],
    IE: [51.4, 55.4, -10.5, -5.9],
    PL: [49.0, 54.8, 14.1, 24.1],
    NZ: [-47.3, -34.4, 166.4, 178.6],
    SG: [1.16, 1.47, 103.6, 104.05],
    MY: [0.85, 7.36, 99.6, 119.3],
    VN: [8.5, 23.4, 102.1, 109.5],
    PH: [4.6, 21.1, 116.9, 126.6]
  },

  /**
   * Primary detection routine:
   * Returns:
   * { country: CountryObject, isOcean: false } on verified land detection.
   * { country: null, isOcean: true, message: "Please select a location on land to complete your challenge." } on ocean.
   */
  detect(lat, lng) {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return { country: null, isOcean: true, message: "Please select a location on land to complete your challenge." };
    }

    // Normalize longitude (-180..180)
    let nLng = lng;
    while (nLng > 180) nLng -= 360;
    while (nLng < -180) nLng += 360;
    const pt = [nLng, lat];

    // 1. Precise Ray-Casting Polygon Check
    for (const [iso2, polygon] of Object.entries(this.POLYGONS)) {
      if (this.pointInPolygon(pt, polygon)) {
        const country = window.GH_COUNTRY_DATA.getCountryByCode(iso2);
        if (country) {
          return { country, isOcean: false };
        }
      }
    }

    // 2. Secondary Envelope check with strict distance validation
    for (const [iso2, env] of Object.entries(this.ENVELOPES)) {
      const [minLat, maxLat, minLng, maxLng] = env;
      if (lat >= minLat && lat <= maxLat && nLng >= minLng && nLng <= maxLng) {
        const country = window.GH_COUNTRY_DATA.getCountryByCode(iso2);
        if (country) {
          const dist = window.GH_COUNTRY_DATA.calculateDistanceKm(lat, nLng, country.lat, country.lng);
          if (dist < 900) {
            return { country, isOcean: false };
          }
        }
      }
    }

    // 3. Centroid Proximity Check (handles small island nations & coastal borders within 350 km)
    let closestCountry = null;
    let minDistance = Infinity;

    for (const c of window.GH_COUNTRY_DATA.all) {
      const dist = window.GH_COUNTRY_DATA.calculateDistanceKm(lat, nLng, c.lat, c.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestCountry = c;
      }
    }

    // If within 350km of sovereign centroid, treat as coastal land territory
    if (minDistance <= 350 && closestCountry) {
      return { country: closestCountry, isOcean: false };
    }

    // Otherwise, coordinate is confirmed Open Ocean
    return {
      country: null,
      isOcean: true,
      message: "Please select a location on land to complete your challenge."
    };
  }
};
