import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { SITE_CONFIG } from "@/data/types";
import SeoHead from "@/components/seo/SeoHead";

interface AssessmentQuestion {
  question: string;
  scale: string[];
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string;
  instructions: string;
  questions: AssessmentQuestion[];
  scoring: { min: number; max: number; level: string; interpretation: string }[];
}

const SCALE_5 = ["Never", "Rarely", "Sometimes", "Often", "Always"];
const SCALE_SEVERITY = ["Not at all", "Mildly", "Moderately", "Severely", "Extremely"];
const SCALE_AGREE = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

const ASSESSMENTS: Assessment[] = [
  {
    id: "functional-capacity",
    title: "Functional Capacity Assessment",
    description: "A structured self-evaluation of your current physical, cognitive, and social functioning across key life domains.",
    category: "The Management",
    instructions: "Rate each statement based on your experience over the past two weeks. There are no right or wrong answers.",
    questions: [
      { question: "I can prepare a simple meal without needing to rest afterward.", scale: SCALE_5 },
      { question: "I can shower and dress without significant fatigue.", scale: SCALE_5 },
      { question: "I can walk to the mailbox or equivalent distance.", scale: SCALE_5 },
      { question: "I can hold a conversation for 15+ minutes without losing focus.", scale: SCALE_5 },
      { question: "I can read for 30 minutes without rereading passages.", scale: SCALE_5 },
      { question: "I can manage my own medication schedule.", scale: SCALE_5 },
      { question: "I can do light housework (dishes, laundry) in a single session.", scale: SCALE_5 },
      { question: "I can drive or take public transit safely.", scale: SCALE_5 },
      { question: "I can attend a social gathering for 1+ hours.", scale: SCALE_5 },
      { question: "I can work or study for 2+ hours with breaks.", scale: SCALE_5 },
    ],
    scoring: [
      { min: 0, max: 10, level: "Severely Limited", interpretation: "Your functional capacity is significantly impaired. Most basic activities require assistance or result in post-exertional malaise. This level of limitation is consistent with severe ME/CFS and warrants discussion with your healthcare team about support services, occupational therapy, and pacing strategies tailored to very low baselines." },
      { min: 11, max: 20, level: "Substantially Limited", interpretation: "You can manage some basic activities but with significant cost. This is the territory where pacing becomes critical — not as a nice idea but as a survival strategy. Energy envelope management and activity-rest cycling should be central to your daily approach." },
      { min: 21, max: 30, level: "Moderately Limited", interpretation: "You have meaningful capacity but it's fragile. You can do more than many realize, but the cost of overexertion is real and delayed. This is often the hardest level to manage because you look functional to others while operating on a fraction of normal capacity." },
      { min: 31, max: 40, level: "Mildly Limited", interpretation: "Your functional capacity is relatively preserved. You may be able to work part-time or maintain most daily activities with careful management. Focus on preventing deterioration by respecting your limits even when you feel capable of more." },
    ]
  },
  {
    id: "symptom-severity",
    title: "Symptom Severity Index",
    description: "Track the intensity of your core symptoms to establish a baseline and monitor changes over time.",
    category: "The Medical",
    instructions: "Rate the severity of each symptom over the past week.",
    questions: [
      { question: "Physical fatigue / exhaustion", scale: SCALE_SEVERITY },
      { question: "Post-exertional malaise (worsening after activity)", scale: SCALE_SEVERITY },
      { question: "Unrefreshing sleep", scale: SCALE_SEVERITY },
      { question: "Cognitive dysfunction / brain fog", scale: SCALE_SEVERITY },
      { question: "Muscle pain or aching", scale: SCALE_SEVERITY },
      { question: "Joint pain without swelling", scale: SCALE_SEVERITY },
      { question: "Headaches (new type or severity)", scale: SCALE_SEVERITY },
      { question: "Orthostatic intolerance (dizziness on standing)", scale: SCALE_SEVERITY },
      { question: "Sensitivity to light, sound, or temperature", scale: SCALE_SEVERITY },
      { question: "Sore throat or tender lymph nodes", scale: SCALE_SEVERITY },
    ],
    scoring: [
      { min: 0, max: 10, level: "Mild Symptom Burden", interpretation: "Your symptoms are present but manageable. This may represent a good baseline for you, or it may indicate early-stage illness. Document this level so you can track changes over time. Even mild ME/CFS symptoms deserve attention and proper management." },
      { min: 11, max: 20, level: "Moderate Symptom Burden", interpretation: "Your symptom load is significant and likely affecting your quality of life. This level often corresponds to the point where people seek diagnosis — the symptoms are too consistent and too impactful to ignore. Systematic tracking can help identify triggers and patterns." },
      { min: 21, max: 30, level: "Severe Symptom Burden", interpretation: "You are carrying a heavy symptom load across multiple systems. This level of severity often indicates significant immune, neurological, and autonomic dysfunction. If you haven't already, consider seeking a specialist who understands ME/CFS — not just a generalist who will run standard labs." },
      { min: 31, max: 40, level: "Very Severe Symptom Burden", interpretation: "Your symptoms are at crisis level. This degree of severity may indicate you need more support than you're currently receiving. Please discuss these results with your healthcare provider. If you're housebound or bedbound, organizations like the ME Association and Solve ME/CFS Initiative have resources specifically for severe patients." },
    ]
  },
  {
    id: "emotional-impact",
    title: "Emotional Impact of Chronic Illness",
    description: "Assess how your condition is affecting your emotional wellbeing, relationships, and sense of self.",
    category: "The Identity",
    instructions: "Rate how much you agree with each statement based on your experience in the past month.",
    questions: [
      { question: "I feel grief over the life I expected to have.", scale: SCALE_AGREE },
      { question: "I feel guilty about what I can't do for others.", scale: SCALE_AGREE },
      { question: "I feel angry at the medical system for not helping me.", scale: SCALE_AGREE },
      { question: "I feel isolated from friends and family.", scale: SCALE_AGREE },
      { question: "I feel anxious about my future with this condition.", scale: SCALE_AGREE },
      { question: "I feel like a burden to the people around me.", scale: SCALE_AGREE },
      { question: "I feel misunderstood by people who haven't experienced this.", scale: SCALE_AGREE },
      { question: "I have lost confidence in my own perceptions and experiences.", scale: SCALE_AGREE },
      { question: "I feel disconnected from who I used to be.", scale: SCALE_AGREE },
      { question: "I have moments of peace or acceptance despite everything.", scale: [...SCALE_AGREE].reverse() },
    ],
    scoring: [
      { min: 0, max: 10, level: "Emotionally Resilient", interpretation: "You're managing the emotional dimension of chronic illness with notable resilience. This doesn't mean you don't struggle — it means you've found ways to process the grief, anger, and isolation that come with this territory. Protect what's working for you." },
      { min: 11, max: 20, level: "Emotionally Strained", interpretation: "The emotional weight of your condition is significant. This is not weakness — it's a normal response to an abnormal situation. The grief, guilt, and isolation you're experiencing are documented features of chronic illness, not character flaws. Consider whether therapy with someone who understands chronic illness could help." },
      { min: 21, max: 30, level: "Emotionally Overwhelmed", interpretation: "You're carrying an enormous emotional burden. The combination of grief, isolation, medical frustration, and identity loss is taking a serious toll. This level of emotional impact can worsen physical symptoms through stress pathways. Please consider reaching out to a mental health professional who specializes in chronic illness." },
      { min: 31, max: 40, level: "In Emotional Crisis", interpretation: "Your emotional wellbeing needs immediate attention. This level of distress is not sustainable and is likely amplifying your physical symptoms. You deserve support — not the kind that tells you to think positive, but the kind that sits with you in the difficulty and helps you find ground. Please reach out to a professional." },
    ]
  },
  {
    id: "pem-pattern",
    title: "Post-Exertional Malaise Pattern Analysis",
    description: "Map your PEM triggers, timing, and recovery patterns to better predict and prevent crashes.",
    category: "The Medical",
    instructions: "Rate each statement based on your typical experience with post-exertional malaise.",
    questions: [
      { question: "Physical activity triggers PEM for me.", scale: SCALE_5 },
      { question: "Cognitive activity (reading, screens, conversation) triggers PEM.", scale: SCALE_5 },
      { question: "Emotional stress triggers PEM.", scale: SCALE_5 },
      { question: "Sensory overload (noise, light, crowds) triggers PEM.", scale: SCALE_5 },
      { question: "My PEM typically starts 24-48 hours after the trigger.", scale: SCALE_5 },
      { question: "My PEM lasts more than 24 hours.", scale: SCALE_5 },
      { question: "I can predict which activities will cause PEM.", scale: [...SCALE_5].reverse() },
      { question: "I have strategies that reduce PEM severity.", scale: [...SCALE_5].reverse() },
      { question: "PEM affects my cognitive function more than my physical function.", scale: SCALE_5 },
      { question: "I experience new symptoms during PEM that I don't have at baseline.", scale: SCALE_5 },
    ],
    scoring: [
      { min: 0, max: 10, level: "Mild PEM Pattern", interpretation: "Your post-exertional malaise is present but relatively predictable and manageable. You may have found effective pacing strategies or your PEM threshold is higher than average. Continue tracking your patterns — they can shift over time." },
      { min: 11, max: 20, level: "Moderate PEM Pattern", interpretation: "PEM is a significant factor in your daily life. The delayed onset makes it particularly tricky — you pay for today's activities with tomorrow's capacity. Heart rate monitoring and activity logging can help you identify your threshold before you cross it." },
      { min: 21, max: 30, level: "Severe PEM Pattern", interpretation: "PEM dominates your experience of this illness. Multiple triggers, prolonged recovery, and unpredictable onset make planning nearly impossible. This level of PEM reactivity suggests significant immune and metabolic dysfunction. Aggressive pacing — staying well below your threshold — is essential." },
      { min: 31, max: 40, level: "Extreme PEM Pattern", interpretation: "Your PEM is severe, multi-trigger, and prolonged. This level of reactivity means even basic activities carry risk. You may need to radically reduce your activity baseline and rebuild very slowly. This is not giving up — it's the foundation that eventually allows expansion." },
    ]
  },
  {
    id: "energy-envelope",
    title: "Energy Envelope Mapping",
    description: "Quantify your available energy across different domains to build a realistic daily budget.",
    category: "The Management",
    instructions: "Rate your typical capacity in each area on a scale from 'None' to 'Full capacity'.",
    questions: [
      { question: "Physical energy for movement and exercise.", scale: ["None", "Minimal", "Moderate", "Good", "Full"] },
      { question: "Cognitive energy for thinking and problem-solving.", scale: ["None", "Minimal", "Moderate", "Good", "Full"] },
      { question: "Social energy for interaction and conversation.", scale: ["None", "Minimal", "Moderate", "Good", "Full"] },
      { question: "Emotional energy for processing and coping.", scale: ["None", "Minimal", "Moderate", "Good", "Full"] },
      { question: "Creative energy for expression and imagination.", scale: ["None", "Minimal", "Moderate", "Good", "Full"] },
      { question: "Sensory tolerance for light, sound, and stimulation.", scale: ["None", "Minimal", "Moderate", "Good", "Full"] },
      { question: "Decision-making capacity.", scale: ["None", "Minimal", "Moderate", "Good", "Full"] },
      { question: "Self-care capacity (hygiene, meals, medication).", scale: ["None", "Minimal", "Moderate", "Good", "Full"] },
    ],
    scoring: [
      { min: 0, max: 8, level: "Severely Depleted Envelope", interpretation: "Your energy envelope is extremely small. Most or all domains are severely limited. At this level, the priority is protecting what little energy you have and directing it toward essentials. Everything else can wait. This is survival mode, and it's temporary — but it requires radical acceptance of current limits." },
      { min: 9, max: 16, level: "Restricted Envelope", interpretation: "You have some energy but it's unevenly distributed across domains. You might have enough cognitive energy to read but not enough physical energy to cook. This uneven distribution is characteristic of ME/CFS and requires strategic allocation — spend your best energy on what matters most." },
      { min: 17, max: 24, level: "Moderate Envelope", interpretation: "Your energy envelope allows for meaningful activity in most domains, though not at pre-illness levels. This is the range where careful pacing can make the biggest difference — the gap between crashing and thriving is often just one or two activities." },
      { min: 25, max: 32, level: "Functional Envelope", interpretation: "Your energy reserves are relatively good across domains. You may be in remission, early-stage, or have found effective management strategies. The key now is sustainability — don't expand too quickly just because you can." },
    ]
  },
  {
    id: "contemplative-readiness",
    title: "Contemplative Practice Readiness",
    description: "Assess whether contemplative practices (meditation, breathwork, somatic inquiry) might serve you right now — or whether other approaches come first.",
    category: "The Deeper Rest",
    instructions: "Rate how much each statement applies to you currently.",
    questions: [
      { question: "I can sit or lie still for 10 minutes without significant distress.", scale: SCALE_AGREE },
      { question: "I can observe my thoughts without being swept away by them.", scale: SCALE_AGREE },
      { question: "I feel safe enough in my body to pay attention to sensations.", scale: SCALE_AGREE },
      { question: "I'm curious about what my symptoms might be communicating.", scale: SCALE_AGREE },
      { question: "I can distinguish between productive rest and dissociation.", scale: SCALE_AGREE },
      { question: "I have some experience with meditation or mindfulness.", scale: SCALE_AGREE },
      { question: "I'm open to the idea that illness might have something to teach me.", scale: SCALE_AGREE },
      { question: "I can tolerate uncomfortable emotions without needing to fix them immediately.", scale: SCALE_AGREE },
    ],
    scoring: [
      { min: 0, max: 8, level: "Not Yet Ready", interpretation: "Contemplative practice may not be the right tool for you right now — and that's perfectly fine. If stillness feels threatening or your nervous system is too dysregulated, forcing meditation can do more harm than good. Focus on safety, stabilization, and basic pacing first. The contemplative dimension will be there when you're ready." },
      { min: 9, max: 16, level: "Approaching Readiness", interpretation: "You have some capacity for contemplative practice but may need modified approaches. Short sessions (5 minutes), guided rather than silent, and body-based rather than mind-based practices are good starting points. Don't force depth — let it come naturally." },
      { min: 17, max: 24, level: "Ready for Practice", interpretation: "You have the foundation for meaningful contemplative practice. Your ability to observe, tolerate discomfort, and stay present suggests you can benefit from meditation, breathwork, or somatic inquiry. Start with what resonates and build gradually." },
      { min: 25, max: 32, level: "Experienced Practitioner", interpretation: "You already have a mature relationship with contemplative practice. Your illness may actually be deepening this capacity — forced stillness has a way of revealing what voluntary practice sometimes misses. Trust what you're discovering." },
    ]
  },
  {
    id: "medical-advocacy",
    title: "Medical Self-Advocacy Assessment",
    description: "Evaluate your ability to navigate the healthcare system, communicate with providers, and advocate for your needs.",
    category: "The Mystery",
    instructions: "Rate how confident you feel in each area.",
    questions: [
      { question: "I can clearly describe my symptoms to a healthcare provider.", scale: SCALE_AGREE },
      { question: "I bring organized notes or symptom logs to appointments.", scale: SCALE_AGREE },
      { question: "I can push back respectfully when a provider dismisses my concerns.", scale: SCALE_AGREE },
      { question: "I know which tests to request for ME/CFS evaluation.", scale: SCALE_AGREE },
      { question: "I can distinguish between a provider who doesn't know and one who doesn't care.", scale: SCALE_AGREE },
      { question: "I have a system for tracking medications, supplements, and their effects.", scale: SCALE_AGREE },
      { question: "I feel empowered rather than defeated after most medical appointments.", scale: SCALE_AGREE },
      { question: "I know my rights as a patient and how to access my medical records.", scale: SCALE_AGREE },
    ],
    scoring: [
      { min: 0, max: 8, level: "Needs Support", interpretation: "Medical self-advocacy is a skill, and you're still building it. This is especially hard when brain fog makes it difficult to organize thoughts and fatigue makes it hard to fight for yourself. Consider bringing a trusted person to appointments, using symptom tracking apps, and preparing written summaries in advance." },
      { min: 9, max: 16, level: "Developing Advocate", interpretation: "You have some advocacy skills but there are gaps. This is normal — most people weren't taught how to navigate a medical system that often doesn't understand their condition. Focus on the areas where you feel least confident and build those skills one appointment at a time." },
      { min: 17, max: 24, level: "Competent Advocate", interpretation: "You've developed strong self-advocacy skills. You can communicate effectively, push back when needed, and navigate the system with reasonable confidence. This is a hard-won skill in the ME/CFS community, and it makes a real difference in the quality of care you receive." },
      { min: 25, max: 32, level: "Expert Advocate", interpretation: "You're not just advocating for yourself — you're likely helping others navigate the system too. Your knowledge of ME/CFS, your ability to communicate with providers, and your confidence in asserting your needs are exceptional. Consider whether mentoring newly diagnosed patients could be part of your purpose." },
    ]
  },
  {
    id: "grief-processing",
    title: "Chronic Illness Grief Assessment",
    description: "Explore where you are in the grief process that accompanies chronic illness — because it is grief, even if no one died.",
    category: "The Identity",
    instructions: "Rate how strongly each statement resonates with your current experience.",
    questions: [
      { question: "I still expect to wake up one day and be my old self.", scale: SCALE_AGREE },
      { question: "I feel angry at my body for betraying me.", scale: SCALE_AGREE },
      { question: "I've tried to bargain — if I just do this one thing, I'll get better.", scale: SCALE_AGREE },
      { question: "I feel a deep sadness about the life I'm not living.", scale: SCALE_AGREE },
      { question: "I've stopped comparing my life to what it was before.", scale: [...SCALE_AGREE].reverse() },
      { question: "I can talk about my losses without being overwhelmed.", scale: [...SCALE_AGREE].reverse() },
      { question: "I've found new sources of meaning that don't depend on being well.", scale: [...SCALE_AGREE].reverse() },
      { question: "I can hold both grief and gratitude at the same time.", scale: [...SCALE_AGREE].reverse() },
      { question: "I feel like I'm mourning a person who is still alive — me.", scale: SCALE_AGREE },
      { question: "I believe I can have a good life even with this condition.", scale: [...SCALE_AGREE].reverse() },
    ],
    scoring: [
      { min: 0, max: 10, level: "Integrated Grief", interpretation: "You've done significant grief work. This doesn't mean the grief is gone — it means you've learned to carry it without being crushed by it. You can hold loss and meaning simultaneously. This is what integration looks like, and it's a profound achievement." },
      { min: 11, max: 20, level: "Active Grieving", interpretation: "You're in the thick of the grief process. Anger, sadness, bargaining, and moments of acceptance are all present, sometimes in the same hour. This is messy and painful and completely normal. Grief doesn't follow stages — it spirals. Let it move through you." },
      { min: 21, max: 30, level: "Early Grief", interpretation: "The losses are still raw. You may be oscillating between denial and devastation, between hoping for recovery and fearing permanence. This is the hardest phase because nothing has settled yet. Be gentle with yourself — you're mourning a life while still living it." },
      { min: 31, max: 40, level: "Unprocessed Grief", interpretation: "Your grief is largely unprocessed, which means it's likely showing up as anger, numbness, or physical symptoms. This is not a failing — it's a sign that you haven't had the space or support to grieve properly. Chronic illness grief is disenfranchised grief — society doesn't recognize it. But it's real, and it deserves attention." },
    ]
  },
];

