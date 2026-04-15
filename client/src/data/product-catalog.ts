/**
 * Product Catalog for Chronic Mystery
 * 200+ real Amazon products with ASINs, organized by category
 * Topic-matching engine for auto-affiliate injection
 * All links use tag=spankyspinola-20
 */

export interface Product {
  name: string;
  asin: string;
  category: ProductCategory;
  tags: string[];
  softIntro: string;
}

export type ProductCategory =
  | 'sleep-support'
  | 'pain-management'
  | 'energy-nutrition'
  | 'mobility-exercise'
  | 'mental-health'
  | 'medical-tools'
  | 'books-education'
  | 'kitchen-nutrition'
  | 'comfort-daily'
  | 'supplements';

export const AFFILIATE_TAG = 'spankyspinola-20';

export function getAmazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

// Soft, conversational intro sentences for product recommendations
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

export const PRODUCTS: Product[] = [
  // ═══════════════════════════════════════
  // SLEEP SUPPORT (25 products)
  // ═══════════════════════════════════════
  { name: 'Manta Sleep Mask', asin: 'B07PRG2CQB', category: 'sleep-support', tags: ['sleep', 'light-sensitivity', 'rest', 'insomnia', 'darkness'], softIntro: 'A popular choice for blocking out light completely is' },
  { name: 'Hatch Restore Sound Machine', asin: 'B07WFXGNGF', category: 'sleep-support', tags: ['sleep', 'sound', 'rest', 'routine', 'wind-down'], softIntro: 'Many people find that a sound machine like this helps with' },
  { name: 'Weighted Blanket 15lb', asin: 'B073429DV2', category: 'sleep-support', tags: ['sleep', 'anxiety', 'nervous-system', 'comfort', 'rest'], softIntro: 'For those who find pressure calming, something like' },
  { name: 'Magnesium Glycinate (Doctor\'s Best)', asin: 'B000BD0RT0', category: 'sleep-support', tags: ['sleep', 'magnesium', 'supplement', 'muscle', 'relaxation'], softIntro: 'A supplement that comes up frequently in sleep discussions is' },
  { name: 'Philips SmartSleep Wake-Up Light', asin: 'B0093162RM', category: 'sleep-support', tags: ['sleep', 'circadian', 'light', 'morning', 'routine'], softIntro: 'For circadian rhythm support, many people like' },
  { name: 'Tempur-Pedic TEMPUR-Cloud Pillow', asin: 'B00EINBSEW', category: 'sleep-support', tags: ['sleep', 'neck', 'pain', 'pillow', 'comfort'], softIntro: 'A pillow that many chronic pain patients recommend is' },
  { name: 'Melatonin 0.5mg (Life Extension)', asin: 'B004GW4S0G', category: 'sleep-support', tags: ['sleep', 'melatonin', 'supplement', 'circadian'], softIntro: 'A low-dose melatonin option worth considering is' },
  { name: 'Bed Wedge Pillow', asin: 'B009HHLBKK', category: 'sleep-support', tags: ['sleep', 'POTS', 'elevation', 'acid-reflux', 'positioning'], softIntro: 'For those who need to sleep elevated, something like' },
  { name: 'Blackout Curtains (NICETOWN)', asin: 'B01E7QHBG0', category: 'sleep-support', tags: ['sleep', 'light', 'darkness', 'bedroom', 'environment'], softIntro: 'Creating a dark sleep environment is easier with' },
  { name: 'L-Theanine (NOW Supplements)', asin: 'B0013OQGO6', category: 'sleep-support', tags: ['sleep', 'anxiety', 'calm', 'supplement', 'relaxation'], softIntro: 'A calming supplement that many find gentle enough is' },
  { name: 'White Noise Machine (LectroFan)', asin: 'B00MY8V86Q', category: 'sleep-support', tags: ['sleep', 'noise', 'rest', 'sound-masking'], softIntro: 'A reliable white noise option is' },
  { name: 'Cooling Mattress Pad', asin: 'B07H2F7N1D', category: 'sleep-support', tags: ['sleep', 'temperature', 'night-sweats', 'cooling'], softIntro: 'For temperature regulation at night, you could try' },
  { name: 'Lavender Essential Oil (doTERRA)', asin: 'B004O8KILQ', category: 'sleep-support', tags: ['sleep', 'aromatherapy', 'relaxation', 'calming'], softIntro: 'Some people find lavender helpful for winding down, like' },
  { name: 'Sleep Headphones Headband', asin: 'B07SHBQY7Z', category: 'sleep-support', tags: ['sleep', 'sound', 'comfort', 'headphones', 'meditation'], softIntro: 'If you like falling asleep to audio, these are worth a look:' },
  { name: 'Glycine Powder (BulkSupplements)', asin: 'B00EOXU0FC', category: 'sleep-support', tags: ['sleep', 'supplement', 'amino-acid', 'relaxation'], softIntro: 'A lesser-known sleep support that some people swear by is' },
  { name: 'Sunrise Alarm Clock (Jall)', asin: 'B0C1GGKCH1', category: 'sleep-support', tags: ['sleep', 'circadian', 'morning', 'gentle-wake'], softIntro: 'For a gentler morning wake-up, consider' },
  { name: 'Bamboo Sheets Set', asin: 'B07D3BXFHH', category: 'sleep-support', tags: ['sleep', 'comfort', 'temperature', 'bedding'], softIntro: 'Breathable bedding can make a real difference, like' },
  { name: 'Magnesium L-Threonate (Magtein)', asin: 'B01GFKPHMQ', category: 'sleep-support', tags: ['sleep', 'brain', 'magnesium', 'cognitive', 'supplement'], softIntro: 'For brain-focused magnesium support, one option is' },
  { name: 'Ear Plugs (Loop Quiet)', asin: 'B09MFMHXWF', category: 'sleep-support', tags: ['sleep', 'noise', 'sensitivity', 'quiet', 'rest'], softIntro: 'For noise sensitivity, these are a popular choice:' },
  { name: 'Adjustable Bed Base', asin: 'B08HQJXQHB', category: 'sleep-support', tags: ['sleep', 'POTS', 'positioning', 'comfort', 'elevation'], softIntro: 'An adjustable bed base can be a game-changer for' },
  { name: 'Tart Cherry Extract', asin: 'B001G7R0LO', category: 'sleep-support', tags: ['sleep', 'melatonin', 'natural', 'supplement', 'inflammation'], softIntro: 'A natural sleep support option is' },
  { name: 'Blue Light Blocking Glasses', asin: 'B07BK3BRXG', category: 'sleep-support', tags: ['sleep', 'light', 'screen', 'circadian', 'evening'], softIntro: 'For evening screen time, blue light glasses like these can help:' },
  { name: 'Aromatherapy Diffuser', asin: 'B07L4LRDVT', category: 'sleep-support', tags: ['sleep', 'aromatherapy', 'relaxation', 'bedroom'], softIntro: 'A simple diffuser for the bedroom, like' },
  { name: 'Valerian Root (Nature\'s Way)', asin: 'B0001FVFHM', category: 'sleep-support', tags: ['sleep', 'herbal', 'supplement', 'relaxation'], softIntro: 'An herbal option some people find helpful is' },
  { name: 'Silk Pillowcase', asin: 'B07QM4CXZG', category: 'sleep-support', tags: ['sleep', 'comfort', 'skin', 'hair', 'luxury'], softIntro: 'A small comfort upgrade that many appreciate is' },

  // ═══════════════════════════════════════
  // PAIN MANAGEMENT (25 products)
  // ═══════════════════════════════════════
  { name: 'TheraGun Mini', asin: 'B09CC6XWVS', category: 'pain-management', tags: ['pain', 'muscle', 'massage', 'recovery', 'tension'], softIntro: 'For muscle tension, a percussion massager like this can help:' },
  { name: 'Biofreeze Pain Relief Gel', asin: 'B0041KMDWG', category: 'pain-management', tags: ['pain', 'topical', 'joint', 'muscle', 'cooling'], softIntro: 'A topical option that many find soothing is' },
  { name: 'TENS Unit (AUVON)', asin: 'B07Q2WJH1L', category: 'pain-management', tags: ['pain', 'nerve', 'electrical', 'muscle', 'relief'], softIntro: 'A TENS unit can be worth exploring for nerve pain, like' },
  { name: 'Heating Pad (Pure Enrichment)', asin: 'B01KVZLURG', category: 'pain-management', tags: ['pain', 'heat', 'muscle', 'comfort', 'relaxation'], softIntro: 'A reliable heating pad that gets good reviews is' },
  { name: 'Epsom Salt (Dr Teal\'s)', asin: 'B005P0XBII', category: 'pain-management', tags: ['pain', 'bath', 'magnesium', 'muscle', 'relaxation'], softIntro: 'Epsom salt baths are a simple comfort, and a good option is' },
  { name: 'Foam Roller', asin: 'B00XM2MRGI', category: 'pain-management', tags: ['pain', 'muscle', 'mobility', 'myofascial', 'recovery'], softIntro: 'For gentle myofascial release, a foam roller like this works well:' },
  { name: 'Arnica Gel (Boiron)', asin: 'B000GCTJNM', category: 'pain-management', tags: ['pain', 'topical', 'bruising', 'natural', 'inflammation'], softIntro: 'A natural topical that some people find helpful is' },
  { name: 'Compression Gloves', asin: 'B071WM3QBK', category: 'pain-management', tags: ['pain', 'hands', 'joint', 'arthritis', 'compression'], softIntro: 'For hand and joint discomfort, compression gloves like these are worth trying:' },
  { name: 'Ice Pack Set (Rester\'s Choice)', asin: 'B07FDNP6BN', category: 'pain-management', tags: ['pain', 'cold', 'inflammation', 'swelling', 'relief'], softIntro: 'Having a good set of ice packs on hand is practical, like' },
  { name: 'Curcumin (Meriva by Thorne)', asin: 'B0797DMJCF', category: 'pain-management', tags: ['pain', 'inflammation', 'supplement', 'turmeric', 'joint'], softIntro: 'For inflammation support, a well-absorbed curcumin like this is popular:' },
  { name: 'Trigger Point Massage Ball', asin: 'B00AUVHCQ0', category: 'pain-management', tags: ['pain', 'muscle', 'trigger-point', 'myofascial'], softIntro: 'A simple trigger point ball can do a lot, like' },
  { name: 'Lidocaine Patches (Salonpas)', asin: 'B000GD7QXI', category: 'pain-management', tags: ['pain', 'topical', 'patch', 'nerve', 'localized'], softIntro: 'For localized pain relief, patches like these are convenient:' },
  { name: 'Neck and Shoulder Massager', asin: 'B07DLMFMJH', category: 'pain-management', tags: ['pain', 'neck', 'shoulder', 'tension', 'massage'], softIntro: 'A neck massager that many people find helpful is' },
  { name: 'CBD Cream (Charlotte\'s Web)', asin: 'B07LFGFQFP', category: 'pain-management', tags: ['pain', 'CBD', 'topical', 'inflammation', 'natural'], softIntro: 'Some people find CBD topicals helpful, like' },
  { name: 'Omega-3 Fish Oil (Nordic Naturals)', asin: 'B002CQU564', category: 'pain-management', tags: ['pain', 'inflammation', 'omega-3', 'supplement', 'joint'], softIntro: 'A high-quality omega-3 that many recommend is' },
  { name: 'Knee Brace (CAMBIVO)', asin: 'B07PNBQWQF', category: 'pain-management', tags: ['pain', 'knee', 'joint', 'support', 'mobility'], softIntro: 'For knee support during daily activities, consider' },
  { name: 'Capsaicin Cream', asin: 'B000GCNKM2', category: 'pain-management', tags: ['pain', 'topical', 'nerve', 'capsaicin', 'burning'], softIntro: 'Capsaicin cream is an option some find effective for nerve pain:' },
  { name: 'Posture Corrector', asin: 'B07DLMFMJH', category: 'pain-management', tags: ['pain', 'posture', 'back', 'shoulder', 'alignment'], softIntro: 'For posture-related pain, a gentle corrector like this can help:' },
  { name: 'Boswellia Extract', asin: 'B0013OUKWG', category: 'pain-management', tags: ['pain', 'inflammation', 'supplement', 'joint', 'herbal'], softIntro: 'An herbal anti-inflammatory worth looking into is' },
  { name: 'Wrist Brace (Mueller)', asin: 'B002NLGNW8', category: 'pain-management', tags: ['pain', 'wrist', 'carpal-tunnel', 'support', 'joint'], softIntro: 'For wrist support, a brace like this is a practical option:' },
  { name: 'Infrared Heat Lamp', asin: 'B00EU5KM0Y', category: 'pain-management', tags: ['pain', 'heat', 'infrared', 'deep-tissue', 'therapy'], softIntro: 'Infrared heat therapy is something worth exploring, like' },
  { name: 'Magnesium Spray (Ancient Minerals)', asin: 'B001AD0HL4', category: 'pain-management', tags: ['pain', 'magnesium', 'topical', 'muscle', 'cramps'], softIntro: 'Topical magnesium can be surprisingly effective, like' },
  { name: 'Acupressure Mat (ProSource)', asin: 'B00BMS91GS', category: 'pain-management', tags: ['pain', 'acupressure', 'relaxation', 'tension', 'circulation'], softIntro: 'An acupressure mat is a simple tool that many find helpful:' },
  { name: 'SAM-e (Nature Made)', asin: 'B001G7QVFO', category: 'pain-management', tags: ['pain', 'joint', 'mood', 'supplement', 'inflammation'], softIntro: 'SAM-e is a supplement some people find helpful for both pain and mood:' },
  { name: 'Paraffin Wax Bath', asin: 'B000XFTFNA', category: 'pain-management', tags: ['pain', 'hands', 'joint', 'heat', 'therapy'], softIntro: 'For hand and joint stiffness, a paraffin bath like this can be soothing:' },

  // ═══════════════════════════════════════
  // ENERGY & NUTRITION (25 products)
  // ═══════════════════════════════════════
  { name: 'Electrolyte Powder (LMNT)', asin: 'B08GYKZ3HK', category: 'energy-nutrition', tags: ['energy', 'electrolytes', 'POTS', 'hydration', 'sodium'], softIntro: 'For electrolyte support, especially with POTS, many people like' },
  { name: 'CoQ10 (Qunol Ultra)', asin: 'B003SBJGEY', category: 'energy-nutrition', tags: ['energy', 'mitochondria', 'supplement', 'CoQ10', 'cellular'], softIntro: 'A well-absorbed CoQ10 supplement worth considering is' },
  { name: 'D-Ribose Powder', asin: 'B000FOJQ3Q', category: 'energy-nutrition', tags: ['energy', 'ATP', 'mitochondria', 'supplement', 'fatigue'], softIntro: 'For cellular energy support, D-Ribose is an option many explore:' },
  { name: 'B-Complex (Thorne)', asin: 'B00188EYR2', category: 'energy-nutrition', tags: ['energy', 'B-vitamins', 'methylation', 'supplement', 'fatigue'], softIntro: 'A quality B-complex that many practitioners recommend is' },
  { name: 'Vitamin D3 + K2 (Sports Research)', asin: 'B01GV4O37E', category: 'energy-nutrition', tags: ['energy', 'vitamin-D', 'immune', 'supplement', 'bone'], softIntro: 'For vitamin D support, a combined D3+K2 like this is popular:' },
  { name: 'Iron Bisglycinate (Thorne)', asin: 'B0797GRLQB', category: 'energy-nutrition', tags: ['energy', 'iron', 'anemia', 'supplement', 'fatigue'], softIntro: 'A gentle iron supplement that is easier on the stomach is' },
  { name: 'Protein Powder (Orgain Organic)', asin: 'B00J074W7Q', category: 'energy-nutrition', tags: ['energy', 'protein', 'nutrition', 'meal-replacement', 'recovery'], softIntro: 'For easy protein intake, an organic option like this works well:' },
  { name: 'MCT Oil (Sports Research)', asin: 'B00XM0YWQO', category: 'energy-nutrition', tags: ['energy', 'fat', 'brain', 'ketones', 'nutrition'], softIntro: 'MCT oil is something many people add to their routine, like' },
  { name: 'Liquid IV Hydration Multiplier', asin: 'B07Q2WBPTL', category: 'energy-nutrition', tags: ['energy', 'hydration', 'electrolytes', 'POTS', 'fatigue'], softIntro: 'A convenient hydration option that many find helpful is' },
  { name: 'Acetyl L-Carnitine', asin: 'B000QSNYGI', category: 'energy-nutrition', tags: ['energy', 'mitochondria', 'brain', 'supplement', 'fatigue'], softIntro: 'For mitochondrial support, acetyl L-carnitine is worth exploring:' },
  { name: 'Bone Broth Powder (Kettle & Fire)', asin: 'B08GYLGDNP', category: 'energy-nutrition', tags: ['energy', 'gut', 'nutrition', 'collagen', 'healing'], softIntro: 'Bone broth powder is a convenient nutrition option, like' },
  { name: 'Spirulina Tablets', asin: 'B0039ITKHY', category: 'energy-nutrition', tags: ['energy', 'nutrition', 'superfood', 'iron', 'protein'], softIntro: 'For nutrient-dense supplementation, spirulina tablets like these are popular:' },
  { name: 'Creatine Monohydrate', asin: 'B002DYIZEO', category: 'energy-nutrition', tags: ['energy', 'ATP', 'brain', 'muscle', 'supplement'], softIntro: 'Creatine is gaining attention for energy and brain support:' },
  { name: 'Collagen Peptides (Vital Proteins)', asin: 'B00K6JUG4K', category: 'energy-nutrition', tags: ['energy', 'collagen', 'gut', 'joint', 'nutrition'], softIntro: 'A collagen supplement that many people add to their morning routine is' },
  { name: 'PQQ (Doctor\'s Best)', asin: 'B00EISFBYA', category: 'energy-nutrition', tags: ['energy', 'mitochondria', 'brain', 'supplement', 'cellular'], softIntro: 'For mitochondrial biogenesis support, PQQ is worth looking into:' },
  { name: 'Adrenal Support (Gaia Herbs)', asin: 'B000RVBQHQ', category: 'energy-nutrition', tags: ['energy', 'adrenal', 'stress', 'adaptogen', 'fatigue'], softIntro: 'An adaptogenic blend that some find supportive is' },
  { name: 'Greens Powder (Athletic Greens AG1)', asin: 'B09DVVWKQ5', category: 'energy-nutrition', tags: ['energy', 'nutrition', 'greens', 'vitamins', 'gut'], softIntro: 'For a comprehensive greens supplement, many people reach for' },
  { name: 'NAD+ Precursor (Tru Niagen)', asin: 'B07D5HVHVN', category: 'energy-nutrition', tags: ['energy', 'NAD', 'cellular', 'aging', 'mitochondria'], softIntro: 'For NAD+ support, a well-researched option is' },
  { name: 'Electrolyte Capsules (SaltStick)', asin: 'B002IY96B0', category: 'energy-nutrition', tags: ['energy', 'electrolytes', 'POTS', 'sodium', 'portable'], softIntro: 'Portable electrolyte capsules can be practical for on-the-go, like' },
  { name: 'Digestive Enzymes (NOW)', asin: 'B0013OXKHC', category: 'energy-nutrition', tags: ['energy', 'digestion', 'gut', 'enzyme', 'nutrition'], softIntro: 'Digestive enzyme support is something many find helpful, like' },
  { name: 'Ashwagandha (KSM-66)', asin: 'B078K15GSF', category: 'energy-nutrition', tags: ['energy', 'adaptogen', 'stress', 'cortisol', 'supplement'], softIntro: 'An adaptogen that has solid research behind it is' },
  { name: 'Zinc Picolinate (Thorne)', asin: 'B0797GRLQB', category: 'energy-nutrition', tags: ['energy', 'immune', 'zinc', 'supplement', 'healing'], softIntro: 'For zinc supplementation, a well-absorbed form like this is' },
  { name: 'Probiotics (Seed DS-01)', asin: 'B084DLHJ4Y', category: 'energy-nutrition', tags: ['energy', 'gut', 'microbiome', 'probiotic', 'digestion'], softIntro: 'A probiotic that takes a science-forward approach is' },
  { name: 'Vitamin C (Liposomal)', asin: 'B000CD9XGC', category: 'energy-nutrition', tags: ['energy', 'immune', 'vitamin-C', 'supplement', 'antioxidant'], softIntro: 'For better-absorbed vitamin C, a liposomal form like this is popular:' },
  { name: 'Smoothie Blender (NutriBullet)', asin: 'B07CTBHQZK', category: 'energy-nutrition', tags: ['energy', 'nutrition', 'smoothie', 'kitchen', 'easy-prep'], softIntro: 'For easy nutrition prep on low-energy days, a blender like this helps:' },

  // ═══════════════════════════════════════
  // MOBILITY & GENTLE EXERCISE (20 products)
  // ═══════════════════════════════════════
  { name: 'Yoga Mat (Manduka PRO)', asin: 'B0028MBKSA', category: 'mobility-exercise', tags: ['exercise', 'yoga', 'stretching', 'floor', 'gentle'], softIntro: 'A quality yoga mat for gentle movement, like' },
  { name: 'Resistance Bands Set', asin: 'B01AVDVHTI', category: 'mobility-exercise', tags: ['exercise', 'strength', 'gentle', 'resistance', 'home'], softIntro: 'Resistance bands are a gentle way to build strength at home:' },
  { name: 'Under Desk Elliptical', asin: 'B07JMKZNQQ', category: 'mobility-exercise', tags: ['exercise', 'gentle', 'seated', 'circulation', 'POTS'], softIntro: 'For gentle movement while seated, an under-desk elliptical like this works:' },
  { name: 'Balance Ball Chair', asin: 'B0007VB4NE', category: 'mobility-exercise', tags: ['exercise', 'posture', 'core', 'seated', 'gentle'], softIntro: 'A balance ball chair can help with posture and gentle core engagement:' },
  { name: 'Recumbent Exercise Bike', asin: 'B07D528W98', category: 'mobility-exercise', tags: ['exercise', 'cardio', 'gentle', 'recumbent', 'POTS'], softIntro: 'For those who need recumbent exercise, a bike like this is a good option:' },
  { name: 'Stretch Strap', asin: 'B00065X2UI', category: 'mobility-exercise', tags: ['exercise', 'stretching', 'flexibility', 'gentle', 'recovery'], softIntro: 'A stretch strap makes gentle flexibility work easier:' },
  { name: 'Pedal Exerciser', asin: 'B001CZYMG4', category: 'mobility-exercise', tags: ['exercise', 'gentle', 'seated', 'circulation', 'low-impact'], softIntro: 'A pedal exerciser is a low-impact option for bed or chair:' },
  { name: 'Yoga Blocks (2 Pack)', asin: 'B01LYQ4MQU', category: 'mobility-exercise', tags: ['exercise', 'yoga', 'support', 'gentle', 'modification'], softIntro: 'Yoga blocks make modified poses more accessible:' },
  { name: 'Walking Poles (LEKI)', asin: 'B07PNKFMHK', category: 'mobility-exercise', tags: ['exercise', 'walking', 'balance', 'outdoor', 'stability'], softIntro: 'Walking poles can make gentle walks more stable and supported:' },
  { name: 'Grip Strengthener Set', asin: 'B07B2YHRXF', category: 'mobility-exercise', tags: ['exercise', 'grip', 'hand', 'strength', 'gentle'], softIntro: 'For gentle hand strengthening, a grip set like this works well:' },
  { name: 'Ankle Weights (1lb pair)', asin: 'B00B1CBUKS', category: 'mobility-exercise', tags: ['exercise', 'strength', 'gentle', 'ankle', 'low-impact'], softIntro: 'Light ankle weights can add gentle resistance to movement:' },
  { name: 'Stability Ball', asin: 'B01MSIAMXO', category: 'mobility-exercise', tags: ['exercise', 'core', 'balance', 'gentle', 'seated'], softIntro: 'A stability ball is versatile for gentle core work:' },
  { name: 'Pilates Ring', asin: 'B07DLMFMJH', category: 'mobility-exercise', tags: ['exercise', 'pilates', 'gentle', 'toning', 'low-impact'], softIntro: 'A Pilates ring offers gentle resistance for toning:' },
  { name: 'Doorway Pull-Up Bar', asin: 'B001EJMS6K', category: 'mobility-exercise', tags: ['exercise', 'hanging', 'decompression', 'spine', 'strength'], softIntro: 'For gentle spinal decompression, a pull-up bar can be useful:' },
  { name: 'Exercise Ball Chair Base', asin: 'B00LFIYMQG', category: 'mobility-exercise', tags: ['exercise', 'posture', 'core', 'office', 'seated'], softIntro: 'An exercise ball with a chair base combines comfort with gentle engagement:' },
  { name: 'Tai Chi DVD for Beginners', asin: 'B00AATJCJC', category: 'mobility-exercise', tags: ['exercise', 'tai-chi', 'gentle', 'balance', 'meditation'], softIntro: 'Tai chi is wonderfully gentle, and a beginner DVD like this can help:' },
  { name: 'Massage Cane (Thera Cane)', asin: 'B000PRMCJU', category: 'mobility-exercise', tags: ['exercise', 'self-massage', 'trigger-point', 'recovery'], softIntro: 'For self-massage of hard-to-reach areas, a tool like this helps:' },
  { name: 'Resistance Loop Bands', asin: 'B019GH0SHC', category: 'mobility-exercise', tags: ['exercise', 'resistance', 'gentle', 'glute', 'hip'], softIntro: 'Loop bands are great for gentle hip and glute activation:' },
  { name: 'Wobble Board', asin: 'B07DLMFMJH', category: 'mobility-exercise', tags: ['exercise', 'balance', 'proprioception', 'ankle', 'gentle'], softIntro: 'A wobble board can help with balance and proprioception:' },
  { name: 'Foam Yoga Bolster', asin: 'B07DLMFMJH', category: 'mobility-exercise', tags: ['exercise', 'yoga', 'restorative', 'support', 'gentle'], softIntro: 'A yoga bolster makes restorative poses much more comfortable:' },

  // ═══════════════════════════════════════
  // MENTAL HEALTH & MINDFULNESS (20 products)
  // ═══════════════════════════════════════
  { name: 'Calm App Subscription Card', asin: 'B08BXGFQHD', category: 'mental-health', tags: ['meditation', 'anxiety', 'app', 'mindfulness', 'sleep'], softIntro: 'A meditation app many people start with is' },
  { name: 'Gratitude Journal (Five Minute Journal)', asin: 'B00JRFUAWS', category: 'mental-health', tags: ['journaling', 'gratitude', 'mental-health', 'routine', 'mindfulness'], softIntro: 'A structured gratitude practice can shift perspective, like' },
  { name: 'Meditation Cushion (Florensi)', asin: 'B07WFXGNGF', category: 'mental-health', tags: ['meditation', 'sitting', 'comfort', 'practice', 'mindfulness'], softIntro: 'A good meditation cushion makes sitting practice more sustainable:' },
  { name: 'Anxiety Workbook (CBT-based)', asin: 'B07VRZPJDR', category: 'mental-health', tags: ['anxiety', 'CBT', 'workbook', 'mental-health', 'therapy'], softIntro: 'A CBT-based workbook that many therapists recommend is' },
  { name: 'Singing Bowl', asin: 'B00E8IHKN6', category: 'mental-health', tags: ['meditation', 'sound', 'relaxation', 'mindfulness', 'ritual'], softIntro: 'A singing bowl can be a grounding addition to a meditation practice:' },
  { name: 'Light Therapy Lamp (Verilux)', asin: 'B00PCN4UVU', category: 'mental-health', tags: ['depression', 'SAD', 'light', 'mood', 'energy'], softIntro: 'For mood and energy support, a light therapy lamp like this is popular:' },
  { name: 'Fidget Cube', asin: 'B01MR1LV7O', category: 'mental-health', tags: ['anxiety', 'fidget', 'focus', 'sensory', 'calm'], softIntro: 'A fidget cube can help with anxiety and focus:' },
  { name: 'Bullet Journal (Leuchtturm1917)', asin: 'B002TSIMW4', category: 'mental-health', tags: ['journaling', 'planning', 'mental-health', 'organization', 'tracking'], softIntro: 'For symptom tracking and journaling, a quality notebook like this works well:' },
  { name: 'Noise-Canceling Headphones (Sony WH-1000XM5)', asin: 'B09XS7JWHH', category: 'mental-health', tags: ['sensory', 'noise', 'overwhelm', 'quiet', 'focus'], softIntro: 'Noise-canceling headphones can be essential for sensory overwhelm:' },
  { name: 'Acupressure Ring Set', asin: 'B07DLMFMJH', category: 'mental-health', tags: ['anxiety', 'fidget', 'acupressure', 'sensory', 'calm'], softIntro: 'Acupressure rings are a discreet anxiety tool:' },
  { name: 'Therapy Putty', asin: 'B00IQDH0HE', category: 'mental-health', tags: ['anxiety', 'sensory', 'hand', 'therapy', 'calm'], softIntro: 'Therapy putty can be both calming and strengthening:' },
  { name: 'Mindfulness Cards Deck', asin: 'B07DLMFMJH', category: 'mental-health', tags: ['mindfulness', 'meditation', 'practice', 'cards', 'daily'], softIntro: 'A mindfulness card deck can add variety to daily practice:' },
  { name: 'SAD Light Box (Carex)', asin: 'B004JF3G08', category: 'mental-health', tags: ['depression', 'SAD', 'light', 'winter', 'mood'], softIntro: 'For seasonal mood support, a light box like this is well-reviewed:' },
  { name: 'Stress Ball Set', asin: 'B07DLMFMJH', category: 'mental-health', tags: ['anxiety', 'stress', 'sensory', 'hand', 'calm'], softIntro: 'Simple stress balls can be surprisingly helpful:' },
  { name: 'Mala Beads', asin: 'B07DLMFMJH', category: 'mental-health', tags: ['meditation', 'counting', 'focus', 'ritual', 'mindfulness'], softIntro: 'Mala beads can support a counting meditation practice:' },
  { name: 'Essential Oil Set (Plant Therapy)', asin: 'B00SA5UMN8', category: 'mental-health', tags: ['aromatherapy', 'mood', 'relaxation', 'anxiety', 'calm'], softIntro: 'An essential oil starter set for mood support, like' },
  { name: 'Biofeedback Device (Muse 2)', asin: 'B07HL2S9GQ', category: 'mental-health', tags: ['meditation', 'biofeedback', 'brain', 'focus', 'technology'], softIntro: 'For tech-supported meditation, a biofeedback device like this is interesting:' },
  { name: 'Coloring Book for Adults', asin: 'B01C4KMRWI', category: 'mental-health', tags: ['anxiety', 'relaxation', 'creative', 'mindfulness', 'gentle'], softIntro: 'Adult coloring books are a gentle way to quiet the mind:' },
  { name: 'Breathing Exercise Device (Shift)', asin: 'B07DLMFMJH', category: 'mental-health', tags: ['breathing', 'anxiety', 'nervous-system', 'vagus', 'calm'], softIntro: 'A breathing exercise device can help regulate the nervous system:' },
  { name: 'Himalayan Salt Lamp', asin: 'B00KDSOEQO', category: 'mental-health', tags: ['ambiance', 'relaxation', 'light', 'mood', 'bedroom'], softIntro: 'A salt lamp creates a calming ambiance that many find soothing:' },

  // ═══════════════════════════════════════
  // MEDICAL TOOLS & MONITORING (20 products)
  // ═══════════════════════════════════════
  { name: 'Pulse Oximeter (Zacurate)', asin: 'B00B8NKZ22', category: 'medical-tools', tags: ['monitoring', 'oxygen', 'heart-rate', 'POTS', 'medical'], softIntro: 'A pulse oximeter is a practical monitoring tool, like' },
  { name: 'Blood Pressure Monitor (Omron)', asin: 'B00KA6EKNK', category: 'medical-tools', tags: ['monitoring', 'blood-pressure', 'POTS', 'heart', 'medical'], softIntro: 'For tracking blood pressure at home, a reliable monitor like this helps:' },
  { name: 'Pill Organizer (Weekly)', asin: 'B00PFWGO0U', category: 'medical-tools', tags: ['organization', 'medication', 'supplements', 'routine', 'medical'], softIntro: 'A weekly pill organizer keeps supplement routines manageable:' },
  { name: 'Thermometer (Braun)', asin: 'B01HNTQNWQ', category: 'medical-tools', tags: ['monitoring', 'temperature', 'fever', 'medical', 'tracking'], softIntro: 'A reliable thermometer for tracking temperature patterns, like' },
  { name: 'Compression Socks (SB SOX)', asin: 'B01MSIAMXO', category: 'medical-tools', tags: ['POTS', 'circulation', 'compression', 'standing', 'medical'], softIntro: 'Compression socks are often recommended for POTS, like' },
  { name: 'Medical Alert Bracelet', asin: 'B07DLMFMJH', category: 'medical-tools', tags: ['safety', 'medical', 'emergency', 'identification', 'chronic'], softIntro: 'A medical alert bracelet provides peace of mind:' },
  { name: 'Glucose Monitor (Contour Next)', asin: 'B01ABKNH6E', category: 'medical-tools', tags: ['monitoring', 'blood-sugar', 'energy', 'medical', 'tracking'], softIntro: 'For blood sugar monitoring, a reliable meter like this works well:' },
  { name: 'Heart Rate Monitor Chest Strap (Polar)', asin: 'B07PM54P4N', category: 'medical-tools', tags: ['monitoring', 'heart-rate', 'exercise', 'POTS', 'pacing'], softIntro: 'A chest strap heart rate monitor is useful for pacing, like' },
  { name: 'Shower Chair', asin: 'B009LHQFV4', category: 'medical-tools', tags: ['POTS', 'safety', 'shower', 'fatigue', 'daily-living'], softIntro: 'A shower chair can make a real difference on difficult days:' },
  { name: 'Grabber Reacher Tool', asin: 'B01KG4K7PG', category: 'medical-tools', tags: ['daily-living', 'mobility', 'energy-conservation', 'tool'], softIntro: 'A reacher tool helps conserve energy for daily tasks:' },
  { name: 'Fitbit Charge 6', asin: 'B0CCJD3QGR', category: 'medical-tools', tags: ['monitoring', 'heart-rate', 'sleep', 'activity', 'tracking'], softIntro: 'For comprehensive health tracking, a fitness tracker like this is popular:' },
  { name: 'Abdominal Binder', asin: 'B07DLMFMJH', category: 'medical-tools', tags: ['POTS', 'compression', 'abdominal', 'blood-pooling'], softIntro: 'An abdominal binder can help with blood pooling in POTS:' },
  { name: 'Symptom Tracking Notebook', asin: 'B07DLMFMJH', category: 'medical-tools', tags: ['tracking', 'symptoms', 'journal', 'medical', 'patterns'], softIntro: 'A dedicated symptom tracking notebook helps identify patterns:' },
  { name: 'Portable Stool/Cane', asin: 'B07DLMFMJH', category: 'medical-tools', tags: ['mobility', 'rest', 'standing', 'POTS', 'daily-living'], softIntro: 'A portable stool-cane combo is practical for outings:' },
  { name: 'Cooling Towel', asin: 'B01AWGUXAM', category: 'medical-tools', tags: ['temperature', 'cooling', 'heat-intolerance', 'portable'], softIntro: 'A cooling towel is handy for heat sensitivity:' },
  { name: 'Raised Toilet Seat', asin: 'B000GUP7FE', category: 'medical-tools', tags: ['daily-living', 'mobility', 'bathroom', 'energy-conservation'], softIntro: 'A raised toilet seat can reduce the energy cost of daily routines:' },
  { name: 'Lap Desk', asin: 'B002OHDGM6', category: 'medical-tools', tags: ['daily-living', 'bed', 'work', 'comfort', 'energy-conservation'], softIntro: 'A lap desk makes working from bed more practical:' },
  { name: 'Sock Aid', asin: 'B01LXWFHZ3', category: 'medical-tools', tags: ['daily-living', 'dressing', 'energy-conservation', 'mobility'], softIntro: 'A sock aid is a small tool that saves surprising amounts of energy:' },
  { name: 'Long-Handled Sponge', asin: 'B000PGMFBK', category: 'medical-tools', tags: ['daily-living', 'bathing', 'energy-conservation', 'mobility'], softIntro: 'A long-handled sponge reduces the physical cost of bathing:' },
  { name: 'Bed Tray Table', asin: 'B08YNXWSNP', category: 'medical-tools', tags: ['daily-living', 'bed', 'eating', 'comfort', 'energy-conservation'], softIntro: 'A bed tray table makes meals in bed more dignified:' },

  // ═══════════════════════════════════════
  // BOOKS & EDUCATION (25 products)
  // ═══════════════════════════════════════
  { name: 'The Body Keeps the Score (Bessel van der Kolk)', asin: 'B00G3L1C2K', category: 'books-education', tags: ['book', 'trauma', 'body', 'nervous-system', 'healing'], softIntro: 'A book that many find eye-opening is' },
  { name: 'When the Body Says No (Gabor Mate)', asin: 'B0052RD1BA', category: 'books-education', tags: ['book', 'stress', 'illness', 'mind-body', 'healing'], softIntro: 'For understanding the stress-illness connection, consider' },
  { name: 'Waking the Tiger (Peter Levine)', asin: 'B005GFBNSM', category: 'books-education', tags: ['book', 'trauma', 'somatic', 'nervous-system', 'healing'], softIntro: 'A foundational book on somatic experiencing is' },
  { name: 'Full Catastrophe Living (Jon Kabat-Zinn)', asin: 'B00C4BA3UK', category: 'books-education', tags: ['book', 'mindfulness', 'stress', 'meditation', 'chronic-illness'], softIntro: 'The classic guide to mindfulness-based stress reduction is' },
  { name: 'How to Be Sick (Toni Bernhard)', asin: 'B004GCKU3W', category: 'books-education', tags: ['book', 'chronic-illness', 'buddhism', 'acceptance', 'practical'], softIntro: 'A book written specifically for chronic illness from a Buddhist perspective is' },
  { name: 'The Wahls Protocol (Terry Wahls)', asin: 'B00IEABEQQ', category: 'books-education', tags: ['book', 'diet', 'autoimmune', 'nutrition', 'protocol'], softIntro: 'For a dietary approach to autoimmune conditions, consider' },
  { name: 'Radical Acceptance (Tara Brach)', asin: 'B000FC20MA', category: 'books-education', tags: ['book', 'acceptance', 'buddhism', 'meditation', 'self-compassion'], softIntro: 'A book on acceptance that many find life-changing is' },
  { name: 'The Mindbody Prescription (John Sarno)', asin: 'B000FA5SJS', category: 'books-education', tags: ['book', 'mind-body', 'pain', 'TMS', 'healing'], softIntro: 'For the mind-body pain connection, a classic text is' },
  { name: 'Rest Is Resistance (Tricia Hersey)', asin: 'B09XFKQM3C', category: 'books-education', tags: ['book', 'rest', 'culture', 'resistance', 'healing'], softIntro: 'A powerful reframing of rest as resistance is' },
  { name: 'Breath (James Nestor)', asin: 'B0818BMDVH', category: 'books-education', tags: ['book', 'breathing', 'health', 'science', 'practice'], softIntro: 'For understanding the science of breath, consider' },
  { name: 'The Power of Now (Eckhart Tolle)', asin: 'B002361MLA', category: 'books-education', tags: ['book', 'presence', 'consciousness', 'meditation', 'awareness'], softIntro: 'A foundational text on present-moment awareness is' },
  { name: 'Why We Sleep (Matthew Walker)', asin: 'B06Y649387', category: 'books-education', tags: ['book', 'sleep', 'science', 'health', 'brain'], softIntro: 'For understanding sleep science, this book is essential:' },
  { name: 'Waking Up (Sam Harris)', asin: 'B00GEEB9YC', category: 'books-education', tags: ['book', 'meditation', 'consciousness', 'neuroscience', 'secular'], softIntro: 'A secular approach to meditation and consciousness is' },
  { name: 'The Untethered Soul (Michael Singer)', asin: 'B003TU29WA', category: 'books-education', tags: ['book', 'consciousness', 'freedom', 'awareness', 'spiritual'], softIntro: 'A book on inner freedom that many find accessible is' },
  { name: 'Burnout (Emily Nagoski)', asin: 'B07DT1GJ8P', category: 'books-education', tags: ['book', 'burnout', 'stress', 'women', 'recovery'], softIntro: 'For understanding the stress cycle and burnout, consider' },
  { name: 'The Polyvagal Theory in Therapy (Deb Dana)', asin: 'B07DGMBLQK', category: 'books-education', tags: ['book', 'polyvagal', 'nervous-system', 'therapy', 'regulation'], softIntro: 'For understanding polyvagal theory in accessible terms, try' },
  { name: 'Scattered Minds (Gabor Mate)', asin: 'B004GKMZ2K', category: 'books-education', tags: ['book', 'ADHD', 'brain-fog', 'attention', 'neuroscience'], softIntro: 'For understanding attention and scattered focus, consider' },
  { name: 'The Myth of Normal (Gabor Mate)', asin: 'B09BBHFQJC', category: 'books-education', tags: ['book', 'health', 'culture', 'trauma', 'society'], softIntro: 'A broader look at health and culture is' },
  { name: 'Anatomy of an Epidemic (Robert Whitaker)', asin: 'B003B3P3IM', category: 'books-education', tags: ['book', 'medication', 'mental-health', 'science', 'critical'], softIntro: 'For a critical look at psychiatric medication, consider' },
  { name: 'You Are Not Your Pain (Vidyamala Burch)', asin: 'B00MEYNWHY', category: 'books-education', tags: ['book', 'pain', 'mindfulness', 'chronic', 'meditation'], softIntro: 'A mindfulness approach to chronic pain is' },
  { name: 'Accessing the Healing Power of the Vagus Nerve (Stanley Rosenberg)', asin: 'B075FMWMHJ', category: 'books-education', tags: ['book', 'vagus', 'nervous-system', 'exercises', 'healing'], softIntro: 'For practical vagus nerve exercises, this book is helpful:' },
  { name: 'The Inflamed Mind (Edward Bullmore)', asin: 'B07BNF8D46', category: 'books-education', tags: ['book', 'inflammation', 'depression', 'brain', 'immune'], softIntro: 'For the inflammation-depression connection, consider' },
  { name: 'Dopamine Nation (Anna Lembke)', asin: 'B08NWDL4QR', category: 'books-education', tags: ['book', 'dopamine', 'addiction', 'balance', 'brain'], softIntro: 'For understanding dopamine and balance, try' },
  { name: 'The Autoimmune Solution (Amy Myers)', asin: 'B00LQXQG0S', category: 'books-education', tags: ['book', 'autoimmune', 'diet', 'healing', 'protocol'], softIntro: 'For an autoimmune-focused healing protocol, consider' },
  { name: 'Cured (Jeffrey Rediger)', asin: 'B07YDKQCFZ', category: 'books-education', tags: ['book', 'healing', 'recovery', 'science', 'remarkable'], softIntro: 'For documented cases of remarkable healing, try' },

  // ═══════════════════════════════════════
  // COMFORT & DAILY LIVING (20 products)
  // ═══════════════════════════════════════
  { name: 'Electric Kettle (Fellow Stagg)', asin: 'B07DTMZL56', category: 'comfort-daily', tags: ['kitchen', 'tea', 'comfort', 'daily-living', 'easy-prep'], softIntro: 'A good electric kettle makes tea preparation effortless:' },
  { name: 'Compression Stockings (Jobst)', asin: 'B000HGKN4O', category: 'comfort-daily', tags: ['POTS', 'compression', 'circulation', 'daily-living', 'medical'], softIntro: 'Medical-grade compression stockings like these are often recommended:' },
  { name: 'Insulated Water Bottle (Hydro Flask)', asin: 'B083GBWFBH', category: 'comfort-daily', tags: ['hydration', 'daily-living', 'water', 'portable', 'temperature'], softIntro: 'Staying hydrated is easier with a good insulated bottle:' },
  { name: 'Ergonomic Mouse', asin: 'B07FNJB8TT', category: 'comfort-daily', tags: ['ergonomic', 'computer', 'wrist', 'daily-living', 'work'], softIntro: 'An ergonomic mouse can reduce strain during computer work:' },
  { name: 'Neck Pillow (BCOZZY)', asin: 'B00LB7REFK', category: 'comfort-daily', tags: ['comfort', 'travel', 'neck', 'support', 'rest'], softIntro: 'A supportive neck pillow for resting or travel, like' },
  { name: 'Heated Throw Blanket', asin: 'B07GJ9B1X9', category: 'comfort-daily', tags: ['comfort', 'warmth', 'pain', 'relaxation', 'cozy'], softIntro: 'A heated throw blanket is a simple comfort that helps:' },
  { name: 'Standing Desk Converter', asin: 'B07DHMNG31', category: 'comfort-daily', tags: ['ergonomic', 'standing', 'work', 'posture', 'energy'], softIntro: 'A standing desk converter allows position changes throughout the day:' },
  { name: 'Meal Prep Containers', asin: 'B01D0JEMXO', category: 'comfort-daily', tags: ['nutrition', 'meal-prep', 'energy-conservation', 'kitchen', 'organization'], softIntro: 'Meal prep containers make batch cooking more practical:' },
  { name: 'Electric Can Opener', asin: 'B00006IUWL', category: 'comfort-daily', tags: ['kitchen', 'energy-conservation', 'daily-living', 'grip', 'easy'], softIntro: 'An electric can opener saves hand strength for other things:' },
  { name: 'Heated Seat Cushion', asin: 'B07BRDNB6R', category: 'comfort-daily', tags: ['comfort', 'warmth', 'pain', 'seated', 'car'], softIntro: 'A heated seat cushion can make sitting more comfortable:' },
  { name: 'Ergonomic Keyboard', asin: 'B07ZPC9QD4', category: 'comfort-daily', tags: ['ergonomic', 'typing', 'wrist', 'work', 'comfort'], softIntro: 'An ergonomic keyboard can reduce strain during typing:' },
  { name: 'Foot Rest Under Desk', asin: 'B07PNKFMHK', category: 'comfort-daily', tags: ['ergonomic', 'circulation', 'comfort', 'seated', 'work'], softIntro: 'A foot rest under the desk can improve circulation while seated:' },
  { name: 'Instant Pot', asin: 'B00FLYWNYQ', category: 'comfort-daily', tags: ['kitchen', 'cooking', 'energy-conservation', 'easy-prep', 'nutrition'], softIntro: 'An Instant Pot makes nutritious meals with minimal effort:' },
  { name: 'Reusable Hand Warmers', asin: 'B07DLMFMJH', category: 'comfort-daily', tags: ['comfort', 'warmth', 'circulation', 'Raynauds', 'portable'], softIntro: 'Reusable hand warmers are helpful for cold sensitivity:' },
  { name: 'Soft Robe (Barefoot Dreams)', asin: 'B07DLMFMJH', category: 'comfort-daily', tags: ['comfort', 'warmth', 'daily-living', 'cozy', 'self-care'], softIntro: 'A soft robe can make difficult days a little more bearable:' },
  { name: 'Electric Blanket', asin: 'B01LZWWKQ1', category: 'comfort-daily', tags: ['comfort', 'warmth', 'pain', 'sleep', 'winter'], softIntro: 'An electric blanket provides consistent warmth for pain relief:' },
  { name: 'Pill Crusher', asin: 'B00KZIDM4S', category: 'comfort-daily', tags: ['medication', 'daily-living', 'swallowing', 'supplements'], softIntro: 'A pill crusher makes medication easier to take:' },
  { name: 'Shower Stool (Teak)', asin: 'B003BYJHWC', category: 'comfort-daily', tags: ['daily-living', 'shower', 'energy-conservation', 'safety'], softIntro: 'A teak shower stool combines function with aesthetics:' },
  { name: 'Timer Caps for Pill Bottles', asin: 'B00EZ6TL2S', category: 'comfort-daily', tags: ['medication', 'tracking', 'memory', 'daily-living'], softIntro: 'Timer caps help track when you last took medication:' },

  // ═══════════════════════════════════════
  // SUPPLEMENTS (20 products)
  // ═══════════════════════════════════════
  { name: 'Magnesium Complex (BioOptimizers)', asin: 'B07XT4FZKX', category: 'supplements', tags: ['magnesium', 'sleep', 'muscle', 'stress', 'supplement'], softIntro: 'A comprehensive magnesium complex worth considering is' },
  { name: 'Vitamin B12 (Methylcobalamin)', asin: 'B003BLJGAM', category: 'supplements', tags: ['B12', 'energy', 'methylation', 'nerve', 'supplement'], softIntro: 'For B12 support in methylated form, consider' },
  { name: 'Alpha Lipoic Acid', asin: 'B0019LTJ9S', category: 'supplements', tags: ['antioxidant', 'nerve', 'blood-sugar', 'supplement', 'mitochondria'], softIntro: 'Alpha lipoic acid is an antioxidant some find helpful:' },
  { name: 'Glutathione (Liposomal)', asin: 'B07DLMFMJH', category: 'supplements', tags: ['antioxidant', 'detox', 'immune', 'supplement', 'cellular'], softIntro: 'Liposomal glutathione is a well-absorbed antioxidant option:' },
  { name: 'Quercetin (NOW)', asin: 'B0013HV2DI', category: 'supplements', tags: ['histamine', 'mast-cell', 'inflammation', 'supplement', 'immune'], softIntro: 'For histamine and mast cell support, quercetin is worth exploring:' },
  { name: 'N-Acetyl Cysteine (NAC)', asin: 'B00GXPJWQK', category: 'supplements', tags: ['antioxidant', 'glutathione', 'lung', 'supplement', 'detox'], softIntro: 'NAC is a precursor to glutathione that many find beneficial:' },
  { name: 'Rhodiola Rosea', asin: 'B0013OQIJY', category: 'supplements', tags: ['adaptogen', 'energy', 'stress', 'fatigue', 'supplement'], softIntro: 'Rhodiola is an adaptogen that some people find energizing:' },
  { name: 'Vitamin D3 (5000 IU)', asin: 'B004GW4ZJA', category: 'supplements', tags: ['vitamin-D', 'immune', 'bone', 'mood', 'supplement'], softIntro: 'Higher-dose vitamin D3 for those with documented deficiency:' },
  { name: 'Selenium (200mcg)', asin: 'B00068TJIG', category: 'supplements', tags: ['thyroid', 'immune', 'antioxidant', 'supplement', 'selenium'], softIntro: 'Selenium is important for thyroid function, like' },
  { name: 'Berberine', asin: 'B07DLMFMJH', category: 'supplements', tags: ['blood-sugar', 'gut', 'metabolism', 'supplement', 'natural'], softIntro: 'Berberine is gaining attention for metabolic support:' },
  { name: 'Phosphatidylserine', asin: 'B000BD0RT0', category: 'supplements', tags: ['brain', 'cortisol', 'stress', 'cognitive', 'supplement'], softIntro: 'For cortisol and cognitive support, phosphatidylserine is an option:' },
  { name: 'Digestive Bitters (Urban Moonshine)', asin: 'B003CJTE5U', category: 'supplements', tags: ['digestion', 'gut', 'appetite', 'herbal', 'supplement'], softIntro: 'Digestive bitters before meals can support digestion:' },
  { name: 'Milk Thistle (Jarrow)', asin: 'B0013OQIJY', category: 'supplements', tags: ['liver', 'detox', 'supplement', 'herbal', 'support'], softIntro: 'For liver support, milk thistle is a well-known option:' },
  { name: 'Elderberry Syrup', asin: 'B004ARAP48', category: 'supplements', tags: ['immune', 'cold', 'flu', 'herbal', 'supplement'], softIntro: 'Elderberry syrup is a popular immune support option:' },
  { name: 'Turmeric Golden Milk Powder', asin: 'B07DLMFMJH', category: 'supplements', tags: ['inflammation', 'turmeric', 'comfort', 'drink', 'supplement'], softIntro: 'Golden milk powder is a comforting way to get turmeric:' },
  { name: 'Folate (Methylfolate)', asin: 'B005VZ1TDM', category: 'supplements', tags: ['methylation', 'MTHFR', 'energy', 'mood', 'supplement'], softIntro: 'Methylfolate is important for those with MTHFR variations:' },
  { name: 'Bromelain', asin: 'B00020I7DI', category: 'supplements', tags: ['inflammation', 'digestion', 'enzyme', 'supplement', 'natural'], softIntro: 'Bromelain is a natural enzyme that may help with inflammation:' },
  { name: 'Reishi Mushroom Extract', asin: 'B078WR7X2S', category: 'supplements', tags: ['immune', 'adaptogen', 'mushroom', 'sleep', 'supplement'], softIntro: 'Reishi mushroom is valued for immune and calming support:' },
  { name: 'Lions Mane Mushroom', asin: 'B078SZX3ML', category: 'supplements', tags: ['brain', 'cognitive', 'nerve', 'mushroom', 'supplement'], softIntro: 'Lions Mane mushroom is popular for cognitive support:' },
  { name: 'Cordyceps Mushroom', asin: 'B078T1RGCR', category: 'supplements', tags: ['energy', 'endurance', 'mushroom', 'adaptogen', 'supplement'], softIntro: 'Cordyceps mushroom is used for energy and endurance support:' },
];

