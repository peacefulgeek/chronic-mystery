/**
 * Product Catalog — ALL ASINs verified on Amazon (April 2026)
 * 
 * Design: Newspaper broadsheet / Morning Edition
 * Every ASIN in this file has been individually verified to resolve
 * to a real Amazon product page. No generated/fake ASINs.
 * 
 * Affiliate tag: spankyspinola-20
 */

export interface Product {
  name: string;
  asin: string;
  category: string;
  tags: string[];
  softIntro: string;
}

export const AFFILIATE_TAG = 'spankyspinola-20';

export function getAmazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

const SOFT_INTROS = [
  'One option that many people like is',
  'A tool that often helps with this is',
  'Something worth considering might be',
  'For those looking for a simple solution, this works well:',
  'You could also try',
  'A popular choice for situations like this is',
  'Many people in the ME/CFS community have found value in',
  'If you are exploring options, one that comes up often is',
  'A practical option that gets mentioned frequently is',
  'One thing that has helped some people is',
  'Worth looking into if this resonates with you:',
  'A gentle option that many find useful is',
];

export function getRandomSoftIntro(): string {
  return SOFT_INTROS[Math.floor(Math.random() * SOFT_INTROS.length)];
}

/**
 * Master catalog — every ASIN verified via Amazon search results.
 */