function AssessmentComponent({ assessment }: { assessment: Assessment }) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(assessment.questions.length).fill(null)
  );
  const [showResult, setShowResult] = useState(false);

  const totalScore = useMemo(
    () => answers.reduce((sum: number, a) => sum + (a ?? 0), 0),
    [answers]
  );

  const result = useMemo(() => {
    if (!showResult) return null;
    return assessment.scoring.find((s) => totalScore >= s.min && totalScore <= s.max) || assessment.scoring[assessment.scoring.length - 1];
  }, [showResult, totalScore, assessment.scoring]);

  const allAnswered = answers.every((a) => a !== null);

  const handleAnswer = useCallback((qi: number, score: number) => {
    setAnswers(prev => {
      const next = [...prev];
      next[qi] = score;
      return next;
    });
  }, []);

  const handleReset = () => {
    setAnswers(new Array(assessment.questions.length).fill(null));
    setShowResult(false);
  };

  const generatePDF = () => {
    // Create a printable summary
    const content = `
${assessment.title}
Date: ${new Date().toLocaleDateString()}
Total Score: ${totalScore}/${assessment.questions.length * 4}
Result: ${result?.level}

Questions & Answers:
${assessment.questions.map((q, i) => `${i + 1}. ${q.question}: ${q.scale[answers[i] ?? 0]} (${answers[i]})`).join('\n')}

Interpretation:
${result?.interpretation}

---
Generated by Chronic Mystery (${SITE_CONFIG.url})
This is not a medical document. Share with your healthcare provider for context.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${assessment.id}-results-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border border-border rounded-sm p-6 bg-card">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-sans text-sage font-medium uppercase tracking-wider">
          {assessment.category}
        </span>
      </div>
      <h3 className="font-serif text-xl font-bold mb-2">{assessment.title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{assessment.description}</p>
      <p className="text-xs text-muted-foreground italic mb-6">{assessment.instructions}</p>

      {!showResult ? (
        <>
          <div className="space-y-5">
            {assessment.questions.map((q, qi) => (
              <div key={qi}>
                <p className="font-sans text-sm font-medium mb-2">
                  {qi + 1}. {q.question}
                </p>
                <div className="flex flex-wrap gap-2">
                  {q.scale.map((label, si) => (
                    <button
                      key={si}
                      onClick={() => handleAnswer(qi, si)}
                      className={`px-3 py-1.5 text-xs rounded-sm border transition-colors ${
                        answers[qi] === si
                          ? "border-sage bg-sage/10 text-foreground font-medium"
                          : "border-border hover:border-sage/50 text-muted-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowResult(true)}
            disabled={!allAnswered}
            className={`mt-6 px-6 py-2.5 text-sm font-sans font-medium rounded-sm transition-colors ${
              allAnswered
                ? "bg-sage text-white hover:bg-sage/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            See Your Assessment
          </button>
        </>
      ) : (
        <div className="bg-muted/30 border border-border rounded-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-sans text-sage font-medium uppercase tracking-wider">
              Your Assessment — Score: {totalScore}/{assessment.questions.length * 4}
            </p>
          </div>
          <h4 className="font-serif text-lg font-bold mb-3">{result?.level}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {result?.interpretation}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={generatePDF}
              className="text-sm font-sans px-4 py-2 bg-sage text-white rounded-sm hover:bg-sage/90 transition-colors"
            >
              Download Results
            </button>
            <button
              onClick={handleReset}
              className="text-sm font-sans text-sage hover:underline"
            >
              Retake assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AssessmentsPage() {
  return (
    <>
      <SeoHead
        title={`Self-Assessments — ${SITE_CONFIG.title}`}
        description="In-depth self-assessments for functional capacity, symptom severity, emotional impact, PEM patterns, and more. Download results to share with your healthcare provider."
        canonical={`${SITE_CONFIG.url}/assessments`}
      />

      <main className="container py-6">
        <nav className="text-xs font-sans text-muted-foreground mb-4">
          <Link href="/" className="hover:text-heather">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Assessments</span>
        </nav>
        <hr className="rule-double mb-8" />

        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Self-Assessments
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-2">
            These are deeper self-evaluation tools designed to help you map your
            current state across multiple dimensions. Unlike the quizzes, these
            assessments produce results you can download and share with your
            healthcare provider for context.
          </p>
          <p className="text-sm text-muted-foreground mb-10">
            {ASSESSMENTS.length} assessments available &middot; All processing happens in your browser
          </p>

          <div className="space-y-8">
            {ASSESSMENTS.map((assessment) => (
              <AssessmentComponent key={assessment.id} assessment={assessment} />
            ))}
          </div>

          {/* Health Disclaimer */}
          <div className="mt-10 p-5 bg-gradient-to-br from-sage/10 to-sage/5 border border-sage/30 rounded-sm">
            <h3 className="font-serif text-sm font-bold text-sage mb-2">
              Clinical Disclaimer
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              These assessments are self-report tools for personal reflection and
              are not validated clinical instruments. They do not constitute medical
              diagnosis or replace professional evaluation. Results may be useful as
              conversation starters with your healthcare provider but should not be
              used as the sole basis for treatment decisions.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
