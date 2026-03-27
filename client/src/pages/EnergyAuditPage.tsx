import { useState, useMemo } from "react";
import { Link } from "wouter";
import { SITE_CONFIG, CATEGORIES } from "@/data/types";
import { getArticlesByCategory } from "@/data/store";
import ArticleCard from "@/components/article/ArticleCard";
import SeoHead from "@/components/seo/SeoHead";

interface QuizQuestion {
  id: number;
  text: string;
  options: { label: string; value: string; points: Record<string, number> }[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: "When you wake up in the morning, what's the first thing you notice?",
    options: [
      { label: "I haven't actually slept — just lay there", value: "a", points: { "the-medical": 2, "the-management": 1 } },
      { label: "My body feels heavier than when I went to bed", value: "b", points: { "the-medical": 1, "the-mystery": 2 } },
      { label: "I immediately start calculating what I can and can't do today", value: "c", points: { "the-management": 2, "the-identity": 1 } },
      { label: "A strange mix of exhaustion and alertness", value: "d", points: { "the-mystery": 2, "the-deeper-rest": 1 } },
    ],
  },
  {
    id: 2,
    text: "How do you describe your condition to someone who asks?",
    options: [
      { label: "I usually just say 'tired' and change the subject", value: "a", points: { "the-identity": 2, "the-management": 1 } },
      { label: "I try to explain the medical details but their eyes glaze over", value: "b", points: { "the-medical": 2, "the-mystery": 1 } },
      { label: "I've stopped trying to explain", value: "c", points: { "the-identity": 2, "the-deeper-rest": 1 } },
      { label: "I tell them it's like running on 10% battery — permanently", value: "d", points: { "the-management": 2, "the-mystery": 1 } },
    ],
  },
  {
    id: 3,
    text: "What's your relationship with rest?",
    options: [
      { label: "I rest but never feel rested", value: "a", points: { "the-medical": 2, "the-mystery": 1 } },
      { label: "I feel guilty when I rest", value: "b", points: { "the-identity": 2, "the-deeper-rest": 1 } },
      { label: "I've learned to rest before I crash, most of the time", value: "c", points: { "the-management": 2 } },
      { label: "Rest has become something deeper than I expected", value: "d", points: { "the-deeper-rest": 3 } },
    ],
  },
  {
    id: 4,
    text: "What frustrates you most about your situation?",
    options: [
      { label: "Nobody can tell me what's actually wrong", value: "a", points: { "the-mystery": 3 } },
      { label: "The treatments don't work or make things worse", value: "b", points: { "the-medical": 2, "the-management": 1 } },
      { label: "I've lost who I used to be", value: "c", points: { "the-identity": 3 } },
      { label: "People think I'm exaggerating or lazy", value: "d", points: { "the-identity": 2, "the-mystery": 1 } },
    ],
  },
  {
    id: 5,
    text: "When you think about the future, what comes up?",
    options: [
      { label: "Anxiety — will I always be like this?", value: "a", points: { "the-mystery": 1, "the-identity": 2 } },
      { label: "Hope — research is advancing", value: "b", points: { "the-medical": 2, "the-mystery": 1 } },
      { label: "Pragmatism — I focus on what I can control today", value: "c", points: { "the-management": 3 } },
      { label: "Something I can't quite name — a quiet knowing", value: "d", points: { "the-deeper-rest": 3 } },
    ],
  },
  {
    id: 6,
    text: "What would help you most right now?",
    options: [
      { label: "Understanding what's happening in my body", value: "a", points: { "the-medical": 2, "the-mystery": 1 } },
      { label: "Practical strategies for daily life", value: "b", points: { "the-management": 3 } },
      { label: "Permission to grieve what I've lost", value: "c", points: { "the-identity": 2, "the-deeper-rest": 1 } },
      { label: "A different way of seeing this experience", value: "d", points: { "the-deeper-rest": 2, "the-mystery": 1 } },
    ],
  },
  {
    id: 7,
    text: "How do you feel about the word 'acceptance'?",
    options: [
      { label: "It feels like giving up", value: "a", points: { "the-identity": 2, "the-medical": 1 } },
      { label: "I'm working on it", value: "b", points: { "the-management": 1, "the-identity": 1 } },
      { label: "It's not what I thought it was", value: "c", points: { "the-deeper-rest": 2, "the-identity": 1 } },
      { label: "I don't need to accept anything — I need answers", value: "d", points: { "the-mystery": 2, "the-medical": 1 } },
    ],
  },
];