export const PRODUCTS: Product[] = [
  // === SUPPLEMENTS (17) ===
  { name: 'Magnesium Glycinate 400mg', asin: 'B07ZD7R4RF', category: 'supplements', tags: ['sleep', 'muscle', 'pain', 'fatigue', 'nervous-system', 'relaxation', 'mineral', 'deficiency'], softIntro: 'A supplement that comes up frequently in sleep discussions is' },
  { name: 'Qunol Ubiquinol CoQ10 200mg', asin: 'B073VK5TP4', category: 'supplements', tags: ['mitochondria', 'energy', 'cellular', 'fatigue', 'ATP', 'antioxidant', 'heart'], softIntro: 'For mitochondrial support, one well-reviewed option is' },
  { name: 'Vitamin D3 + K2 Drops', asin: 'B08CY92YHP', category: 'supplements', tags: ['vitamin-d', 'immune', 'bone', 'housebound', 'sunlight', 'deficiency', 'inflammation'], softIntro: 'Many people with chronic illness are low in vitamin D, and a good option is' },
  { name: 'B-Complex Vitamins', asin: 'B0BTT3JCTF', category: 'supplements', tags: ['methylation', 'MTHFR', 'energy', 'nervous-system', 'fatigue', 'B12', 'brain-fog'], softIntro: 'For B vitamin support, one that works for many people is' },
  { name: 'Dr. Tobias Omega-3 Fish Oil', asin: 'B00CAZAU62', category: 'supplements', tags: ['inflammation', 'brain', 'omega', 'joint', 'heart', 'cognitive', 'mood'], softIntro: 'A high-quality omega-3 that many recommend is' },
  { name: 'Organic Ashwagandha Capsules', asin: 'B06ZYHJYD5', category: 'supplements', tags: ['stress', 'cortisol', 'adaptogen', 'adrenal', 'anxiety', 'HPA-axis', 'burnout'], softIntro: 'For stress and adrenal support, one popular option is' },
  { name: 'Dr. Berg Electrolyte Powder', asin: 'B08HR994NJ', category: 'supplements', tags: ['electrolyte', 'hydration', 'POTS', 'dizziness', 'sodium', 'potassium'], softIntro: 'A sugar-free electrolyte option that works well for POTS is' },
  { name: 'Liquid I.V. Hydration Multiplier', asin: 'B01IT9NLHW', category: 'supplements', tags: ['hydration', 'electrolyte', 'POTS', 'dehydration', 'energy', 'recovery'], softIntro: 'For quick hydration support, many people reach for' },
  { name: 'NewRhythm Probiotics 50 Billion CFU', asin: 'B071DZQLPQ', category: 'supplements', tags: ['gut', 'microbiome', 'digestion', 'immune', 'IBS', 'leaky-gut'], softIntro: 'A well-reviewed probiotic option is' },
  { name: 'Turmeric Curcumin Complex', asin: 'B0973M93TR', category: 'supplements', tags: ['inflammation', 'turmeric', 'curcumin', 'joint', 'pain', 'antioxidant'], softIntro: 'For inflammation support, a well-absorbed curcumin like this is popular:' },
  { name: 'THORNE Iron Bisglycinate 25mg', asin: 'B0797GZDZL', category: 'supplements', tags: ['iron', 'anemia', 'fatigue', 'ferritin', 'blood', 'deficiency', 'energy'], softIntro: 'A gentle iron supplement that minimizes digestive issues is' },
  { name: 'LMNT Electrolyte Powder', asin: 'B07TT8B1JJ', category: 'supplements', tags: ['electrolyte', 'sodium', 'hydration', 'POTS', 'keto', 'mineral'], softIntro: 'A science-backed electrolyte mix that many people like is' },
  { name: 'Jarrow Formulas QH-Absorb Ubiquinol', asin: 'B0013OXABS', category: 'supplements', tags: ['mitochondria', 'CoQ10', 'ubiquinol', 'energy', 'cellular', 'heart'], softIntro: 'For enhanced CoQ10 absorption, one trusted option is' },
  { name: 'Nutricost D-Ribose Powder', asin: 'B00WAJU464', category: 'supplements', tags: ['ATP', 'energy', 'ribose', 'mitochondria', 'cellular-energy', 'fatigue'], softIntro: 'For ATP production support, D-Ribose powder like this is worth trying:' },
  { name: "Doctor's Best Magnesium Glycinate", asin: 'B000BD0RT0', category: 'supplements', tags: ['magnesium', 'sleep', 'muscle', 'nerve', 'chelated', 'relaxation'], softIntro: 'A well-known magnesium option that many people trust is' },
  { name: 'THORNE Vitamin D + K2 Liquid', asin: 'B0038NF8MG', category: 'supplements', tags: ['vitamin-d', 'K2', 'bone', 'immune', 'calcium', 'liquid'], softIntro: 'A premium liquid vitamin D option is' },
  { name: 'Pure Encapsulations B-Complex Plus', asin: 'B00JYFN6DU', category: 'supplements', tags: ['B-vitamins', 'methylated', 'MTHFR', 'energy', 'hypoallergenic'], softIntro: 'For those with sensitivities, a hypoallergenic B-complex like this is ideal:' },

  // === SLEEP (7) ===
  { name: 'YnM Weighted Blanket 15lb', asin: 'B073429DV2', category: 'sleep', tags: ['sleep', 'anxiety', 'insomnia', 'nervous-system', 'deep-pressure', 'calming'], softIntro: 'For those who find pressure calming, something like' },
  { name: 'Sunrise Alarm Clock Light Therapy', asin: 'B08GKNG11D', category: 'sleep', tags: ['sleep', 'circadian', 'light-therapy', 'melatonin', 'SAD', 'morning'], softIntro: 'For circadian rhythm support, many people like' },
  { name: 'Livho Blue Light Blocking Glasses', asin: 'B07W781XWF', category: 'sleep', tags: ['blue-light', 'screen', 'sleep', 'eye-strain', 'circadian', 'evening'], softIntro: 'For evening screen time, blue light glasses like these can help:' },
  { name: 'BEAUTRIP Ergonomic Knee Pillow', asin: 'B07W3B6954', category: 'sleep', tags: ['sleep', 'pain', 'alignment', 'hip', 'side-sleeping', 'spine'], softIntro: 'For side sleepers with pain, a knee pillow like this helps:' },
  { name: 'Magicteam White Noise Machine', asin: 'B07RWRJ4XW', category: 'sleep', tags: ['sleep', 'noise', 'insomnia', 'sound', 'relaxation', 'tinnitus'], softIntro: 'A reliable white noise option is' },
  { name: 'BeHoomi Steam Eye Mask', asin: 'B0B6VV24K5', category: 'sleep', tags: ['sleep', 'eye', 'relaxation', 'headache', 'migraine', 'warmth'], softIntro: 'For winding down before bed, heated eye masks like these are lovely:' },
  { name: 'Adjustable Bed Wedge Pillow', asin: 'B07Y5HBTLP', category: 'sleep', tags: ['sleep', 'acid-reflux', 'GERD', 'elevation', 'breathing', 'POTS'], softIntro: 'For those who need to sleep elevated, something like' },

  // === PAIN RELIEF / MOBILITY (6) ===
  { name: 'Theragun Mini 3rd Gen', asin: 'B0DV7JN7ZD', category: 'pain', tags: ['pain', 'muscle', 'massage', 'tension', 'recovery', 'percussion'], softIntro: 'For muscle tension, a percussion massager like this can help:' },
  { name: 'TENS Unit Muscle Stimulator', asin: 'B08MZ6L3TW', category: 'pain', tags: ['pain', 'TENS', 'nerve', 'muscle', 'electrical-stimulation', 'chronic-pain'], softIntro: 'A TENS unit can be worth exploring for nerve pain, like' },
  { name: 'TriggerPoint Grid Foam Roller', asin: 'B0040EGNIU', category: 'pain', tags: ['pain', 'muscle', 'foam-roller', 'myofascial', 'tension', 'flexibility'], softIntro: 'For gentle myofascial release, a foam roller like this works well:' },
  { name: 'Red Light Therapy Panel', asin: 'B09Z363CSX', category: 'pain', tags: ['pain', 'inflammation', 'red-light', 'photobiomodulation', 'healing', 'cellular'], softIntro: 'Red light therapy is something worth exploring, like' },
  { name: 'Amazon Basics Extra Thick Yoga Mat', asin: 'B01LP0U5X0', category: 'pain', tags: ['yoga', 'stretching', 'exercise', 'gentle-movement', 'flexibility', 'floor'], softIntro: 'For gentle stretching at home, a thick yoga mat like this helps:' },
  { name: 'NAYOYA Acupressure Mat and Pillow', asin: 'B0049Q0P9M', category: 'pain', tags: ['acupressure', 'pain', 'tension', 'endorphin', 'circulation', 'relaxation'], softIntro: 'An acupressure mat is a simple tool that many find helpful:' },

  // === ENVIRONMENT / TOOLS (13) ===
  { name: 'PuroAir HEPA Air Purifier', asin: 'B0998FWTHP', category: 'environment', tags: ['air-quality', 'allergy', 'HEPA', 'chemical-sensitivity', 'mold', 'breathing'], softIntro: 'For cleaner air at home, a medical-grade purifier like this helps:' },
  { name: 'Zacurate Pulse Oximeter', asin: 'B07PQ8WTC4', category: 'environment', tags: ['oxygen', 'monitoring', 'pulse', 'heart-rate', 'pacing', 'vital-signs'], softIntro: 'A pulse oximeter is a practical pacing tool, like' },
  { name: 'Bluelog Shower Chair with Back', asin: 'B0DDV112BX', category: 'environment', tags: ['shower', 'mobility', 'energy-conservation', 'bathing', 'safety', 'accessibility'], softIntro: 'A shower chair can be a game-changer for energy conservation:' },
  { name: 'Hunnidspace Meditation Cushion Set', asin: 'B0D2K8N8NR', category: 'environment', tags: ['meditation', 'mindfulness', 'sitting', 'cushion', 'practice', 'calm'], softIntro: 'For a proper meditation setup, a cushion set like this works well:' },
  { name: 'Sky Organics Epsom Salt 5lb', asin: 'B01KW6CF36', category: 'environment', tags: ['bath', 'magnesium', 'muscle', 'relaxation', 'detox', 'pain', 'recovery'], softIntro: 'Epsom salt baths are a simple comfort, and a good option is' },
  { name: 'InnoGear Essential Oil Diffuser', asin: 'B0BNN3MRJP', category: 'environment', tags: ['aromatherapy', 'essential-oil', 'diffuser', 'relaxation', 'sleep', 'calming'], softIntro: 'A simple diffuser for the bedroom, like' },
  { name: 'Qiguet Collapsible Folding Stool', asin: 'B0CT21Y9DP', category: 'environment', tags: ['mobility', 'portable', 'stool', 'energy-conservation', 'accessibility'], softIntro: 'For energy conservation on the go, a collapsible stool like this helps:' },
  { name: 'DMI Reacher Grabber Tool', asin: 'B0009STNME', category: 'environment', tags: ['mobility', 'reacher', 'grabber', 'energy-conservation', 'accessibility'], softIntro: 'A reacher grabber reduces bending and reaching, like' },
  { name: 'FITRELL Compression Socks 3-Pack', asin: 'B07X8W51BD', category: 'environment', tags: ['POTS', 'circulation', 'compression', 'orthostatic', 'blood-pressure', 'legs'], softIntro: 'For circulation and POTS support, compression socks like these help:' },
  { name: 'Automatic Blood Pressure Monitor', asin: 'B0DP7VS72Z', category: 'environment', tags: ['blood-pressure', 'monitoring', 'POTS', 'orthostatic', 'vital-signs'], softIntro: 'A home blood pressure monitor is practical for tracking, like' },
  { name: 'Konquest Digital Thermometer', asin: 'B077CRN38Z', category: 'environment', tags: ['temperature', 'fever', 'monitoring', 'infection', 'vital-signs'], softIntro: 'A reliable thermometer for health monitoring is' },
  { name: 'Florensi Meditation Cushion Set', asin: 'B093HFSVW5', category: 'environment', tags: ['meditation', 'cushion', 'zafu', 'sitting', 'mindfulness', 'buckwheat'], softIntro: 'For proper meditation posture, a buckwheat cushion like this is ideal:' },
  { name: 'Oura Ring Gen 3 Horizon', asin: 'B0CSRPXCC8', category: 'environment', tags: ['sleep-tracking', 'HRV', 'heart-rate-variability', 'pacing', 'biomarker', 'wearable'], softIntro: 'For sleep and HRV tracking, the Oura Ring is a popular choice:' },
  { name: 'MUSE 2 Brain Sensing Headband', asin: 'B0FG8KSDRL', category: 'environment', tags: ['meditation', 'neurofeedback', 'brain', 'mindfulness', 'biofeedback', 'EEG'], softIntro: 'For real-time meditation feedback, the Muse headband is worth exploring:' },

  // === BOOKS / JOURNALS (7) ===
  { name: 'The Body Keeps the Score', asin: 'B00G3L1C2K', category: 'books', tags: ['trauma', 'body', 'nervous-system', 'PTSD', 'somatic', 'healing', 'psychology'], softIntro: 'A foundational book on trauma and the body is' },
  { name: 'When the Body Says No', asin: 'B08Z9TFKV6', category: 'books', tags: ['stress', 'illness', 'mind-body', 'autoimmune', 'Gabor-Mate', 'hidden-stress'], softIntro: 'For understanding the stress-illness connection, consider' },
  { name: 'Food & Symptom Tracker Journal', asin: 'B08LNN59KX', category: 'books', tags: ['food', 'symptom', 'tracking', 'diary', 'sensitivity', 'elimination-diet', 'pattern'], softIntro: 'For tracking food sensitivities, a dedicated journal like this helps:' },
  { name: 'Allura & Arcia Mindfulness Cards', asin: 'B082P7C6ZL', category: 'books', tags: ['mindfulness', 'meditation', 'cards', 'stress', 'anxiety', 'calm', 'daily'], softIntro: 'For a simple daily mindfulness practice, these cards are lovely:' },
  { name: 'Chronic Pain & Symptom Tracker', asin: 'B0BLY8F7DJ', category: 'books', tags: ['chronic-pain', 'symptom', 'tracking', 'journal', 'pacing', 'flare', 'management'], softIntro: 'A dedicated symptom tracker designed for chronic illness is' },
  { name: 'LEUCHTTURM1917 Dotted Journal', asin: 'B0DJBLX39K', category: 'books', tags: ['journal', 'bullet-journal', 'tracking', 'pacing', 'planning', 'dot-grid'], softIntro: 'The gold standard for symptom tracking and pacing logs is' },
];

/**
 * Find products relevant to an article's topic.
 * Returns products sorted by relevance (most tag matches first).
 */
export function findRelevantProducts(articleTitle: string, articleBody: string, count: number = 3): Product[] {
  const text = (articleTitle + ' ' + articleBody).toLowerCase();

  const scored = PRODUCTS.map(p => {
    let score = 0;
    for (const tag of p.tags) {
      if (text.includes(tag.toLowerCase().replace(/-/g, ' '))) {
        score += 1;
      }
    }
    if (text.includes(p.category)) score += 0.5;
    return { product: p, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(s => s.product);
}

/**
 * Generate an affiliate link with disclosure.
 */
export function affiliateLink(product: Product): string {
  return `<a href="${getAmazonUrl(product.asin)}" target="_blank" rel="nofollow noopener">${product.name}</a> <em>(paid link)</em>`;
}
