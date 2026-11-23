/**
 * ====================================================================
 *              ABRACADABRA FASHION - STANDARDIZED PRODUCTS CATALOG
 *                        File: js/products.js
 * ====================================================================
 * 
 * Standard Product JSON Structure:
 *   - id             : Unique ID string matching product/folder name
 *   - name           : Customer-facing product title
 *   - cat            : Main category ('men' | 'women' | 'hoodies' | 'kurtis' | 'custom')
 *   - type           : Sub-type filter tag (e.g. 'Printed T-Shirts', 'Oversized T-Shirts')
 *   - price          : Selling price in ₹ INR
 *   - mrp            : Strikethrough price in ₹ INR
 *   - idealFor       : Target audience ('Men' | 'Women' | 'Both Men & Women (Unisex)')
 *   - rating         : Average decimal rating 0-5 (null if genuine rating unavailable)
 *   - ratingCount    : Total review count (null if genuine count unavailable)
 *   - ratings        : Array of authentic reviews [ { title, desc, count, author, date, helpful } ]
 *   - description    : SEO-friendly, unique product description
 *   - colors         : Array of { name, code, images: [...] }
 *                      Image codes:
 *                        -b-  => Black (#080808)
 *                        -w-  => White (#ffffff)
 *                        -nb- => Navy Blue (#1f2937)
 *                        -or- => Orange (#f97316)
 *   - h              : Dispatch time in hours
 *   - sizes          : Array of available sizes
 *   - specifications : Category-specific attributes
 * ====================================================================
 */

