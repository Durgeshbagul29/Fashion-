/**
 * ====================================================================
 *              ABRACADABRA FASHION - STANDARDIZED PRODUCTS CATALOG
 *                        File: js/products.js
 * ====================================================================
 * 
 * Standard Product JSON Structure:
 *   - id             : Unique ID string for URL routing (e.g. 'men-oversized-black-tee')
 *   - name           : Customer-facing product title
 *   - cat            : Main category ('men' | 'women' | 'hoodies' | 'kurtis' | 'custom')
 *   - type           : Sub-type filter tag (e.g. 'Oversized T-Shirts')
 *   - price          : Selling price in ₹ INR
 *   - mrp            : Strikethrough price in ₹ INR
 *   - idealFor       : Target audience ('Men' | 'Women' | 'Both Men & Women (Unisex)')
 *   - rating         : Average decimal rating 0-5 (null if genuine rating unavailable)
 *   - ratingCount    : Total review count (null if genuine count unavailable)
 *   - ratings        : Array of authentic reviews [ { title, desc, count, author, date, helpful } ] (empty if unavailable)
 *   - description    : SEO-friendly, unique product description
 *   - colors         : Array of { name, code, images: [...] } (T-Shirts currently Black, White & Navy Blue)
 *   - h              : Dispatch time in hours
 *   - sizes          : Array of available sizes
 *   - specifications : Category-specific attributes (fabric, neckType, sleeve, idealFor, etc.)
 * ====================================================================
 */

