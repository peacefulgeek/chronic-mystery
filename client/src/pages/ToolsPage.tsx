import { Link } from "wouter";
import { SITE_CONFIG } from "@/data/types";
import SeoHead from "@/components/seo/SeoHead";
import JsonLd from "@/components/seo/JsonLd";

const AMAZON_TAG = "spankyspinola-20";

interface Product {
  name: string;
  description: string;
  url: string;
  isAmazon: boolean;
}

interface ProductCategory {
  title: string;
  products: Product[];
}

function amz(asin: string) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}

const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    title: "Books on ME/CFS & Chronic Fatigue",
    products: [
      {
        name: "From Fatigued to Fantastic! (Fourth Edition) by Jacob Teitelbaum",
        description:
          "The most comprehensive clinical guide to chronic fatigue and fibromyalgia treatment. Teitelbaum's protocol has helped thousands of patients and this fourth edition is fully updated with the latest research.",
        url: amz("0593421507"),
        isAmazon: true,
      },
      {
        name: "The Body Keeps the Score by Bessel van der Kolk",
        description:
          "If you live with chronic illness, understanding how trauma lives in the body changes everything. Van der Kolk's work on somatic experiencing is foundational for anyone navigating the nervous system dimension of fatigue.",
        url: amz("0143127748"),
        isAmazon: true,
      },
      {
        name: "CFS Unravelled by Dan Neuffer",
        description:
          "A former ME/CFS patient who recovered, Neuffer maps the ANS dysfunction cycle with clarity that most medical texts lack. Practical and grounded in lived experience.",
        url: amz("0987509209"),
        isAmazon: true,
      },
      {
        name: "The Invisible Kingdom by Meghan O'Rourke",
        description:
          "A beautifully written exploration of what it means to live with a condition that medicine struggles to name. O'Rourke's journalism and personal narrative make this essential reading for anyone who has been told their symptoms are not real.",
        url: amz("1594633797"),
        isAmazon: true,
      },
      {
        name: "When the Body Says No by Gabor Maté",
        description:
          "Maté draws the connection between emotional stress and chronic illness with devastating precision. This book reframes the mind-body conversation in ways that feel honest rather than dismissive. We wrote about this connection in our article on <a href='/article/the-stress-response-and-chronic-fatigue' class='text-heather hover:underline'>the stress response and chronic fatigue</a>.",
        url: amz("0470923350"),
        isAmazon: true,
      },
    ],
  },
  {
    title: "Books on Mindfulness, Rest & Contemplative Practice",
    products: [
      {
        name: "Wherever You Go, There You Are by Jon Kabat-Zinn",
        description:
          "The foundational text on mindfulness meditation for people who don't want spiritual jargon. Kabat-Zinn's MBSR program has clinical evidence behind it, and this book is where most people start.",
        url: amz("1401307787"),
        isAmazon: true,
      },
      {
        name: "Rest Is Resistance by Tricia Hersey",
        description:
          "Hersey reframes rest as a radical act rather than a luxury. For anyone with chronic fatigue who carries guilt about not being productive, this book is medicine.",
        url: amz("0316365211"),
        isAmazon: true,
      },
      {
        name: "The Untethered Soul by Michael A. Singer",
        description:
          "Singer's exploration of consciousness and the observer self is directly relevant to the identity work that chronic illness demands. Simple language, profound depth.",
        url: amz("1572245379"),
        isAmazon: true,
      },
    ],
  },
  {
    title: "Journals & Workbooks",
    products: [
      {
        name: "The Chronic Illness Workbook by Patricia Fennell",
        description:
          "A structured approach to the phases of chronic illness — crisis, stabilization, resolution, integration. Fennell's four-phase model gives language to what you are already experiencing.",
        url: amz("0979640504"),
        isAmazon: true,
      },
      {
        name: "The Five Minute Journal",
        description:
          "When your energy is limited, a simple gratitude and intention practice can be the one thing you manage. This journal is designed for exactly that — no pressure, no performance.",
        url: amz("0991846206"),
        isAmazon: true,
      },
      {
        name: "Bullet Journal Dotted Notebook by Leuchtturm1917",
        description:
          "The gold standard for symptom tracking, pacing logs, and energy envelope journaling. The dot grid gives you structure without rigidity — exactly what pacing requires.",
        url: amz("B002TSIMW4"),
        isAmazon: true,
      },
    ],
  },
  {
    title: "Supplements & Nutrition",
    products: [
      {
        name: "CoQ10 (Ubiquinol) 200mg by Jarrow Formulas",
        description:
          "Mitochondrial support is central to ME/CFS management. Ubiquinol is the active form of CoQ10 and Jarrow's formulation is consistently well-reviewed. As we explored in our coverage of <a href='/article/mitochondrial-dysfunction-in-chronic-fatigue' class='text-heather hover:underline'>mitochondrial dysfunction</a>, this is one of the most studied supplements for fatigue conditions.",
        url: amz("B0013OQGO2"),
        isAmazon: true,
      },
      {
        name: "D-Ribose Powder by BulkSupplements",
        description:
          "D-Ribose supports ATP production — the cellular energy currency that ME/CFS patients are chronically short on. Mix it into water or tea. Start with 5g and see how your body responds.",
        url: amz("B00EYDJNQ4"),
        isAmazon: true,
      },
      {
        name: "Magnesium Glycinate 400mg by Doctor's Best",
        description:
          "Magnesium deficiency is common in chronic fatigue. Glycinate is the best-absorbed form and least likely to cause digestive issues. This is one of the first supplements most integrative practitioners recommend.",
        url: amz("B000BD0RT0"),
        isAmazon: true,
      },
      {
        name: "Vitamin D3 + K2 by Sports Research",
        description:
          "Many people with ME/CFS are vitamin D deficient, especially those who are housebound. The K2 addition ensures proper calcium metabolism. Get your levels tested first.",
        url: amz("B00JGCBGZQ"),
        isAmazon: true,
      },
      {
        name: "B-Complex Plus by Pure Encapsulations",
        description:
          "Methylated B vitamins for those with MTHFR variations — common in the ME/CFS population. Pure Encapsulations is hypoallergenic and free of common fillers.",
        url: amz("B001QWGYWY"),
        isAmazon: true,
      },
    ],
  },
  {
    title: "Devices & Physical Tools",
    products: [
      {
        name: "Muse 2 Brain Sensing Headband",
        description:
          "Real-time neurofeedback for meditation practice. When you cannot tell whether your nervous system is actually settling, the Muse gives you data. Particularly useful for people who dissociate during rest.",
        url: amz("B07HL2S9GQ"),
        isAmazon: true,
      },
      {
        name: "Zafu Meditation Cushion by Florensi",
        description:
          "Buckwheat hull filling, removable cover, proper height for cross-legged sitting. If you are going to sit, sit properly. Your body will thank you.",
        url: amz("B08DFYHT6V"),
        isAmazon: true,
      },
      {
        name: "Weighted Blanket 15lb by YnM",
        description:
          "Deep pressure stimulation calms the autonomic nervous system. For people with ME/CFS whose nervous systems run hot, a weighted blanket can be the difference between restless and restful.",
        url: amz("B073429DV2"),
        isAmazon: true,
      },
      {
        name: "Acupressure Mat and Pillow Set by ProsourceFit",
        description:
          "Thousands of pressure points that stimulate blood flow and trigger endorphin release. Fifteen minutes on this mat can shift your nervous system state when you do not have the energy for anything else.",
        url: amz("B00BVA7FJC"),
        isAmazon: true,
      },
      {
        name: "Oura Ring Generation 3",
        description:
          "The most accurate consumer-grade sleep and HRV tracker available. Heart rate variability is one of the best biomarkers for ME/CFS pacing — and the Oura tracks it continuously without requiring any effort from you.",
        url: amz("B0CS1LXDS8"),
        isAmazon: true,
      },
    ],
  },
  {
    title: "Apps & Digital Tools",
    products: [
      {
        name: "Visible App (ME/CFS Pacing)",
        description:
          "Built specifically for ME/CFS patients. Tracks heart rate, steps, and symptoms to help you stay within your energy envelope. The pacing feature alone makes it worth trying.",
        url: "https://www.makevisible.com/",
        isAmazon: false,
      },
      {
        name: "Insight Timer (Meditation App)",
        description:
          "Free meditation app with over 100,000 guided meditations. The timer feature lets you sit in silence with a gentle bell — no subscription required for the core features.",
        url: "https://insighttimer.com/",
        isAmazon: false,
      },
      {
        name: "Bearable (Symptom Tracker)",
        description:
          "Track symptoms, medications, activities, and mood in one place. The correlation reports help you identify patterns your brain cannot see when it is in the fog.",
        url: "https://bearable.app/",
        isAmazon: false,
      },
    ],
  },
];

