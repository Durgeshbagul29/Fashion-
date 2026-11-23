/**
 * Globe Hunter - Country Data Catalog
 * Standardized ISO 3166-1 alpha-2 / alpha-3 catalog with coordinates, aliases, and flags
 */
const COUNTRY_DATA = [
  { name: "India", iso2: "IN", iso3: "IND", lat: 20.5937, lng: 78.9629, flag: "🇮🇳", continent: "Asia", aliases: ["bharat", "hindustan"], tags: ["ethnic", "cotton", "kurti", "printed"] },
  { name: "United States", iso2: "US", iso3: "USA", lat: 37.0902, lng: -95.7129, flag: "🇺🇸", continent: "North America", aliases: ["usa", "america", "united states of america"], tags: ["streetwear", "hoodie", "graphic", "oversized"] },
  { name: "United Kingdom", iso2: "GB", iso3: "GBR", lat: 55.3781, lng: -3.4360, flag: "🇬🇧", continent: "Europe", aliases: ["uk", "britain", "great britain", "england"], tags: ["minimal", "luxury", "hoodie"] },
  { name: "Japan", iso2: "JP", iso3: "JPN", lat: 36.2048, lng: 138.2529, flag: "🇯🇵", continent: "Asia", aliases: ["nippon", "nihon"], tags: ["graphic", "streetwear", "printed", "oversized"] },
  { name: "France", iso2: "FR", iso3: "FRA", lat: 46.2276, lng: 2.2137, flag: "🇫🇷", continent: "Europe", aliases: ["republique francaise"], tags: ["chic", "minimal", "luxury"] },
  { name: "Germany", iso2: "DE", iso3: "DEU", lat: 51.1657, lng: 10.4515, flag: "🇩🇪", continent: "Europe", aliases: ["deutschland"], tags: ["bio-wash", "cotton", "regular"] },
  { name: "Italy", iso2: "IT", iso3: "ITA", lat: 41.8719, lng: 12.5674, flag: "🇮🇹", continent: "Europe", aliases: ["italia"], tags: ["luxury", "chic", "cotton"] },
  { name: "Australia", iso2: "AU", iso3: "AUS", lat: -25.2744, lng: 133.7751, flag: "🇦🇺", continent: "Oceania", aliases: ["oz", "aussie"], tags: ["summer", "casual", "printed"] },
  { name: "Canada", iso2: "CA", iso3: "CAN", lat: 56.1304, lng: -106.3468, flag: "🇨🇦", continent: "North America", aliases: [], tags: ["hoodie", "heavyweight", "fleece"] },
  { name: "Brazil", iso2: "BR", iso3: "BRA", lat: -14.2350, lng: -51.9253, flag: "🇧🇷", continent: "South America", aliases: ["brasil"], tags: ["vibrant", "printed", "casual"] },
  { name: "South Africa", iso2: "ZA", iso3: "ZAF", lat: -30.5595, lng: 22.9375, flag: "🇿🇦", continent: "Africa", aliases: ["rsa"], tags: ["safari", "cotton", "earthy"] },
  { name: "South Korea", iso2: "KR", iso3: "KOR", lat: 35.9078, lng: 127.7669, flag: "🇰🇷", continent: "Asia", aliases: ["korea", "republic of korea"], tags: ["k-pop", "oversized", "streetwear"] },
  { name: "Spain", iso2: "ES", iso3: "ESP", lat: 40.4637, lng: -3.7492, flag: "🇪🇸", continent: "Europe", aliases: ["espana"], tags: ["warm", "casual", "printed"] },
  { name: "United Arab Emirates", iso2: "AE", iso3: "ARE", lat: 23.4241, lng: 53.8478, flag: "🇦🇪", continent: "Asia", aliases: ["uae", "dubai", "emirates"], tags: ["luxury", "gold", "premium"] },
  { name: "Mexico", iso2: "MX", iso3: "MEX", lat: 23.6345, lng: -102.5528, flag: "🇲🇽", continent: "North America", aliases: [], tags: ["vibrant", "graphic", "printed"] },
  { name: "Netherlands", iso2: "NL", iso3: "NLD", lat: 52.1326, lng: 5.2913, flag: "🇳🇱", continent: "Europe", aliases: ["holland"], tags: ["minimal", "cotton"] },
  { name: "Switzerland", iso2: "CH", iso3: "CHE", lat: 46.8182, lng: 8.2275, flag: "🇨🇭", continent: "Europe", aliases: ["swiss"], tags: ["premium", "hoodie", "clean"] },
  { name: "Sweden", iso2: "SE", iso3: "SWE", lat: 60.1282, lng: 18.6435, flag: "🇸🇪", continent: "Europe", aliases: ["sverige"], tags: ["nordic", "minimal", "clean"] },
  { name: "Norway", iso2: "NO", iso3: "NOR", lat: 60.4720, lng: 8.4689, flag: "🇳🇴", continent: "Europe", aliases: ["norge"], tags: ["hoodie", "outdoor", "fleece"] },
  { name: "Denmark", iso2: "DK", iso3: "DNK", lat: 56.2639, lng: 9.5018, flag: "🇩🇰", continent: "Europe", aliases: ["danmark"], tags: ["scandi", "minimal"] },
  { name: "New Zealand", iso2: "NZ", iso3: "NZL", lat: -40.9006, lng: 174.8860, flag: "🇳🇿", continent: "Oceania", aliases: ["kiwi"], tags: ["outdoor", "breathable"] },
  { name: "Singapore", iso2: "SG", iso3: "SGP", lat: 1.3521, lng: 103.8198, flag: "🇸🇬", continent: "Asia", aliases: ["lion city"], tags: ["modern", "urban", "tech"] },
  { name: "Malaysia", iso2: "MY", iso3: "MYS", lat: 4.2105, lng: 101.9758, flag: "🇲🇾", continent: "Asia", aliases: [], tags: ["casual", "cotton"] },
  { name: "Thailand", iso2: "TH", iso3: "THA", lat: 15.8700, lng: 100.9925, flag: "🇹🇭", continent: "Asia", aliases: ["siam"], tags: ["summer", "printed", "vibrant"] },
  { name: "Indonesia", iso2: "ID", iso3: "IDN", lat: -0.7893, lng: 113.9213, flag: "🇮🇩", continent: "Asia", aliases: [], tags: ["batik", "tropical", "kurti"] },
  { name: "Vietnam", iso2: "VN", iso3: "VNM", lat: 14.0583, lng: 108.2772, flag: "🇻🇳", continent: "Asia", aliases: [], tags: ["casual", "cotton"] },
  { name: "Philippines", iso2: "PH", iso3: "PHL", lat: 12.8797, lng: 121.7740, flag: "🇵🇭", continent: "Asia", aliases: [], tags: ["urban", "streetwear"] },
  { name: "Saudi Arabia", iso2: "SA", iso3: "SAU", lat: 23.8859, lng: 45.0792, flag: "🇸🇦", continent: "Asia", aliases: ["ksa"], tags: ["luxury", "cotton"] },
  { name: "Egypt", iso2: "EG", iso3: "EGY", lat: 26.8206, lng: 30.8025, flag: "🇪🇬", continent: "Africa", aliases: ["misr"], tags: ["egyptian cotton", "classic"] },
  { name: "Nigeria", iso2: "NG", iso3: "NGA", lat: 9.0820, lng: 8.6753, flag: "🇳🇬", continent: "Africa", aliases: [], tags: ["bold", "graphic", "printed"] },
  { name: "Kenya", iso2: "KE", iso3: "KEN", lat: -0.0236, lng: 37.9062, flag: "🇰🇪", continent: "Africa", aliases: [], tags: ["safari", "earthy"] },
  { name: "Argentina", iso2: "AR", iso3: "ARG", lat: -38.4161, lng: -63.6167, flag: "🇦🇷", continent: "South America", aliases: [], tags: ["sporty", "casual"] },
  { name: "Chile", iso2: "CL", iso3: "CHL", lat: -35.6751, lng: -71.5430, flag: "🇨🇱", continent: "South America", aliases: [], tags: ["outdoor", "cotton"] },
  { name: "Colombia", iso2: "CO", iso3: "COL", lat: 4.5709, lng: -74.2973, flag: "🇨🇴", continent: "South America", aliases: [], tags: ["vibrant", "cotton"] },
  { name: "Turkey", iso2: "TR", iso3: "TUR", lat: 38.9637, lng: 35.2433, flag: "🇹🇷", continent: "Asia/Europe", aliases: ["turkiye"], tags: ["knitwear", "cotton", "kurti"] },
  { name: "Greece", iso2: "GR", iso3: "GRC", lat: 39.0742, lng: 21.8243, flag: "🇬🇷", continent: "Europe", aliases: ["hellas"], tags: ["white", "minimal", "mediterranean"] },
  { name: "Portugal", iso2: "PT", iso3: "PRT", lat: 39.3999, lng: -8.2245, flag: "🇵🇹", continent: "Europe", aliases: [], tags: ["textile", "cotton", "classic"] },
  { name: "Ireland", iso2: "IE", iso3: "IRL", lat: 53.1424, lng: -7.6921, flag: "🇮🇪", continent: "Europe", aliases: ["eire"], tags: ["hoodie", "knit"] },
  { name: "Poland", iso2: "PL", iso3: "POL", lat: 51.9194, lng: 19.1451, flag: "🇵🇱", continent: "Europe", aliases: ["polska"], tags: ["hoodie", "cotton"] },
  { name: "Russia", iso2: "RU", iso3: "RUS", lat: 61.5240, lng: 105.3188, flag: "🇷🇺", continent: "Europe/Asia", aliases: ["rossiya"], tags: ["heavyweight", "hoodie"] },
  { name: "Morocco", iso2: "MA", iso3: "MAR", lat: 31.7917, lng: -7.0926, flag: "🇲🇦", continent: "Africa", aliases: ["al-maghrib"], tags: ["pattern", "kurti", "cotton"] },
  { name: "Nepal", iso2: "NP", iso3: "NPL", lat: 28.3949, lng: 84.1240, flag: "🇳🇵", continent: "Asia", aliases: [], tags: ["spiritual", "cotton", "hoodie"] },
  { name: "Sri Lanka", iso2: "LK", iso3: "LKA", lat: 7.8731, lng: 80.7718, flag: "🇱🇰", continent: "Asia", aliases: ["ceylon"], tags: ["summer", "cotton", "printed"] },
  { name: "Bangladesh", iso2: "BD", iso3: "BGD", lat: 23.6850, lng: 90.3563, flag: "🇧🇩", continent: "Asia", aliases: [], tags: ["garment", "cotton", "kurti"] }
];

// Helper methods for Country lookup
window.GH_COUNTRY_DATA = {
  all: COUNTRY_DATA,

  getCountryByCode(code) {
    if (!code) return null;
    const clean = code.trim().toUpperCase();
    return COUNTRY_DATA.find(c => c.iso2 === clean || c.iso3 === clean) || null;
  },

  search(query, limit = 8) {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    return COUNTRY_DATA.filter(c => {
      if (c.name.toLowerCase().includes(q)) return true;
      if (c.iso2.toLowerCase() === q || c.iso3.toLowerCase() === q) return true;
      if (c.aliases && c.aliases.some(a => a.toLowerCase().includes(q))) return true;
      return false;
    }).slice(0, limit);
  },

  getRandomCountry() {
    return COUNTRY_DATA[Math.floor(Math.random() * COUNTRY_DATA.length)];
  },

  // Calculate Great Circle distance between two lat/lng pairs in kilometers
  calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }
};
