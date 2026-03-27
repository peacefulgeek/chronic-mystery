export interface FaqItem {
  question: string;
  answer: string;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  dateISO: string;
  readingTime: number;
  wordCount: number;
  faqCount: number;
  faqItems: FaqItem[];
  openerType: string;
  conclusionType: string;
  linkType: string;
  researcherName: string;
  phrasesUsed: string[];
  finalHeader: string;
  imageDescription: string;
  heroImage: string;
  ogImage: string;
  body: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  metaDescription: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "the-mystery",
    name: "The Mystery",
    description: "The unanswered questions, the diagnostic odyssey, and the science that's still catching up to what your body already knows.",
    metaDescription: "Explore the unanswered questions of ME/CFS, chronic fatigue, and post-viral illness. The diagnostic odyssey and the science still catching up."
  },
  {
    slug: "the-medical",
    name: "The Medical",
    description: "Research, treatments, and the evolving medical understanding of conditions that were dismissed for decades.",
    metaDescription: "ME/CFS research, treatments, and evolving medical understanding. From mitochondrial dysfunction to immune dysregulation."
  },
  {
    slug: "the-management",
    name: "The Management",
    description: "Pacing, energy envelopes, and the practical strategies that make the difference between surviving and living.",
    metaDescription: "Practical strategies for managing ME/CFS and chronic fatigue. Pacing, energy envelopes, and daily management that works."
  },
  {
    slug: "the-identity",
    name: "The Identity",
    description: "Who are you when you can't perform? The grief, the reinvention, and the unexpected gifts of forced stillness.",
    metaDescription: "Identity, grief, and reinvention in chronic illness. Who are you when you can't perform? The unexpected gifts of forced stillness."
  },
  {
    slug: "the-deeper-rest",
    name: "The Deeper Rest",
    description: "Beyond sleep. The contemplative, spiritual, and philosophical dimensions of illness as a teacher.",
    metaDescription: "The spiritual and contemplative dimensions of chronic illness. Rest as practice, illness as teacher, surrender as strength."
  }
];

export const SITE_CONFIG = {
  title: "Chronic Mystery",
  subtitle: "When You're Exhausted and Nobody Can Tell You Why",
  tagline: "Your labs are 'normal.' Your life isn't. You're not imagining it.",
  domain: "chronicmystery.com",
  url: "https://chronicmystery.com",
  editorialName: "Chronic Mystery Editorial",
  authorName: "Kalesh",
  authorTitle: "Consciousness Teacher & Writer",
  authorBio: "Kalesh is a consciousness teacher and writer whose work explores the intersection of ancient contemplative traditions and modern neuroscience. With decades of practice in meditation, breathwork, and somatic inquiry, he guides others toward embodied awareness.",
  authorLink: "https://kalesh.love",
  authorLinkText: "Visit Kalesh's Website",
  disclaimer: "This site provides educational information about chronic fatigue conditions. It is not medical advice. ME/CFS requires management with a knowledgeable healthcare provider.",
  bunnyBase: "https://chronic-mystery.b-cdn.net"
};