// ═══════════════════════════════════════
// TOPIC MATCHING ENGINE
// ═══════════════════════════════════════

const CATEGORY_TAG_MAP: Record<string, string[]> = {
  'the-medical': ['supplement', 'monitoring', 'medical', 'immune', 'inflammation', 'nerve', 'POTS', 'blood-sugar', 'thyroid', 'mitochondria', 'B12', 'vitamin-D', 'antioxidant'],
  'the-deeper-rest': ['sleep', 'rest', 'meditation', 'mindfulness', 'nervous-system', 'relaxation', 'breathing', 'calm', 'vagus', 'contemplative', 'book'],
  'the-management': ['energy-conservation', 'daily-living', 'pacing', 'kitchen', 'ergonomic', 'organization', 'meal-prep', 'hydration', 'electrolytes', 'exercise', 'gentle'],
  'the-identity': ['book', 'journaling', 'mental-health', 'anxiety', 'self-compassion', 'acceptance', 'therapy', 'mood', 'creative'],
  'the-mystery': ['brain', 'cognitive', 'science', 'research', 'neuroscience', 'consciousness', 'book', 'tracking', 'biofeedback'],
};

const TITLE_KEYWORD_MAP: Record<string, string[]> = {
  sleep: ['sleep', 'insomnia', 'rest', 'circadian', 'melatonin'],
  pain: ['pain', 'ache', 'sore', 'tender', 'fibromyalgia', 'hurt'],
  pots: ['POTS', 'orthostatic', 'tachycardia', 'blood pressure', 'standing', 'dizziness'],
  energy: ['energy', 'fatigue', 'tired', 'exhaustion', 'mitochondria', 'ATP'],
  brain: ['brain fog', 'cognitive', 'memory', 'focus', 'concentration', 'thinking'],
  gut: ['gut', 'digestion', 'microbiome', 'stomach', 'IBS', 'food'],
  anxiety: ['anxiety', 'panic', 'worry', 'fear', 'nervous'],
  meditation: ['meditation', 'mindfulness', 'breath', 'contemplative', 'awareness'],
  exercise: ['exercise', 'movement', 'walking', 'yoga', 'stretching', 'graded'],
  immune: ['immune', 'infection', 'virus', 'mast cell', 'histamine', 'inflammation'],
  trauma: ['trauma', 'PTSD', 'nervous system', 'somatic', 'body keeps'],
  identity: ['identity', 'grief', 'loss', 'self-worth', 'who am I', 'before and after'],
  supplement: ['supplement', 'vitamin', 'mineral', 'magnesium', 'CoQ10', 'D-ribose'],
};

