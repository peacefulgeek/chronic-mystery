#!/usr/bin/env node
/**
 * bulk-seed.mjs — 500-Article Bulk Seed for Chronic Mystery
 *
 * Generates 500 articles via DeepSeek V4-Pro and writes them
 * directly to articles.json. Uses the 40-image Bunny CDN library
 * rotation strategy. Articles go live immediately.
 *
 * Usage:
 *   DEEPSEEK_API_KEY=sk-xxx node scripts/bulk-seed.mjs
 *
 * Optional env:
 *   BATCH_SIZE=5        (concurrent articles per batch, default 5)
 *   TARGET_COUNT=500    (total articles to generate, default 500)
 *   START_OFFSET=0      (skip first N topics, for resuming)
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { generateArticle, duplicateImageOnBunny } from "../src/lib/deepseek-writer.mjs";
import { pickImage } from "../src/lib/image-library.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_PATH = resolve(__dirname, "../client/src/data/articles.json");

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "3", 10);
const TARGET_COUNT = parseInt(process.env.TARGET_COUNT || "500", 10);
const START_OFFSET = parseInt(process.env.START_OFFSET || "0", 10);

// ── Categories ──
const CATEGORIES = [
  "the-medical", "the-mystery", "the-management", "the-identity", "the-deeper-rest"
];

// ── Massive topic bank: 100 per category = 500 total ──
const TOPIC_BANK = {
  "the-medical": [
    "Mitochondrial Dysfunction and Chronic Fatigue",
    "The Vagus Nerve Connection to ME/CFS",
    "Mast Cell Activation and Fatigue",
    "Small Fiber Neuropathy in Chronic Illness",
    "Autoimmune Overlap with ME/CFS",
    "Neuroinflammation and Brain Fog",
    "The Gut-Brain Axis in Chronic Fatigue",
    "Metabolic Traps in ME/CFS Research",
    "Orthostatic Intolerance Beyond POTS",
    "Immune Dysregulation in Post-Viral Fatigue",
    "Endocrine Disruption in Chronic Illness",
    "The Role of Oxidative Stress in ME/CFS",
    "Viral Persistence and Chronic Fatigue",
    "Blood Volume Deficiency in ME/CFS",
    "The HPA Axis and Chronic Fatigue",
    "Microbiome Changes in ME/CFS Patients",
    "Cytokine Storms and Post-Viral Fatigue",
    "Craniocervical Instability and ME/CFS",
    "The Two-Day Cardiopulmonary Exercise Test",
    "Low-Dose Naltrexone for Chronic Fatigue",
    "B Cell Depletion Therapy Research",
    "The Role of Mold Illness in Chronic Fatigue",
    "Ehlers-Danlos Syndrome and ME/CFS Overlap",
    "Thiamine Deficiency and Energy Production",
    "The Nanoneedle Test for ME/CFS Diagnosis",
    "Cerebral Blood Flow Abnormalities in ME/CFS",
    "Spinal Fluid Abnormalities in Chronic Fatigue",
    "The Role of NK Cells in ME/CFS",
    "Ion Channel Dysfunction in Chronic Fatigue",
    "Metabolomics and ME/CFS Biomarkers",
    "The Tilt Table Test Explained",
    "Lactate Accumulation and Exercise Intolerance",
    "Red Blood Cell Deformability in ME/CFS",
    "The Role of Glutathione in Chronic Fatigue",
    "Adrenal Fatigue Versus Adrenal Dysfunction",
    "The Connection Between EBV and ME/CFS",
    "Mast Cell Stabilizers for Chronic Fatigue",
    "Intracranial Pressure and ME/CFS Symptoms",
    "The Role of Coenzyme Q10 in Energy Production",
    "Autonomic Nervous System Testing for ME/CFS",
    "Thyroid Dysfunction Hidden in Normal Labs",
    "The Itaconate Shunt Hypothesis",
    "Rituximab Trials and What They Taught Us",
    "Sleep Architecture Disruption in ME/CFS",
    "The Role of Magnesium in Chronic Fatigue",
    "Neuroimaging Findings in ME/CFS Patients",
    "The Dauer Hypothesis of ME/CFS",
    "Mitochondrial DNA Mutations and Fatigue",
    "The Role of Iron Deficiency Without Anemia",
    "Cardiac Preload Failure in ME/CFS",
    "The Connection Between MCAS and POTS",
    "Peptide Therapy Research for Chronic Fatigue",
    "The Role of Vitamin D in Immune Function",
    "Hypermobility Spectrum Disorders and Fatigue",
    "The Microclot Theory of Long COVID and ME/CFS",
    "Stellate Ganglion Block for Autonomic Dysfunction",
    "The Role of Histamine in Chronic Fatigue",
    "Functional Medicine Approaches to ME/CFS",
    "The Connection Between Lyme Disease and ME/CFS",
    "Intravenous Immunoglobulin Therapy Research",
    "The Role of Zinc in Immune Recovery",
    "Apheresis Treatment for Chronic Fatigue",
    "The Connection Between Celiac Disease and Fatigue",
    "Wearable Technology for Monitoring ME/CFS",
    "The Role of Melatonin Beyond Sleep",
    "Cognitive Behavioral Therapy Controversy in ME/CFS",
    "The PACE Trial and Its Aftermath",
    "Graded Exercise Therapy Harm in ME/CFS",
    "The Role of Omega-3 Fatty Acids in Inflammation",
    "Plasmapheresis Research for Post-Viral Fatigue",
    "The Connection Between TMJ and Chronic Fatigue",
    "Vagus Nerve Stimulation Devices for ME/CFS",
    "The Role of Probiotics in Gut-Brain Health",
    "Hyperbaric Oxygen Therapy for Chronic Fatigue",
    "The Connection Between Sleep Apnea and ME/CFS",
    "Stem Cell Research for Chronic Fatigue",
    "The Role of Curcumin in Inflammation Management",
    "Genetic Susceptibility to Post-Viral Fatigue",
    "The Connection Between Fibromyalgia and ME/CFS",
    "Antihistamine Protocols for Mast Cell Activation",
    "The Role of Electrolytes in POTS Management",
    "Biofilm Infections and Chronic Fatigue",
    "The Connection Between Narcolepsy and ME/CFS",
    "Fecal Microbiota Transplant Research",
    "The Role of Berberine in Metabolic Support",
    "Craniosacral Therapy for Chronic Fatigue",
    "The Connection Between Chronic Pain and Fatigue",
    "Photobiomodulation for Neuroinflammation",
    "The Role of Acetyl-L-Carnitine in Energy",
    "Mold Biotoxin Illness and Chronic Fatigue",
    "The Connection Between Anxiety and ME/CFS",
    "Ozone Therapy Research for Chronic Illness",
    "The Role of Selenium in Thyroid Function",
    "Compression Garment Science for POTS",
    "The Connection Between Migraines and ME/CFS",
    "Saline Infusion Therapy for Blood Volume",
    "The Role of NAD Plus in Cellular Energy",
    "Acupuncture Research for Chronic Fatigue",
    "The Connection Between Diabetes and Fatigue",
    "Immunoadsorption Therapy for ME/CFS",
  ],
  "the-mystery": [
    "Why Your Labs Are Normal But You Are Not",
    "The History of ME/CFS Dismissal",
    "What Doctors Still Get Wrong About Fatigue",
    "The Gender Gap in Chronic Illness Research",
    "Why ME/CFS Takes So Long to Diagnose",
    "The Connection Between Trauma and Chronic Illness",
    "When Your Body Keeps Score",
    "The Invisible Illness Paradox",
    "Why Exercise Makes ME/CFS Worse",
    "The Post-COVID Chronic Fatigue Wave",
    "What EBV Has to Do With Chronic Fatigue",
    "The Mystery of Fluctuating Symptoms",
    "Why Some People Recover and Others Do Not",
    "The Childhood Onset ME/CFS Question",
    "Environmental Triggers Nobody Talks About",
    "The Genetic Predisposition Question",
    "Why Stress Is Not the Whole Story",
    "The Nocebo Effect and Chronic Illness",
    "What We Can Learn From Long COVID Research",
    "The Microbiome Mystery in Chronic Fatigue",
    "Why Your Doctor Has Never Heard of PEM",
    "The Paradox of Looking Healthy While Sick",
    "What Brain Imaging Reveals About ME/CFS",
    "The Connection Between Infections and Autoimmunity",
    "Why Standard Blood Tests Miss ME/CFS",
    "The Role of Epigenetics in Chronic Fatigue",
    "What Animal Models Tell Us About ME/CFS",
    "The Mystery of Symptom Clusters",
    "Why ME/CFS Research Is Underfunded",
    "The Overlap Between Fibromyalgia and ME/CFS",
    "The Lake Tahoe Outbreak That Started It All",
    "Why Chronic Fatigue Is Not Just Being Tired",
    "The Psychiatric Misdiagnosis Problem",
    "What Happens During a Crash",
    "The Mystery of Good Days and Bad Days",
    "Why Your Fitbit Data Tells a Different Story",
    "The Connection Between Gulf War Illness and ME/CFS",
    "What Happens When You Push Through",
    "The Mystery of Sensory Overload",
    "Why ME/CFS Patients Distrust Doctors",
    "The Yuppie Flu Myth and Its Damage",
    "What Happens to Your Brain During Brain Fog",
    "The Mystery of Temperature Dysregulation",
    "Why Recovery Stories Can Be Harmful",
    "The Connection Between Mono and ME/CFS",
    "What Happens When Insurance Denies Your Claim",
    "The Mystery of Chemical Sensitivity",
    "Why Your Friends Stopped Calling",
    "The Connection Between Vaccines and ME/CFS Claims",
    "What Happens When You Get a Second Illness",
    "The Mystery of Post-Exertional Malaise Delay",
    "Why ME/CFS Is Not Depression",
    "The Connection Between Childhood Adversity and ME/CFS",
    "What Happens During an Adrenaline Surge",
    "The Mystery of Alcohol Intolerance",
    "Why Some Doctors Still Say It Is All in Your Head",
    "The Connection Between Dental Infections and Fatigue",
    "What Happens When You Stop Fighting Your Body",
    "The Mystery of Sound Sensitivity",
    "Why ME/CFS Patients Are Their Own Best Researchers",
    "The Connection Between Mold Exposure and Onset",
    "What Happens When You Finally Get a Diagnosis",
    "The Mystery of Light Sensitivity",
    "Why Pacing Feels Like Giving Up",
    "The Connection Between Anesthesia and ME/CFS Flares",
    "What Happens When Your Partner Does Not Believe You",
    "The Mystery of Cognitive Dysfunction Patterns",
    "Why Comparison Is the Thief of Peace in Chronic Illness",
    "The Connection Between Stress and Immune Collapse",
    "What Happens When You Lose Your Career",
    "The Mystery of Symptom Severity Fluctuation",
    "Why Hope Can Be Complicated in Chronic Illness",
    "The Connection Between Gut Permeability and Fatigue",
    "What Happens When You Accept the Diagnosis",
    "The Mystery of Exercise Intolerance",
    "Why Your Blood Work Looks Fine",
    "The Connection Between Chronic Fatigue and Aging",
    "What Happens When You Tell People You Have ME/CFS",
    "The Mystery of Unrefreshing Sleep",
    "Why Doctors Need Better ME/CFS Education",
    "The Connection Between Pesticides and Chronic Fatigue",
    "What Happens When You Find Your People",
    "The Mystery of Orthostatic Intolerance",
    "Why Graded Exercise Therapy Failed",
    "The Connection Between Heavy Metals and Fatigue",
    "What Happens When Research Finally Catches Up",
    "The Mystery of Immune Activation Without Infection",
    "Why Your Symptoms Change With the Weather",
    "The Connection Between Birth Control and Fatigue",
    "What Happens When You Advocate for Yourself",
    "The Mystery of Autonomic Dysfunction",
    "Why ME/CFS Needs Its Own Medical Specialty",
    "The Connection Between Concussions and Chronic Fatigue",
    "What Happens When You Stop Explaining",
    "The Mystery of Hormonal Fluctuations in ME/CFS",
    "Why the Name ME/CFS Does Not Help",
    "The Connection Between Surgery and ME/CFS Onset",
    "What Happens When You Redefine Normal",
    "The Mystery of Viral Reactivation",
    "Why Chronic Fatigue Research Matters for Everyone",
  ],
  "the-management": [
    "The Art of Pacing With Chronic Fatigue",
    "Building Your Energy Envelope",
    "Sleep Hygiene When Sleep Does Not Refresh",
    "Meal Planning When Cooking Is Too Much",
    "Managing Brain Fog at Work",
    "The Boom-Bust Cycle and How to Break It",
    "Supplements That Actually Have Evidence",
    "Creating a Crash Recovery Protocol",
    "How to Talk to Your Doctor About ME/CFS",
    "Managing Sensory Overload",
    "The Spoon Theory in Practice",
    "Gentle Movement That Does Not Cause PEM",
    "Managing Chronic Pain Without Overdoing It",
    "Building a Support System When You Are Housebound",
    "Financial Planning With Chronic Illness",
    "Heat and Cold Sensitivity Management",
    "Managing Multiple Chemical Sensitivity",
    "Creating an Accessible Home Environment",
    "The Role of Hydration in Symptom Management",
    "Managing Social Energy With Chronic Fatigue",
    "Technology Tools for Energy Management",
    "Managing Flares During Important Events",
    "The Role of Compression Garments",
    "Building a Medical Team That Listens",
    "Managing Chronic Illness in Hot Weather",
    "The Role of Salt Loading in POTS Management",
    "Cognitive Pacing Strategies",
    "Managing Medication Side Effects",
    "Creating a Symptom Tracking System",
    "Disability Application Strategies",
    "Grocery Shopping With Limited Energy",
    "Managing Doctor Appointments Efficiently",
    "The Art of Saying No Without Guilt",
    "Creating a Flare Kit for Bad Days",
    "Managing Screen Time With Light Sensitivity",
    "Batch Cooking for Energy Conservation",
    "The Role of Routine in Symptom Management",
    "Managing Travel With Chronic Fatigue",
    "Creating a Rest Schedule That Works",
    "Managing Work From Home With ME/CFS",
    "The Role of Meditation in Pain Management",
    "Managing Relationships While Chronically Ill",
    "Creating Boundaries With Family Members",
    "The Role of Physical Therapy in ME/CFS",
    "Managing Dental Care With Chronic Fatigue",
    "Creating a Communication Card for Bad Days",
    "The Role of Occupational Therapy",
    "Managing Grocery Delivery and Meal Services",
    "Creating an Emergency Plan for Severe Crashes",
    "The Role of Adaptive Equipment",
    "Managing Personal Hygiene During Crashes",
    "Creating a Medication Management System",
    "The Role of Voice Assistants for Energy Saving",
    "Managing Laundry With Limited Energy",
    "Creating a Pacing Diary",
    "The Role of Weighted Blankets in Sleep",
    "Managing Noise Sensitivity at Home",
    "Creating a Comfortable Workspace",
    "The Role of Blue Light Filters",
    "Managing Appointments and Scheduling",
    "Creating a Supplement Schedule",
    "The Role of Gentle Yoga in ME/CFS",
    "Managing Pet Care With Chronic Fatigue",
    "Creating a Self-Care Routine That Fits",
    "The Role of Aromatherapy in Symptom Relief",
    "Managing Cleaning With Limited Energy",
    "Creating a Crash Prevention Checklist",
    "The Role of Water Temperature in Symptom Management",
    "Managing Social Media Without Draining Energy",
    "Creating a Gratitude Practice for Hard Days",
    "The Role of Compression Socks in POTS",
    "Managing Seasonal Symptom Changes",
    "Creating a Bedtime Routine for Better Sleep",
    "The Role of Electrolyte Drinks in Daily Management",
    "Managing Brain Fog With Lists and Timers",
    "Creating a Weekly Energy Budget",
    "The Role of Heating Pads in Pain Relief",
    "Managing Emotional Triggers",
    "Creating a Support Network Online",
    "The Role of Cold Therapy in Inflammation",
    "Managing Chronic Fatigue During Pregnancy",
    "Creating a Morning Routine That Works",
    "The Role of Magnesium in Sleep Quality",
    "Managing Chronic Illness and Parenting",
    "Creating a Meal Prep System",
    "The Role of Probiotics in Gut Health",
    "Managing Energy During Social Events",
    "Creating a Relaxation Toolkit",
    "The Role of Breathing Exercises",
    "Managing Chronic Fatigue in Winter",
    "Creating a Pain Management Plan",
    "The Role of Foam Rolling in Recovery",
    "Managing Information Overload About Your Illness",
    "Creating a Sustainable Exercise Routine",
    "The Role of Acupressure Mats",
    "Managing Chronic Fatigue and Driving",
    "Creating a Hospital Bag for ER Visits",
    "The Role of Infrared Therapy",
    "Managing Chronic Illness and Holidays",
    "Creating a Long-Term Management Strategy",
  ],
  "the-identity": [
    "Grieving the Life You Planned",
    "Who Are You Without Productivity",
    "The Loneliness of Chronic Illness",
    "Relationships When You Can Not Show Up",
    "Redefining Success With Chronic Fatigue",
    "The Guilt of Being Sick",
    "Finding Purpose When Your Body Says No",
    "The Anger Nobody Talks About",
    "Chronic Illness and Self-Worth",
    "When Friends Do Not Understand",
    "The Mask of Looking Fine",
    "Parenting With Chronic Fatigue",
    "Career Loss and Identity Crisis",
    "The Comparison Trap in Chronic Illness",
    "Finding Community When You Are Isolated",
    "The Unexpected Gifts of Forced Stillness",
    "Chronic Illness and Intimate Relationships",
    "The Shame of Needing Help",
    "Rebuilding Identity After Diagnosis",
    "When Your Partner Becomes Your Caregiver",
    "The Invisibility of Young People With ME/CFS",
    "Chronic Illness and the Holidays",
    "The Weight of Medical Gaslighting",
    "Finding Joy in Small Moments",
    "The Grief That Has No Name",
    "Chronic Illness and Social Media",
    "When Your Family Does Not Believe You",
    "The Art of Asking for Help",
    "Chronic Illness and Aging",
    "The Unexpected Wisdom of Illness",
    "The Identity Shift Nobody Warns You About",
    "When Your Body Betrays Your Ambition",
    "The Mourning Period After Diagnosis",
    "Finding Worth Beyond What You Can Do",
    "The Complicated Grief of Chronic Illness",
    "When You Can Not Be the Friend You Used to Be",
    "The Identity of Being a Patient",
    "Finding Meaning in the Mundane",
    "The Loss of Spontaneity",
    "When Your Illness Becomes Your Personality",
    "The Courage of Vulnerability in Chronic Illness",
    "Finding Yourself in the Wreckage",
    "The Pressure to Be Inspirational",
    "When You Grieve a Future That Never Happened",
    "The Identity Crisis of Invisible Disability",
    "Finding Strength You Did Not Know You Had",
    "The Loneliness of Being Misunderstood",
    "When Your Illness Changes Your Relationships",
    "The Art of Letting Go of Who You Were",
    "Finding Beauty in the Broken",
    "The Weight of Unsolicited Advice",
    "When You Stop Apologizing for Being Sick",
    "The Identity of Being Chronically Unreliable",
    "Finding Peace With Your Limitations",
    "The Grief of Lost Friendships",
    "When Your Children See You Struggle",
    "The Identity of Being a Burden",
    "Finding Grace in the Hard Days",
    "The Loss of Professional Identity",
    "When You Can Not Keep Up With Life",
    "The Identity of Being Dependent",
    "Finding Compassion for Yourself",
    "The Weight of Invisible Suffering",
    "When You Realize You Are Not Getting Better",
    "The Identity of Being Different",
    "Finding Connection in Shared Suffering",
    "The Loss of Your Former Self",
    "When You Stop Performing Wellness",
    "The Identity of Living in Limbo",
    "Finding Acceptance Without Giving Up",
    "The Weight of Chronic Uncertainty",
    "When Your Illness Teaches You Boundaries",
    "The Identity of Being a Survivor",
    "Finding Your Voice in Chronic Illness",
    "The Loss of Independence",
    "When You Learn to Rest Without Guilt",
    "The Identity of Being Enough",
    "Finding Love When You Are Chronically Ill",
    "The Weight of Being Strong",
    "When You Finally Stop Pretending",
    "The Identity of Chronic Illness Advocacy",
    "Finding Humor in the Absurd",
    "The Loss of Your Social Circle",
    "When You Accept Help Without Shame",
    "The Identity of Being a Caregiver to Yourself",
    "Finding Purpose in Pain",
    "The Weight of Invisible Disability",
    "When You Rewrite Your Story",
    "The Identity of Being Resilient",
    "Finding Home in Your Body Again",
    "The Loss of Certainty",
    "When You Choose Yourself Over Expectations",
    "The Identity of Chronic Illness in Midlife",
    "Finding Solidarity in Suffering",
    "The Weight of Being Believed",
    "When You Stop Comparing Timelines",
    "The Identity of Healing",
    "Finding Freedom in Acceptance",
    "The Loss of the Life You Imagined",
    "When You Become Your Own Advocate",
  ],
  "the-deeper-rest": [
    "Rest as Radical Act",
    "The Contemplative Life of Chronic Illness",
    "Surrender Is Not Giving Up",
    "Finding Stillness in the Storm",
    "The Spiritual Dimensions of Suffering",
    "Meditation When Your Body Hurts",
    "The Practice of Radical Acceptance",
    "What Illness Teaches About Impermanence",
    "The Wisdom of the Body",
    "Breathwork for the Chronically Ill",
    "The Dark Night of the Soul and Chronic Illness",
    "Finding Sacred Space in Bed Rest",
    "The Paradox of Healing Through Stopping",
    "Chronic Illness as Spiritual Initiation",
    "The Practice of Self-Compassion",
    "What Buddhism Teaches About Suffering and Fatigue",
    "The Art of Doing Nothing",
    "Gratitude Practice When Everything Hurts",
    "The Nervous System and Spiritual Practice",
    "Finding Meaning in the Meaningless",
    "The Rhythm of Rest and Activity",
    "Chronic Illness and the Myth of Control",
    "The Gift of Slowing Down",
    "What Trees Teach Us About Rest",
    "The Practice of Being Present With Pain",
    "Chronic Illness and the Seasons",
    "The Quiet Revolution of Rest",
    "Finding Peace With Uncertainty",
    "The Body as Teacher",
    "The Art of Gentle Living",
    "The Monastery of the Sick Bed",
    "When Stillness Becomes Your Practice",
    "The Sacred Pause Between Breaths",
    "Finding God in the Waiting Room",
    "The Contemplative Art of Doing Less",
    "When Illness Strips Away Everything Unnecessary",
    "The Wisdom of Winter Dormancy",
    "Finding Light in the Darkness of Illness",
    "The Practice of Surrendering Control",
    "When Your Body Becomes Your Meditation",
    "The Spiritual Practice of Pacing",
    "Finding Wholeness in Brokenness",
    "The Contemplative Tradition of Suffering",
    "When Rest Becomes Resistance",
    "The Sacred Geometry of Healing",
    "Finding Silence in a Noisy World",
    "The Practice of Gentle Awareness",
    "When Illness Opens a Door You Did Not Know Existed",
    "The Wisdom of Letting Things Be",
    "Finding the Sacred in the Ordinary",
    "The Practice of Non-Doing",
    "When Your Illness Becomes Your Teacher",
    "The Contemplative Path of Chronic Pain",
    "Finding Refuge in the Present Moment",
    "The Practice of Loving Kindness Toward Your Body",
    "When Healing Means Something Different",
    "The Wisdom of the Seasons of Illness",
    "Finding Depth in the Shallow End",
    "The Practice of Sitting With Discomfort",
    "When Your Limitations Become Your Liberation",
    "The Contemplative Art of Waiting",
    "Finding Beauty in the Stillness",
    "The Practice of Embodied Awareness",
    "When Illness Teaches You to Listen",
    "The Wisdom of the Body's Rhythms",
    "Finding Grace in the Struggle",
    "The Practice of Compassionate Self-Talk",
    "When Your Bed Becomes Your Sanctuary",
    "The Contemplative Life of the Housebound",
    "Finding Freedom in Constraint",
    "The Practice of Mindful Rest",
    "When Illness Reveals What Matters",
    "The Wisdom of Slowing Down",
    "Finding Connection in Solitude",
    "The Practice of Acceptance Without Resignation",
    "When Your Body Asks You to Stop",
    "The Contemplative Art of Recovery",
    "Finding Meaning in the Pause",
    "The Practice of Being Gentle With Yourself",
    "When Illness Changes Your Relationship With Time",
    "The Wisdom of the Wounded Healer",
    "Finding Peace in the Storm",
    "The Practice of Resting in Awareness",
    "When Your Illness Becomes Sacred Ground",
    "The Contemplative Path of Surrender",
    "Finding Hope Without Expectation",
    "The Practice of Deep Listening",
    "When Stillness Speaks",
    "The Wisdom of Not Knowing",
    "Finding Your Center in Chaos",
    "The Practice of Radical Rest",
    "When Your Body Writes the Rules",
    "The Contemplative Art of Patience",
    "Finding Strength in Softness",
    "The Practice of Being Here Now",
    "When Illness Opens Your Heart",
    "The Wisdom of the Slow Path",
    "Finding Yourself in the Quiet",
    "The Practice of Holding Space for Pain",
    "When Rest Becomes Your Revolution",
  ],
};

// ── Helpers ──
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Main ──
async function main() {
  console.log("=== Chronic Mystery Bulk Seed ===");
  console.log(`Target: ${TARGET_COUNT} articles`);
  console.log(`Batch size: ${BATCH_SIZE} concurrent`);
  console.log(`Start offset: ${START_OFFSET}`);
  const apiKey = process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY;
  console.log(`API KEY: ${apiKey ? "set" : "NOT SET"}`);
  console.log(`BASE URL: ${process.env.OPENAI_BASE_URL || "https://api.deepseek.com"}`);
  console.log(`MODEL: ${process.env.OPENAI_MODEL || "deepseek-v4-pro"}`);

  if (!apiKey) {
    console.error("ERROR: OPENAI_API_KEY or DEEPSEEK_API_KEY is required");
    process.exit(1);
  }

  // Load existing articles
  const articles = JSON.parse(readFileSync(ARTICLES_PATH, "utf-8"));
  const existingSlugs = new Set(articles.map(a => a.slug));
  let maxId = Math.max(0, ...articles.map(a => a.id));

  console.log(`Existing articles: ${articles.length} (max ID: ${maxId})`);

  // Build topic queue from all categories, interleaved
  const topicQueue = [];
  const maxPerCat = Math.ceil(TARGET_COUNT / CATEGORIES.length);

  for (let i = 0; i < maxPerCat; i++) {
    for (const cat of CATEGORIES) {
      const topics = TOPIC_BANK[cat] || [];
      if (i < topics.length) {
        const title = topics[i];
        const slug = slugify(title);
        if (!existingSlugs.has(slug)) {
          topicQueue.push({ title, category: cat, slug });
        }
      }
    }
  }

  // Apply offset and limit
  const toGenerate = topicQueue.slice(START_OFFSET, START_OFFSET + TARGET_COUNT);
  console.log(`Topics available after dedup: ${topicQueue.length}`);
  console.log(`Will generate: ${toGenerate.length} articles`);

  if (toGenerate.length === 0) {
    console.log("No new topics to generate. Exiting.");
    process.exit(0);
  }

  // Generate dates spread across the past and future
  // Past 90 days + next 30 days, evenly distributed
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 90);

  let generated = 0;
  let failed = 0;
  const usedImageIds = [];
  const startTime = Date.now();

  // Process in batches
  for (let batchStart = 0; batchStart < toGenerate.length; batchStart += BATCH_SIZE) {
    const batch = toGenerate.slice(batchStart, batchStart + BATCH_SIZE);
    const batchNum = Math.floor(batchStart / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toGenerate.length / BATCH_SIZE);

    console.log(`\n--- Batch ${batchNum}/${totalBatches} (${batch.length} articles) ---`);

    const promises = batch.map(async (topic, idx) => {
      const articleIdx = batchStart + idx;
      const articleId = maxId + articleIdx + 1;

      // All new articles go into the queue (invisible until drip-feed publishes them)
      const articleDate = new Date("2099-01-01T00:00:00.000Z");

      try {
        const article = await generateArticle({
          title: topic.title,
          category: topic.category,
          dateISO: articleDate.toISOString(),
          id: articleId,
          usedImageIds,
          maxRetries: 3,
        });

        // Track used image IDs to avoid repeats
        if (article._imageId) usedImageIds.push(article._imageId);
        // Reset tracking after cycling through all 40
        if (usedImageIds.length >= 40) usedImageIds.length = 0;

        // Duplicate image on Bunny CDN (skip if no API key - just use library URL)
        const { heroUrl, ogUrl } = await duplicateImageOnBunny(article.heroImage, topic.slug);
        article.heroImage = heroUrl;
        article.ogImage = ogUrl;

        // Clean up internal fields
        delete article._imageId;
        delete article.gateResult;

        // Mark as queued for drip-feed
        article.status = "queued";

        return article;
      } catch (err) {
        console.error(`  FAILED: "${topic.title}" - ${err.message}`);
        return null;
      }
    });

    const results = await Promise.all(promises);

    for (const article of results) {
      if (article) {
        articles.push(article);
        generated++;
        console.log(`  OK: "${article.title}" (${article.wordCount} words, ${article.category})`);
      } else {
        failed++;
      }
    }

    // Save after each batch (crash safety)
    writeFileSync(ARTICLES_PATH, JSON.stringify(articles, null, 2));
    console.log(`  Saved. Total: ${articles.length} articles (${generated} new, ${failed} failed)`);

    // Rate limiting: 2 second pause between batches
    if (batchStart + BATCH_SIZE < toGenerate.length) {
      await delay(5000);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  console.log("\n=== Bulk Seed Complete ===");
  console.log(`Generated: ${generated}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total articles: ${articles.length}`);
  console.log(`Time: ${elapsed} minutes`);
  console.log(`Avg: ${(generated / (elapsed || 1)).toFixed(1)} articles/min`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