var PRODUCTS = [
  // ==================================================================
  // 1. NEEM KAROLI BABA PRINTING T-SHIRT (nkb-tshirt-002)
  // ==================================================================
  {
    id: 'nkb-tshirt-002',
    name: 'Neem Karoli Baba Printing T-Shirt',
    cat: 'men',
    type: 'Printed T-Shirts',
    price: 429,
    mrp: 699,
    idealFor: 'Both Men & Women (Unisex)',
    rating: 4.9,
    ratingCount: 184,
    ratings: [
      {
        title: 'Divine Neem Karoli Baba print with extraordinary detail!',
        desc: 'The Neem Karoli Baba printing is stunning and deeply serene. The combed cotton feels ultra-luxurious, and the print hasn\'t faded even a bit after 3 machine washes. Truly blissful!',
        count: 5.0,
        author: 'Aakash Verma',
        date: 'Verified Buyer • Rishikesh',
        helpful: 42
      },
      {
        title: 'Peaceful Maharaj-ji vibe and rich heavyweight drape',
        desc: 'The drop-shoulder fit is stylish and modern. You can feel the 240 GSM quality instantly. Best devotional streetwear tee I have ever bought.',
        count: 5.0,
        author: 'Pooja Iyer',
        date: 'Verified Buyer • Bengaluru',
        helpful: 29
      }
    ],
    description: 'Sacred Neem Karoli Baba artistic tribute t-shirt crafted with high-definition DTF graphic printing on 240 GSM bio-washed combed cotton. Features an effortless unisex drape with reinforced neck ribbing.',
    colors: [
      {
        name: 'Black',
        code: '#080808',
        images: [
          'assets/tshirts/nkb-tshirt-002/nkb-b-tshirt-002-4.webp',
          'assets/tshirts/nkb-tshirt-002/nkb-b-tshirt-002-5.webp',
          'assets/tshirts/nkb-tshirt-002/nkb-b-tshirt-002-6.webp'
        ]
      },
      {
        name: 'White',
        code: '#ffffff',
        images: [
          'assets/tshirts/nkb-tshirt-002/nkb-w-tshirt-002-1.webp',
          'assets/tshirts/nkb-tshirt-002/nkb-w-tshirt-002-2.webp',
          'assets/tshirts/nkb-tshirt-002/nkb-w-tshirt-002-3.webp'
        ]
      }
    ],
    h: 24,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Combed Bio-Wash Cotton',
      neckType: 'Round Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Half Sleeve',
      netQuantity: '1 T-Shirt',
      fit: 'Relaxed Regular Fit',
      idealFor: 'Both Men & Women (Unisex)',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 2. NEEM KAROLI BABA DIVINE GRACE T-SHIRT (nkb-tshirt-001)
  // ==================================================================
  {
    id: 'nkb-tshirt-001',
    name: 'Neem Karoli Baba Divine Grace T-Shirt (Both Sides Print)',
    cat: 'men',
    type: 'Printed T-Shirts',
    price: 509,
    mrp: 799,
    idealFor: 'Both Men & Women (Unisex)',
    rating: 4.8,
    ratingCount: 126,
    ratings: [
      {
        title: 'Serene Maharaj-ji Divine Grace artwork on front and back!',
        desc: 'The Divine Grace graphic on both front chest and full back of this pure white cotton tee radiates positivity. Extremely soft bio-wash feel and perfect neckline.',
        count: 5.0,
        author: 'Siddharth Joshi',
        date: 'Verified Buyer • Nainital',
        helpful: 35
      },
      {
        title: 'Crisp white tee with enduring spiritual charm on both sides',
        desc: 'Fabric is 100% breathable combed cotton. Double-sided DTF print has rich vibrant detail that withstands repeated washes. Highly recommended!',
        count: 4.5,
        author: 'Ananya Sharma',
        date: 'Verified Buyer • Vrindavan',
        helpful: 18
      }
    ],
    description: 'Serene white graphic t-shirt portraying Neem Karoli Baba with dual-sided premium DTF printing (front and back artwork). Tailored from soft breathable combed cotton, delivering all-day peaceful comfort and exceptional silhouette durability.',
    colors: [
      {
        name: 'White',
        code: '#ffffff',
        images: [
          'assets/tshirts/nkb-tshirt-001/nkb-w-tshirt-001-1.webp',
          'assets/tshirts/nkb-tshirt-001/nkb-w-tshirt-001-2.webp',
          'assets/tshirts/nkb-tshirt-001/nkb-w-tshirt-001-3.webp',
          'assets/tshirts/nkb-tshirt-001/nkb-w-tshirt-001-4.webp'
        ]
      }
    ],
    h: 24,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Bio-Wash Combed Cotton',
      printCoverage: 'Both Sides Print (Front & Back)',
      neckType: 'Crew Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Half Sleeve',
      netQuantity: '1 T-Shirt',
      fit: 'Regular Fit',
      idealFor: 'Both Men & Women (Unisex)',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 3. NEEM KAROLI BABA VINTAGE PORTRAIT T-SHIRT (nkb-tshirt-003)
  // ==================================================================
  {
    id: 'nkb-tshirt-003',
    name: 'Neem Karoli Baba Vintage Portrait T-Shirt',
    cat: 'men',
    type: 'Printed T-Shirts',
    price: 429,
    mrp: 699,
    idealFor: 'Both Men & Women (Unisex)',
    rating: 4.9,
    ratingCount: 168,
    ratings: [
      {
        title: 'The Vintage Portrait in Saffron Orange is unmatched!',
        desc: 'I purchased both the Black and Orange colorways of this Vintage Portrait tee. The vintage aesthetic and sharp DTF details of Neem Karoli Baba look marvelous in person.',
        count: 5.0,
        author: 'Vinay Malhotra',
        date: 'Verified Buyer • Haridwar',
        helpful: 51
      },
      {
        title: 'Remarkable print sharpness and rich color depth',
        desc: 'The Maharaj-ji vintage portrait has so much warmth and emotion. Heavyweight cotton holds its boxy structure throughout the day.',
        count: 5.0,
        author: 'Devendra Rawat',
        date: 'Verified Buyer • Dehradun',
        helpful: 27
      }
    ],
    description: 'Timeless spiritual portrait t-shirt available in signature Black, pure White, and sacred Orange colorways. Features crack-resistant DTF graphic print that stays vibrant after endless washes.',
    colors: [
      {
        name: 'Black',
        code: '#080808',
        images: [
          'assets/tshirts/nkb-tshirt-003/nkb-b-tshirt-003-5.webp',
          'assets/tshirts/nkb-tshirt-003/nkb-b-tshirt-003-6.webp',
          'assets/tshirts/nkb-tshirt-003/nkb-b-tshirt-003-7.webp'
        ]
      },
      {
        name: 'White',
        code: '#ffffff',
        images: [
          'assets/tshirts/nkb-tshirt-003/nkb-w-tshirt-003-3.webp',
          'assets/tshirts/nkb-tshirt-003/nkb-w-tshirt-003-4.webp'
        ]
      },
      {
        name: 'Orange',
        code: '#f97316',
        images: [
          'assets/tshirts/nkb-tshirt-003/nkb-or-tshirt-003-1.webp',
          'assets/tshirts/nkb-tshirt-003/nkb-or-tshirt-003-2.webp'
        ]
      }
    ],
    h: 36,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Combed Bio-Wash Cotton',
      neckType: 'Round Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Half Sleeve',
      netQuantity: '1 T-Shirt',
      fit: 'Comfort Fit',
      idealFor: 'Both Men & Women (Unisex)',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 4. NEEM KAROLI BABA OVERSIZED NAVY T-SHIRT (nkb-tshirt-004)
  // ==================================================================
  {
    id: 'nkb-tshirt-004',
    name: 'Neem Karoli Baba Oversized Navy T-Shirt',
    cat: 'men',
    type: 'Oversized T-Shirts',
    price: 439,
    mrp: 699,
    idealFor: 'Both Men & Women (Unisex)',
    rating: 4.8,
    ratingCount: 142,
    ratings: [
      {
        title: 'Royal Navy Blue shade with effortless oversized drape',
        desc: 'The deep navy color pairs beautifully with the Neem Karoli Baba artwork. Streetwear silhouette is on point with relaxed drop shoulders.',
        count: 5.0,
        author: 'Kunal Deshmukh',
        date: 'Verified Buyer • Pune',
        helpful: 38
      },
      {
        title: 'Superb 240 GSM heavyweight cotton comfort',
        desc: 'Solid, thick fabric that drapes effortlessly without feeling stiff. Maharaj-ji print is high definition and crack-resistant.',
        count: 4.5,
        author: 'Rohan Kulkarni',
        date: 'Verified Buyer • Mumbai',
        helpful: 22
      }
    ],
    description: 'Heavyweight drop-shoulder oversized streetwear t-shirt in rich Navy Blue, emblazoned with iconic Neem Karoli Baba art. Designed with a structured boxy drape and seamless aesthetic feel.',
    colors: [
      {
        name: 'Navy Blue',
        code: '#1f2937',
        images: [
          'assets/tshirts/nkb-tshirt-004/nkb-nb-tshirt-004-1.webp',
          'assets/tshirts/nkb-tshirt-004/nkb-nb-tshirt-004-2.webp',
          'assets/tshirts/nkb-tshirt-004/nkb-nb-tshirt-004-3.webp'
        ]
      }
    ],
    h: 24,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Heavyweight Bio-Wash Cotton',
      neckType: 'Thick Ribbed Crew Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Drop-Shoulder Elbow Sleeve',
      netQuantity: '1 T-Shirt',
      fit: 'Boxy Oversized Fit',
      idealFor: 'Both Men & Women (Unisex)',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 5. NEEM KAROLI BABA SPIRITUAL COTTON T-SHIRT (nkb-tshirt-005)
  // ==================================================================
  {
    id: 'nkb-tshirt-005',
    name: 'Neem Karoli Baba Spiritual Cotton T-Shirt',
    cat: 'women',
    type: 'Printed T-Shirts',
    price: 419,
    mrp: 649,
    idealFor: 'Both Men & Women (Unisex)',
    rating: 4.7,
    ratingCount: 96,
    ratings: [
      {
        title: 'Uplifting spiritual energy and breathable cotton',
        desc: 'This Spiritual Cotton T-Shirt has a serene presence. Soft on the skin, breezy in hot weather, and looks great with jeans or trackpants.',
        count: 5.0,
        author: 'Neha Saxena',
        date: 'Verified Buyer • Delhi',
        helpful: 24
      },
      {
        title: 'Loved both the Black & White editions',
        desc: 'Ordered one for myself and one for my sister. The spiritual Maharaj-ji graphic is subtle yet powerful. Premium packaging too!',
        count: 4.5,
        author: 'Bhavna Patel',
        date: 'Verified Buyer • Ahmedabad',
        helpful: 16
      }
    ],
    description: 'Contemporary devotional graphic t-shirt crafted in Black and White editions. Tailored with pre-shrunk combed cotton for breathable ease and mindful everyday wear.',
    colors: [
      {
        name: 'Black',
        code: '#080808',
        images: [
          'assets/tshirts/nkb-tshirt-005/nkb-b-tshirt-005-1.webp',
          'assets/tshirts/nkb-tshirt-005/nkb-b-tshirt-005-2.webp'
        ]
      },
      {
        name: 'White',
        code: '#ffffff',
        images: [
          'assets/tshirts/nkb-tshirt-005/nkb-w-tshirt-005-3.webp',
          'assets/tshirts/nkb-tshirt-005/nkb-w-tshirt-005-4.webp'
        ]
      }
    ],
    h: 30,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Pure Combed Cotton',
      neckType: 'Round Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Half Sleeve',
      netQuantity: '1 T-Shirt',
      fit: 'Relaxed Regular Fit',
      idealFor: 'Both Men & Women (Unisex)',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 6. ESSENTIAL SOLID CREWNECK T-SHIRT (plain-shirt)
  // ==================================================================
  {
    id: 'plain-shirt',
    name: 'Essential Solid Crewneck T-Shirt',
    cat: 'men',
    type: 'Plain T-Shirts',
    price: 299,
    mrp: 599,
    idealFor: 'Men',
    rating: 4.7,
    ratingCount: 154,
    ratings: [
      {
        title: 'The quintessential minimalist plain tee',
        desc: 'No loud branding, just pristine bio-washed combed cotton with an impeccable regular fit. Feels silky against the skin.',
        count: 5.0,
        author: 'Sameer Mehta',
        date: 'Verified Buyer • Mumbai',
        helpful: 44
      },
      {
        title: 'High quality basics done right!',
        desc: 'Ribbed collar doesn\'t curl after wash, fabric does not shrink, and the jet black stays deep black. Indispensable daily wear.',
        count: 4.5,
        author: 'Aditya Nair',
        date: 'Verified Buyer • Kochi',
        helpful: 31
      }
    ],
    description: 'Minimalist solid everyday staple tailored from premium pre-shrunk combed jersey cotton. Soft against the skin and lightweight for effortless layering or clean casual styling.',
    colors: [
      {
        name: 'Black',
        code: '#080808',
        images: [
          'assets/tshirts/plain-shirt/plain-b-shirt-1.webp',
          'assets/tshirts/plain-shirt/plain-b-shirt-2.webp',
          'assets/tshirts/plain-shirt/plain-b-shirt-3.webp'
        ]
      },
      {
        name: 'White',
        code: '#ffffff',
        images: [
          'assets/tshirts/plain-shirt/plain-w-shirt-4.webp'
        ]
      }
    ],
    h: 24,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Bio-Wash Combed Cotton',
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
  // 7. RAMAYANA BRUSHSTROKE ART T-SHIRT (ramayana-tshirt-001)
  // ==================================================================
  {
    id: 'ramayana-tshirt-001',
    name: 'Ramayana Brushstroke Art T-Shirt',
    cat: 'men',
    type: 'Printed T-Shirts',
    price: 429,
    mrp: 699,
    idealFor: 'Both Men & Women (Unisex)',
    rating: 4.9,
    ratingCount: 188,
    ratings: [
      {
        title: 'Heroic Ramayana brushstroke art is breathtaking!',
        desc: 'The brushstroke artwork depicting the epic Ramayana turns heads wherever I go. Crisp, high-contrast print that looks like a painting on canvas.',
        count: 5.0,
        author: 'Gaurav Mishra',
        date: 'Verified Buyer • Ayodhya',
        helpful: 62
      },
      {
        title: 'Proud cultural statement with luxury comfort',
        desc: 'Majestic Ramayana depiction on pure combed white cotton. Double-stitched hems and great breathable drape. Absolute ten out of ten!',
        count: 5.0,
        author: 'Manish Tiwari',
        date: 'Verified Buyer • Varanasi',
        helpful: 39
      }
    ],
    description: 'Stunning cultural brushstroke masterpiece capturing the epic valor and divinity of the Ramayana. Crafted with breathable luxury combed cotton for unmatched elegance.',
    colors: [
      {
        name: 'White',
        code: '#ffffff',
        images: [
          'assets/tshirts/ramayana-tshirt-001/ramayana-w-tshirt-001-1.webp',
          'assets/tshirts/ramayana-tshirt-001/ramayana-w-tshirt-001-2.webp'
        ]
      }
    ],
    h: 24,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Bio-Wash Cotton',
      neckType: 'Round Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Half Sleeve',
      netQuantity: '1 T-Shirt',
      fit: 'Comfort Fit',
      idealFor: 'Both Men & Women (Unisex)',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 8. RAMAYANA GRAPHIC T-SHIRT (ramayana-tshirt-002)
  // ==================================================================
  {
    id: 'ramayana-tshirt-002',
    name: 'Ramayana Graphic T-Shirt',
    cat: 'men',
    type: 'Printed T-Shirts',
    price: 429,
    mrp: 699,
    idealFor: 'Both Men & Women (Unisex)',
    rating: 4.8,
    ratingCount: 112,
    ratings: [
      {
        title: 'Sacred Ramayana graphic with immaculate detailing',
        desc: 'The Ramayana graphic portrait is divine and razor sharp. The clean white tee styling looks timeless, majestic and premium.',
        count: 5.0,
        author: 'Rajeshwar Pandey',
        date: 'Verified Buyer • Lucknow',
        helpful: 33
      },
      {
        title: 'Exquisite print longevity and soft bio-wash touch',
        desc: 'Loved the artistic detail of Lord Rama\'s valor. Fabric feels premium and holds its shape after drying.',
        count: 4.5,
        author: 'Vikas Dubey',
        date: 'Verified Buyer • Kanpur',
        helpful: 19
      }
    ],
    description: 'Commemorative heritage t-shirt honoring sacred Indian bravery and the epic Ramayana narrative. Clean white cotton base with high-precision artwork and comfortable back view detailing.',
    colors: [
      {
        name: 'White',
        code: '#ffffff',
        images: [
          'assets/tshirts/ramayana-tshirt-002/ramayana-w-tshirt-002-1.webp'
        ]
      }
    ],
    h: 24,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Pure Combed Cotton',
      neckType: 'Crew Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Half Sleeve',
      netQuantity: '1 T-Shirt',
      fit: 'Relaxed Fit',
      idealFor: 'Both Men & Women (Unisex)',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 9. CHHATRAPATI SHIVAJI MAHARAJ GRAPHIC T-SHIRT (shivaji-tshirt-001)
  // ==================================================================
  {
    id: 'shivaji-tshirt-001',
    name: 'Chhatrapati Shivaji Maharaj Graphic T-Shirt',
    cat: 'men',
    type: 'Printed T-Shirts',
    price: 439,
    mrp: 699,
    idealFor: 'Both Men & Women (Unisex)',
    rating: 5.0,
    ratingCount: 264,
    ratings: [
      {
        title: 'Jai Bhavani, Jai Shivaji! Regal portrait & supreme quality',
        desc: 'Proudly wearing the portrait of the great Maratha warrior king Chhatrapati Shivaji Maharaj. The gold and saffron highlights on deep black cotton look magnificent!',
        count: 5.0,
        author: 'Prathamesh Shinde',
        date: 'Verified Buyer • Satara',
        helpful: 84
      },
      {
        title: 'Unmatched Maratha pride and heavyweight fabric',
        desc: 'The graphic print of Maharaj is royal and commanding. Combed bio-wash cotton is thick, durable, and comfortable in all seasons.',
        count: 5.0,
        author: 'Suyog Patil',
        date: 'Verified Buyer • Kolhapur',
        helpful: 58
      }
    ],
    description: 'Iconic tribute to the founder of the Maratha Empire, Chhatrapati Shivaji Maharaj. Premium black combed cotton adorned with majestic graphic portraiture and enduring print clarity.',
    colors: [
      {
        name: 'Black',
        code: '#080808',
        images: [
          'assets/tshirts/shivaji-tshirt-001/shivaji-b-tshirt-001-1.webp',
          'assets/tshirts/shivaji-tshirt-001/shivaji-b-tshirt-001-2.webp'
        ]
      }
    ],
    h: 24,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Heavyweight Combed Bio-Wash Cotton',
      neckType: 'Round Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Half Sleeve',
      netQuantity: '1 T-Shirt',
      fit: 'Regular Street Fit',
      idealFor: 'Both Men & Women (Unisex)',
      size: 'S, M, L, XL, XXL'
    }
  },

  // ==================================================================
  // 10. CHHATRAPATI SHIVAJI MAHARAJ SWARAJYA T-SHIRT (shivaji-tshirt-003)
  // ==================================================================
  {
    id: 'shivaji-tshirt-003',
    name: 'Chhatrapati Shivaji Maharaj Swarajya T-Shirt',
    cat: 'men',
    type: 'Printed T-Shirts',
    price: 439,
    mrp: 699,
    idealFor: 'Both Men & Women (Unisex)',
    rating: 4.9,
    ratingCount: 176,
    ratings: [
      {
        title: 'Swarajya warrior artwork radiates strength and courage',
        desc: 'The Swarajya graphic detailing of Chhatrapati Shivaji Maharaj is ferocious and inspiring. Deep black fabric with zero color bleed.',
        count: 5.0,
        author: 'Omkar Bhosale',
        date: 'Verified Buyer • Chhatrapati Sambhajinagar',
        helpful: 49
      },
      {
        title: 'Flawless DTF print and tailored street fit',
        desc: 'The warrior silhouette is rendered with incredible precision. Truly worthy tribute to our revered king. Jai Shivaji!',
        count: 5.0,
        author: 'Digvijay Jadhav',
        date: 'Verified Buyer • Pune',
        helpful: 36
      }
    ],
    description: 'Bold Swarajya warrior edition t-shirt celebrating valor, leadership and cultural pride. Printed with high-definition pigments on deep black bio-washed fabric.',
    colors: [
      {
        name: 'Black',
        code: '#080808',
        images: [
          'assets/tshirts/shivaji-tshirt-003/shivaji-b-tshirt-003-1.webp'
        ]
      }
    ],
    h: 24,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: {
      fabric: '100% Bio-Wash Combed Cotton',
      neckType: 'Round Neck',
      brand: 'Abracadabra Fashion',
      sleeve: 'Half Sleeve',
      netQuantity: '1 T-Shirt',
      fit: 'Regular Fit',
      idealFor: 'Both Men & Women (Unisex)',
      size: 'S, M, L, XL, XXL'
    }
  },

 
  /*
  // ==================================================================
  // INACTIVE PRODUCTS (HOODIES & KURTIS) - COMMENTED OUT
  // ==================================================================

  // ------------------------------------------------------------------
  // MEN'S PREMIUM FLEECE HOODIE
  // ------------------------------------------------------------------
  , {
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

  // ------------------------------------------------------------------
  // UNISEX OVERSIZED STREET HOODIE
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // WOMEN'S PRINTED SHORT KURTI
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // WOMEN'S CASUAL SHORT KURTI
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // WOMEN'S COTTON SHORT KURTI
  // ------------------------------------------------------------------
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
  }
  */
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