export default function ToolsPage() {
  // Build ItemList schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Chronic Mystery Recommended Tools",
    description: `Curated list of the best books, tools, apps, and resources for chronic fatigue and ME/CFS. Personally vetted recommendations from ${SITE_CONFIG.authorName}.`,
    numberOfItems: PRODUCT_CATEGORIES.reduce((sum, cat) => sum + cat.products.length, 0),
    itemListElement: PRODUCT_CATEGORIES.flatMap((cat, ci) =>
      cat.products.map((p, pi) => ({
        "@type": "ListItem",
        position: ci * 10 + pi + 1,
        name: p.name,
        url: p.url,
      }))
    ),
  };

  const totalProducts = PRODUCT_CATEGORIES.reduce((sum, cat) => sum + cat.products.length, 0);
  const amazonProducts = PRODUCT_CATEGORIES.reduce(
    (sum, cat) => sum + cat.products.filter((p) => p.isAmazon).length,
    0
  );

  return (
    <>
      <SeoHead
        title={`Best Chronic Fatigue Tools & Resources We Recommend — ${SITE_CONFIG.title}`}
        description={`Curated list of the best books, tools, apps, and resources for chronic fatigue and ME/CFS. Personally vetted recommendations from ${SITE_CONFIG.authorName}.`}
        canonical={`${SITE_CONFIG.url}/tools`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <main className="container py-6">
        <nav className="text-xs font-sans text-muted-foreground mb-4">
          <Link href="/" className="hover:text-heather">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Tools We Recommend</span>
        </nav>
        <hr className="rule-double mb-8" />

        {/* Affiliate Disclosure */}
        <div className="max-w-4xl mx-auto mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-sm">
          <p className="text-xs text-amber-800 leading-relaxed">
            This page contains affiliate links. We may earn a small commission
            if you make a purchase — at no extra cost to you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Tools We Recommend
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-2 max-w-2xl">
            These are the tools, books, and resources I actually trust. Every
            recommendation here has been chosen because it serves the work this
            site is about — understanding chronic fatigue, managing it with
            honesty, and finding what helps when the usual answers fall short.
          </p>
          <p className="text-sm text-muted-foreground mb-10">
            {totalProducts} recommendations across {PRODUCT_CATEGORIES.length} categories
          </p>

          {/* Product Categories */}
          {PRODUCT_CATEGORIES.map((cat, ci) => (
            <section key={ci} className="mb-12">
              <h2 className="font-serif text-2xl font-bold mb-6 pb-2 border-b border-border">
                {cat.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.products.map((product, pi) => (
                  <div
                    key={pi}
                    className="border border-border rounded-sm p-5 bg-card hover:shadow-sm transition-shadow"
                  >
                    <h3 className="font-serif text-base font-bold mb-2">
                      <a
                        href={product.url}
                        target="_blank"
                        rel={product.isAmazon ? "noopener" : "noopener nofollow"}
                        className="hover:text-heather transition-colors"
                      >
                        {product.name}
                      </a>
                    </h3>
                    <p
                      className="text-sm text-muted-foreground leading-relaxed mb-3"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                    <a
                      href={product.url}
                      target="_blank"
                      rel={product.isAmazon ? "noopener" : "noopener nofollow"}
                      className="inline-flex items-center gap-1 text-sm font-sans font-medium text-heather hover:underline"
                    >
                      {product.isAmazon ? "View on Amazon" : "Visit Website"}
                      {product.isAmazon && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (paid link)
                        </span>
                      )}
                      <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Bottom CTA */}
          <div className="mt-8 p-6 bg-muted/50 border border-border rounded-sm text-center">
            <p className="font-serif text-lg font-bold mb-2">
              Not sure where to start?
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Our Start Here guide walks you through the most important articles
              for understanding your condition.
            </p>
            <Link
              href="/start-here"
              className="inline-block px-6 py-2 bg-heather text-white text-sm font-sans font-medium rounded-sm hover:bg-heather/90 transition-colors"
            >
              Read the Start Here Guide
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