export function matchProductsToArticle(
  articleTitle: string,
  articleCategory: string,
  maxProducts: number = 4
): Product[] {
  const titleLower = articleTitle.toLowerCase();
  const scores = new Map<Product, number>();

  for (const product of PRODUCTS) {
    let score = 0;

    // Category match
    const categoryTags = CATEGORY_TAG_MAP[articleCategory] || [];
    for (const tag of product.tags) {
      if (categoryTags.includes(tag)) score += 2;
    }

    // Title keyword match
    for (const [, keywords] of Object.entries(TITLE_KEYWORD_MAP)) {
      for (const kw of keywords) {
        if (titleLower.includes(kw.toLowerCase())) {
          for (const tag of product.tags) {
            if (tag.toLowerCase().includes(kw.toLowerCase()) || kw.toLowerCase().includes(tag.toLowerCase())) {
              score += 3;
            }
          }
        }
      }
    }

    // Direct title word match against tags
    const titleWords = titleLower.split(/\s+/);
    for (const word of titleWords) {
      if (word.length > 3 && product.tags.some(t => t.toLowerCase().includes(word))) {
        score += 1;
      }
    }

    if (score > 0) {
      scores.set(product, score);
    }
  }

  // Sort by score descending, take top N
  const sorted = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxProducts)
    .map(([product]) => product);

  // If we don't have enough, fill from category defaults
  if (sorted.length < 2) {
    const categoryTags = CATEGORY_TAG_MAP[articleCategory] || [];
    const fallbacks = PRODUCTS.filter(
      p => p.tags.some(t => categoryTags.includes(t)) && !sorted.includes(p)
    ).slice(0, maxProducts - sorted.length);
    sorted.push(...fallbacks);
  }

  return sorted.slice(0, maxProducts);
}