var PRODUCTS = [
  // ==================================================================
  // 1. MEN'S OVERSIZED DROP-SHOULDER T-SHIRT (T-Shirt: Black, White, Navy Blue)
  // ==================================================================
  {
    id: 'men-oversized-black-tee',
    name: 'Oversized Drop-Shoulder T-Shirt',
    cat: 'men',
    type: 'Oversized T-Shirts',
    price: 899,
    mrp: 1299,
    idealFor: 'Both Men & Women (Unisex)',
    rating: null,
    ratingCount: null,
    ratings: [],
    description: 'Premium heavyweight drop-shoulder t-shirt engineered with an effortless relaxed streetwear drape. Crafted from luxury combed bio-washed cotton that delivers breathable comfort, ultra-soft hand feel, and enduring shape retention.',
    colors: [
      {
        name: 'Black',
        code: '#080808',
        images: [
          'assets/nkb-tshirt-002-1.webp',
          'assets/nkb-tshirt-002-5.webp'
        ]
      },
      {
        name: 'White',
        code: '#ffffff',
        images: [
          'assets/nkb-tshirt-002-4.webp',
          'assets/nkb-tshirt-002-3.webp'
        ]
      },
      {
        name: 'Navy Blue',
        code: '#1f2937',
        images: [
          'assets/plain-tee-navy.svg',
          'assets/nkb-tshirt-002-1.webp'
        ]
      }
    ],
    h: 30,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Combed Bio-Wash Cotton',
      neckType: 'Round Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Drop-Shoulder Half Sleeve',
      netQuantity: '1 T-Shirt',
      fit: 'Relaxed Oversized Fit',
      idealFor: 'Both Men & Women (Unisex)',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 2. MEN'S REGULAR FIT COTTON T-SHIRT (T-Shirt: Black, White, Navy Blue)
  // ==================================================================
  {
    id: 'men-regular-white-tee',
    name: 'Regular Fit Cotton T-Shirt',
    cat: 'men',
    type: 'Regular Fit T-Shirts',
    price: 499,
    mrp: 799,
    idealFor: 'Men',
    rating: null,
    ratingCount: null,
    ratings: [],
    description: 'Classic everyday crew-neck t-shirt made with soft, breathable bio-washed cotton. Features reinforced double-stitched hems and a tailored regular silhouette that layers effortlessly under shirts and jackets.',
    colors: [
      {
        name: 'Black',
        code: '#080808',
        images: [
          'assets/nkb-tshirt-003-1.webp',
          'assets/nkb-tshirt-003-3.webp'
        ]
      },
      {
        name: 'White',
        code: '#ffffff',
        images: [
          'assets/nkb-tshirt-003-2.webp',
          'assets/nkb-tshirt-003-5.webp'
        ]
      },
      {
        name: 'Navy Blue',
        code: '#1f2937',
        images: [
          'assets/plain-tee-navy.svg',
          'assets/nkb-tshirt-003-4.webp'
        ]
      }
    ],
    h: 200,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Bio-Wash Cotton',
      neckType: 'Crew Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Half Sleeve',
      netQuantity: '1 T-Shirt',
      fit: 'Regular Fit',
      idealFor: 'Men',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 3. MEN'S GRAPHIC PRINTED T-SHIRT (T-Shirt: Black, White, Navy Blue + Ratings Array)
  // ==================================================================
  {
    id: 'men-printed-graphic-tee',
    name: 'Graphic Printed T-Shirt',
    cat: 'men',
    type: 'Printed T-Shirts',
    price: 649,
    mrp: 999,
    idealFor: 'Both Men & Women (Unisex)',
    rating: 4.5,
    ratingCount: 128,
    ratings: [
      {
        title: 'Exceptional fabric quality & crisp print!',
        desc: 'The combed cotton feels super comfortable and breathable. Print is sharp and intact after multiple washes. Truly premium finish!',
        count: 5.0,
        author: 'Rohan Sharma',
        date: 'Verified Buyer • Nashik',
        helpful: 28
      },
      {
        title: 'Perfect streetwear fit and vibrant colors',
        desc: 'Loved the drape and silhouette. Exactly as shown in the pictures. Double stitching along hems gives great durability.',
        count: 4.5,
        author: 'Divya Kulkarni',
        date: 'Verified Buyer • Pune',
        helpful: 19
      },
      {
        title: 'Great value for money & fast delivery',
        desc: 'Delivered in 2 days in Nashik. Color did not bleed in the first wash. Super soft bio-wash feel!',
        count: 4.0,
        author: 'Amit Patil',
        date: 'Verified Buyer • Mumbai',
        helpful: 14
      }
    ],
    description: 'Premium quality graphic printed T-shirt made with comfortable, breathable fabric. Perfect for everyday casual wear.',
    colors: [
      {
        name: 'Black',
        code: '#080808',
        images: [
          'assets/nkb-tshirt-004-5.webp',
          'assets/nkb-tshirt-004-1.webp'
        ]
      },
      {
        name: 'White',
        code: '#ffffff',
        images: [
          'assets/nkb-tshirt-004-3.webp',
          'assets/nkb-tshirt-004-2.webp'
        ]
      },
      {
        name: 'Navy Blue',
        code: '#1f2937',
        images: [
          'assets/nkb-tshirt-004-6.webp',
          'assets/plain-tee-navy.svg'
        ]
      }
    ],
    h: 40,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Cotton',
      neckType: 'Round Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Half Sleeve',
      netQuantity: '1 T-Shirt',
      printCoverage: 'Front Print',
      idealFor: 'Both Men & Women (Unisex)',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 4. MEN'S PLAIN ESSENTIAL T-SHIRT (T-Shirt: Black, White, Navy Blue)
  // ==================================================================
  {
    id: 'men-plain-tee',
    name: 'Plain Essential T-Shirt',
    cat: 'men',
    type: 'Plain T-Shirts',
    price: 449,
    mrp: 699,
    idealFor: 'Men',
    rating: null,
    ratingCount: null,
    ratings: [],
    description: 'Minimalist solid essential t-shirt tailored from pre-shrunk combed cotton jersey. Lightweight and gentle on skin, making it an indispensable wardrobe foundation for daily layering or smart-casual wear.',
    colors: [
      {
        name: 'Black',
        code: '#080808',
        images: [
          'assets/plain-tee-black.svg'
        ]
      },
      {
        name: 'White',
        code: '#ffffff',
        images: [
          'assets/plain-tee-white.svg'
        ]
      },
      {
        name: 'Navy Blue',
        code: '#1f2937',
        images: [
          'assets/plain-tee-navy.svg'
        ]
      }
    ],
    h: 120,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Combed Cotton',
      neckType: 'Round Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Half Sleeve',
      netQuantity: '1 T-Shirt',
      fit: 'Regular Fit',
      idealFor: 'Men',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 5. MEN'S PREMIUM FLEECE HOODIE
  // ==================================================================
  {
    id: 'men-premium-hoodie',
    name: 'Premium Fleece Hoodie',
    cat: 'hoodies',
    type: 'Hoodies',
    price: 1499,
    mrp: 2199,
    idealFor: 'Men',
    rating: null,
    ratingCount: null,
    ratings: [],
    description: 'Heavyweight winter fleece hoodie with brushed thermal interior lining for superior warmth and coziness. Fitted with a double-layered drawstring hood, ribbed cuffs, and a roomy kangaroo front pocket.',
    colors: [
      {
        name: 'Charcoal Black',
        code: '#080808',
        images: [
          'assets/hoodie1.webp'
        ]
      },
      {
        name: 'Dusty Rose',
        code: '#202020',
        images: [
          'assets/hoodie2.webp',
          'assets/hoodie3.webp'
        ]
      }
    ],
    h: 20,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: 'Cotton-Rich Heavy Fleece',
      neckType: 'Hooded Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Full Sleeve',
      netQuantity: '1 Hoodie',
      pattern: 'Solid with Kangaroo Pocket',
      idealFor: 'Men',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 6. UNISEX OVERSIZED STREET HOODIE
  // ==================================================================
  {
    id: 'unisex-oversized-hoodie',
    name: 'Oversized Street Hoodie',
    cat: 'hoodies',
    type: 'Hoodies',
    price: 1699,
    mrp: 2499,
    idealFor: 'Both Men & Women (Unisex)',
    rating: null,
    ratingCount: null,
    ratings: [],
    description: 'Aesthetic streetwear hoodie with a slouchy, relaxed drop-shoulder cut. Crafted from thick brushed-back fleece for a structured silhouette that holds its boxy shape season after season.',
    colors: [
      {
        name: 'Oatmeal Heather',
        code: '#F8F6F1',
        images: [
          'assets/hoodie3.webp',
          'assets/hoodie2.webp'
        ]
      },
      {
        name: 'Jet Black',
        code: '#080808',
        images: [
          'assets/hoodie1.webp'
        ]
      }
    ],
    h: 60,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: 'Heavyweight Brushed Fleece',
      neckType: 'Hooded Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Drop-Shoulder Full Sleeve',
      netQuantity: '1 Hoodie',
      fit: 'Oversized Street Fit',
      idealFor: 'Both Men & Women (Unisex)',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 7. WOMEN'S OVERSIZED T-SHIRT (T-Shirt: Black, White, Navy Blue)
  // ==================================================================
  {
    id: 'women-oversized-tee',
    name: "Women's Oversized T-Shirt",
    cat: 'women',
    type: 'Oversized T-Shirts',
    price: 849,
    mrp: 1199,
    idealFor: 'Women',
    rating: null,
    ratingCount: null,
    ratings: [],
    description: 'Contemporary relaxed-fit t-shirt designed for women who love breezy streetwear style. Made with ultra-soft bio-washed combed cotton that drapes naturally over denim, cycle shorts, or wide-leg trousers.',
    colors: [
      {
        name: 'Black',
        code: '#080808',
        images: [
          'assets/hero-model-front.webp',
          'assets/plain-tee-black.svg'
        ]
      },
      {
        name: 'White',
        code: '#ffffff',
        images: [
          'assets/hero-model-white-front.webp',
          'assets/plain-tee-white.svg'
        ]
      },
      {
        name: 'Navy Blue',
        code: '#1f2937',
        images: [
          'assets/plain-tee-navy.svg',
          'assets/hero-model-front.webp'
        ]
      }
    ],
    h: 340,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Bio-Wash Combed Cotton',
      neckType: 'Round Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Drop-Shoulder Elbow Sleeve',
      netQuantity: '1 T-Shirt',
      fit: 'Boxy Oversized Fit',
      idealFor: 'Women',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 8. WOMEN'S FITTED T-SHIRT (T-Shirt: Black, White, Navy Blue)
  // ==================================================================
  {
    id: 'women-fitted-tee',
    name: "Women's Fitted T-Shirt",
    cat: 'women',
    type: "Women's T-Shirts",
    price: 549,
    mrp: 799,
    idealFor: 'Women',
    rating: null,
    ratingCount: null,
    ratings: [],
    description: 'Flattering silhouette t-shirt constructed with premium stretch-soft cotton. Cut with clean lines, comfortable side seams, and a versatile crew neckline for effortless everyday dressing.',
    colors: [
      {
        name: 'Black',
        code: '#080808',
        images: [
          'assets/hero-model-front.webp',
          'assets/plain-tee-black.svg'
        ]
      },
      {
        name: 'White',
        code: '#ffffff',
        images: [
          'assets/hero-model-white-front.webp',
          'assets/plain-tee-white.svg'
        ]
      },
      {
        name: 'Navy Blue',
        code: '#1f2937',
        images: [
          'assets/plain-tee-navy.svg',
          'assets/hero-model-front.webp'
        ]
      }
    ],
    h: 10,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Combed Cotton',
      neckType: 'Crew Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Half Sleeve',
      netQuantity: '1 T-Shirt',
      fit: 'Tailored Fitted Silhouette',
      idealFor: 'Women',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 9. WOMEN'S PRINTED SHORT KURTI
  // ==================================================================
  {
    id: 'women-short-kurti-printed',
    name: 'Printed Short Kurti',
    cat: 'kurtis',
    type: 'Printed Kurtis',
    price: 799,
    mrp: 1299,
    idealFor: 'Women',
    rating: null,
    ratingCount: null,
    ratings: [],
    description: 'Graceful printed ethnic short kurti featuring artistic traditional block motifs. Breathable lightweight cotton keeps you cool all day, easily paired with straight pants, palazzos, or casual jeans.',
    colors: [
      {
        name: 'Ruby Maroon',
        code: '#B8322B',
        images: [
          'assets/kurti/kurti1.webp',
          'assets/kurti/kurti2.webp',
          'assets/kurti/kurti3.webp'
        ]
      },
      {
        name: 'Mustard Gold',
        code: '#C69A3A',
        images: [
          'assets/kurti/kurti4.webp',
          'assets/kurti/kurti5.webp',
          'assets/kurti/kurti6.webp'
        ]
      }
    ],
    h: 15,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Breathable Cotton',
      neckType: 'Mandarin V-Notch Collar',
      brand: 'Abracadabra Fashion',
      sleeve: 'Three-Quarter (3/4) Sleeve',
      netQuantity: '1 Kurti',
      length: 'Hip Length (Short Kurti)',
      pattern: 'Ethnic Floral Print',
      idealFor: 'Women',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 10. WOMEN'S CASUAL SHORT KURTI
  // ==================================================================
  {
    id: 'women-short-kurti-casual',
    name: 'Casual Short Kurti',
    cat: 'kurtis',
    type: 'Casual Kurtis',
    price: 749,
    mrp: 1199,
    idealFor: 'Women',
    rating: null,
    ratingCount: null,
    ratings: [],
    description: 'Comfortable contemporary everyday short kurti designed for college, work, and daily outings. Tailored in soft cotton fabric with subtle geometric detailing and side slits for effortless movement.',
    colors: [
      {
        name: 'Ivory Beige',
        code: '#F8F6F1',
        images: [
          'assets/kurti1/kurtip1.webp',
          'assets/kurti1/kurtip2.webp',
          'assets/kurti1/kurtip3.webp'
        ]
      },
      {
        name: 'Charcoal Black',
        code: '#202020',
        images: [
          'assets/kurti1/kurtip4.webp',
          'assets/kurti1/kurtip5.webp',
          'assets/kurti1/kurtip6.webp'
        ]
      }
    ],
    h: 25,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Pure Cotton',
      neckType: 'Round Neck with Notch',
      brand: 'Abracadabra Fashion',
      sleeve: 'Three-Quarter (3/4) Sleeve',
      netQuantity: '1 Kurti',
      length: 'Hip Length',
      pattern: 'Subtle Motif Print',
      idealFor: 'Women',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 11. WOMEN'S COTTON SHORT KURTI
  // ==================================================================
  {
    id: 'women-short-kurti-cotton',
    name: 'Cotton Short Kurti',
    cat: 'kurtis',
    type: 'Short Kurtis',
    price: 699,
    mrp: 1099,
    idealFor: 'Women',
    rating: null,
    ratingCount: null,
    ratings: [],
    description: 'Bright, airy cotton short tunic kurti tailored for superior day-long comfort in warm climates. Features neat contrast yoke accents and a relaxed A-line flare that pairs seamlessly with denim or leggings.',
    colors: [
      {
        name: 'Warm Mustard',
        code: '#E7C875',
        images: [
          'assets/kurti2/kurtip11.webp',
          'assets/kurti2/kurtip12.webp'
        ]
      },
      {
        name: 'Classic Black',
        code: '#080808',
        images: [
          'assets/kurti2/kurtip13.webp',
          'assets/kurti2/kurtip14.webp'
        ]
      }
    ],
    h: 5,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Lightweight Cotton',
      neckType: 'Round Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Three-Quarter (3/4) Sleeve',
      netQuantity: '1 Kurti',
      length: 'Short Tunic Length',
      pattern: 'Geometric Border Print',
      idealFor: 'Women',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 12. CUSTOM PERSONALISED T-SHIRT (T-Shirt: Black, White, Navy Blue)
  // ==================================================================
  {
    id: 'custom-personalised-tee',
    name: 'Personalised T-Shirt',
    cat: 'custom',
    type: 'Personalised T-Shirts',
    price: 699,
    mrp: 899,
    idealFor: 'Both Men & Women (Unisex)',
    rating: null,
    ratingCount: null,
    ratings: [],
    description: 'Customizable DTF printed t-shirt made on our heavyweight bio-washed cotton base. Upload your personal artwork, photos, or custom branding in our 3D design studio for fade-resistant, crack-proof prints.',
    colors: [
      {
        name: 'Black',
        code: '#080808',
        images: [
          'assets/plain-tee-black.svg',
          'assets/nkb-tshirt-004-1.webp'
        ]
      },
      {
        name: 'White',
        code: '#ffffff',
        images: [
          'assets/plain-tee-white.svg',
          'assets/zoom.webp'
        ]
      },
      {
        name: 'Navy Blue',
        code: '#1f2937',
        images: [
          'assets/plain-tee-navy.svg',
          'assets/nkb-tshirt-004-6.webp'
        ]
      }
    ],
    h: 0,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Bio-Wash Combed Cotton',
      neckType: 'Round Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Half Sleeve',
      netQuantity: '1 T-Shirt',
      printCoverage: 'High-Definition Custom DTF Print',
      idealFor: 'Both Men & Women (Unisex)',
      size: 'S, M, L, XL, XXL'
    }
  }
];

// Compatibility alias for existing codebase
var P = PRODUCTS;
if (typeof window !== 'undefined') {
  window.PRODUCTS = PRODUCTS;
  window.P = PRODUCTS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRODUCTS;
}