export default function EnergyAuditPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [scores, setScores] = useState<Record<string, number> | null>(null);

  function handleAnswer(questionId: number, value: string) {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    } else {
      // Calculate scores
      const totals: Record<string, number> = {};
      QUESTIONS.forEach((q) => {
        const answer = newAnswers[q.id];
        if (answer) {
          const option = q.options.find((o) => o.value === answer);
          if (option) {
            Object.entries(option.points).forEach(([cat, pts]) => {
              totals[cat] = (totals[cat] || 0) + pts;
            });
          }
        }
      });
      setScores(totals);
    }
  }

  function restart() {
    setCurrentQ(0);
    setAnswers({});
    setScores(null);
  }

  const topCategory = useMemo(() => {
    if (!scores) return null;
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || null;
  }, [scores]);

  const recommendedArticles = useMemo(() => {
    if (!topCategory) return [];
    return getArticlesByCategory(topCategory).slice(0, 3);
  }, [topCategory]);

  const topCategoryInfo = CATEGORIES.find((c) => c.slug === topCategory);

  return (
    <>
      <SeoHead
        title={`Energy Audit — ${SITE_CONFIG.title}`}
        description="Take the Energy Audit. A quick, honest assessment of where your energy actually goes. No diagnosis, no judgment. Just clarity."
        canonical={`${SITE_CONFIG.url}/energy-audit`}
      />

      <main className="container py-6">
        <nav className="text-xs font-sans text-muted-foreground mb-4">
          <Link href="/" className="hover:text-heather">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Energy Audit</span>
        </nav>

        <hr className="rule-double mb-8" />

        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            The Energy Audit
          </h1>

          {!scores ? (
            <>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Seven questions. No right answers. This isn't a diagnosis — it's a
                mirror. Answer honestly, and we'll point you toward the reading
                that might actually help.
              </p>

              {/* Progress */}
              <div className="flex items-center gap-2 mb-6">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i <= currentQ ? "bg-heather" : "bg-border"
                    }`}
                  />
                ))}
              </div>

              {/* Question */}
              <div className="mb-8">
                <p className="text-xs font-sans text-muted-foreground mb-2">
                  Question {currentQ + 1} of {QUESTIONS.length}
                </p>
                <h2 className="font-serif text-xl font-bold mb-6">
                  {QUESTIONS[currentQ].text}
                </h2>
                <div className="space-y-3">
                  {QUESTIONS[currentQ].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(QUESTIONS[currentQ].id, opt.value)}
                      className={`w-full text-left px-4 py-3 border rounded-sm text-sm font-sans transition-all hover:border-heather hover:bg-heather/5 ${
                        answers[QUESTIONS[currentQ].id] === opt.value
                          ? "border-heather bg-heather/10"
                          : "border-border"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Back button */}
              {currentQ > 0 && (
                <button
                  onClick={() => setCurrentQ(currentQ - 1)}
                  className="text-sm font-sans text-muted-foreground hover:text-foreground"
                >
                  &larr; Previous question
                </button>
              )}
            </>
          ) : (
            <>
              {/* Results */}
              <div className="mb-8">
                <h2 className="font-serif text-2xl font-bold mb-4">
                  Your Reading Path
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Based on your answers, the section that speaks most to where you
                  are right now is{" "}
                  <strong className="text-foreground">
                    {topCategoryInfo?.name}
                  </strong>
                  . This doesn't mean the other sections aren't for you — it means
                  this is probably where to start.
                </p>

                {topCategoryInfo && (
                  <div className="bg-heather/10 border border-heather/20 rounded-sm p-6 mb-8">
                    <h3 className="font-serif text-lg font-bold mb-2">
                      {topCategoryInfo.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {topCategoryInfo.description}
                    </p>
                  </div>
                )}

                {/* Score breakdown */}
                <div className="space-y-2 mb-8">
                  {Object.entries(scores)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, score]) => {
                      const info = CATEGORIES.find((c) => c.slug === cat);
                      const maxScore = QUESTIONS.length * 3;
                      const pct = Math.round((score / maxScore) * 100);
                      return (
                        <div key={cat} className="flex items-center gap-3">
                          <span className="text-sm font-sans w-36 text-right">
                            {info?.name}
                          </span>
                          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-heather rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                </div>

                {/* Recommended articles */}
                {recommendedArticles.length > 0 && (
                  <>
                    <h3 className="font-serif text-lg font-bold mb-4">
                      Start With These
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      {recommendedArticles.map((a) => (
                        <ArticleCard key={a.id} article={a} variant="medium" />
                      ))}
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={restart}
                    className="px-4 py-2 text-sm font-sans border border-border rounded-sm hover:bg-muted transition-colors"
                  >
                    Retake Audit
                  </button>
                  <Link
                    href={topCategory ? `/category/${topCategory}` : "/articles"}
                    className="px-4 py-2 text-sm font-sans font-medium bg-heather text-white rounded-sm hover:opacity-90 transition-opacity"
                  >
                    Browse {topCategoryInfo?.name} &rarr;
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
