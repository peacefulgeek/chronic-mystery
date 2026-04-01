import { useState, useMemo } from "react";
import { Link } from "wouter";
import { SITE_CONFIG } from "@/data/types";
import SeoHead from "@/components/seo/SeoHead";

interface QuizQuestion {
  question: string;
  options: string[];
  scores: number[];
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: QuizQuestion[];
  results: { min: number; max: number; title: string; text: string }[];
}

const QUIZZES: Quiz[] = [
  {
    id: "pacing-style",
    title: "What's Your Pacing Style?",
    description: "Discover whether you're a boom-and-bust pacer, a careful envelope keeper, or somewhere in between.",
    category: "The Management",
    questions: [
      {
        question: "On a good energy day, you typically:",
        options: ["Do everything you've been putting off", "Stick to your usual routine", "Do slightly more than usual, carefully", "Rest more to bank the energy"],
        scores: [0, 3, 2, 1]
      },
      {
        question: "After a social event, you usually:",
        options: ["Crash for 2-3 days", "Feel tired but recover by next day", "Plan recovery time in advance", "Avoid social events entirely"],
        scores: [0, 2, 3, 1]
      },
      {
        question: "Your relationship with your to-do list is:",
        options: ["It's aspirational — I rarely finish it", "I've stopped making one", "I make a realistic one each morning", "I have a system with energy costs assigned"],
        scores: [0, 1, 2, 3]
      },
      {
        question: "When someone asks how you're doing, you:",
        options: ["Say 'fine' and change the subject", "Give an honest but brief answer", "Explain your energy level using a metaphor", "Share your current capacity in specific terms"],
        scores: [0, 1, 2, 3]
      },
      {
        question: "Your biggest pacing challenge is:",
        options: ["Stopping when I feel good", "Knowing my actual limits", "Accepting that limits exist", "Communicating limits to others"],
        scores: [0, 2, 1, 3]
      },
      {
        question: "When you overdo it, your first sign is usually:",
        options: ["I don't notice until I crash", "Brain fog hits first", "Physical exhaustion comes on gradually", "I track symptoms and catch it early"],
        scores: [0, 1, 2, 3]
      },
    ],
    results: [
      { min: 0, max: 5, title: "The Boom-and-Bust Pacer", text: "You ride the energy waves — soaring on good days and crashing on bad ones. This pattern is incredibly common and not your fault. The first step is recognizing it. Our articles on energy envelope management can help you find a more sustainable rhythm without losing the things that matter to you." },
      { min: 6, max: 11, title: "The Intuitive Pacer", text: "You have some awareness of your limits but rely on instinct rather than systems. This works sometimes, but fatigue conditions are sneaky — they punish you 24-48 hours after the overexertion, not during it. Building in more structure could help you catch the patterns your intuition misses." },
      { min: 12, max: 18, title: "The Strategic Pacer", text: "You've developed real skill at managing your energy. You plan, you track, you communicate. This doesn't mean you never crash — it means you've learned to minimize the frequency and severity. Keep refining your system. The body teaches slowly, and you're listening." },
    ]
  },
  {
    id: "medical-gaslighting",
    title: "Have You Been Medically Gaslit?",
    description: "A reality check on whether your healthcare experiences have crossed the line from frustrating to harmful.",
    category: "The Mystery",
    questions: [
      {
        question: "A doctor has told you your symptoms are 'just anxiety' without running tests.",
        options: ["Never", "Once", "Multiple times", "It's a regular occurrence"],
        scores: [0, 1, 2, 3]
      },
      {
        question: "You've been told your labs are 'normal' when you clearly feel unwell.",
        options: ["Never", "Once or twice", "Regularly", "Every appointment"],
        scores: [0, 1, 2, 3]
      },
      {
        question: "A healthcare provider has suggested your symptoms are psychological without evidence.",
        options: ["Never", "It was implied once", "It's been stated directly", "Multiple providers have said this"],
        scores: [0, 1, 2, 3]
      },
      {
        question: "You've left a medical appointment feeling worse about yourself than when you arrived.",
        options: ["Never", "Rarely", "Sometimes", "Most of the time"],
        scores: [0, 1, 2, 3]
      },
      {
        question: "You've stopped mentioning certain symptoms because you know they'll be dismissed.",
        options: ["No, I report everything", "I've downplayed a few things", "I have a mental list of 'don't mention'", "I barely tell doctors anything anymore"],
        scores: [0, 1, 2, 3]
      },
      {
        question: "You've researched your own condition more than your doctor seems to have.",
        options: ["No, my doctor is well-informed", "I've filled in some gaps", "I regularly bring research to appointments", "I know more than most doctors I've seen"],
        scores: [0, 1, 2, 3]
      },
    ],
    results: [
      { min: 0, max: 4, title: "Mostly Heard", text: "Your medical experiences have been relatively supportive. This is unfortunately rare in the chronic fatigue community. If you have a good provider, hold onto them — and consider sharing their name in patient communities so others can benefit." },
      { min: 5, max: 11, title: "Partially Dismissed", text: "You've experienced some dismissal but have also found providers who listen. This mixed experience is the most common. The key is recognizing that dismissal is a failure of the system, not evidence that your symptoms aren't real. Keep advocating." },
      { min: 12, max: 18, title: "Systematically Gaslit", text: "Your medical experiences have been consistently invalidating. This is medical gaslighting, and it causes real harm — not just to your treatment but to your sense of self. You deserve providers who take your experience seriously. Our articles on navigating the diagnostic odyssey may help you find them." },
    ]
  },
  {
    id: "rest-relationship",
    title: "What's Your Relationship with Rest?",
    description: "Explore whether rest feels like medicine, punishment, or something you haven't figured out yet.",
    category: "The Deeper Rest",
    questions: [
      {
        question: "When you lie down to rest, your mind usually:",
        options: ["Races with everything I should be doing", "Settles after 10-15 minutes", "Goes blank — I can't tell if I'm resting or dissociating", "Becomes quiet and present"],
        scores: [0, 2, 1, 3]
      },
      {
        question: "The word 'rest' makes you feel:",
        options: ["Guilty", "Relieved", "Confused — I don't know what real rest is", "Neutral — it's just part of my day"],
        scores: [0, 2, 1, 3]
      },
      {
        question: "Your ideal rest environment is:",
        options: ["I don't have one — I rest wherever I collapse", "Dark, quiet, phone away", "I need background noise or I spiral", "I've created a specific space for it"],
        scores: [0, 2, 1, 3]
      },
      {
        question: "After resting, you typically feel:",
        options: ["More anxious about lost time", "Slightly better physically", "No different — rest doesn't seem to help", "Genuinely restored"],
        scores: [0, 2, 1, 3]
      },
      {
        question: "You rest because:",
        options: ["My body forces me to", "I know I should", "I've learned it prevents crashes", "I've come to value it beyond just recovery"],
        scores: [0, 1, 2, 3]
      },
    ],
    results: [
      { min: 0, max: 4, title: "Rest Resister", text: "Rest feels like the enemy — a reminder of what you've lost. This is grief talking, and it's valid. But your body isn't punishing you by needing rest. It's trying to protect you. The shift from resistance to acceptance doesn't happen overnight, but it does happen." },
      { min: 5, max: 9, title: "Rest Learner", text: "You're in the process of redefining what rest means. Some days it works, some days it doesn't. This is normal. Rest is a skill, not just an absence of activity. You're building that skill." },
      { min: 10, max: 15, title: "Rest Practitioner", text: "You've moved beyond seeing rest as failure and into seeing it as practice. This is a profound shift that most people with chronic fatigue eventually reach — but not everyone. The fact that you're here suggests your relationship with your body is evolving in important ways." },
    ]
  },
  {
    id: "identity-shift",
    title: "Where Are You in the Identity Shift?",
    description: "Chronic illness changes who you are. This quiz maps where you are in that transformation.",
    category: "The Identity",
    questions: [
      {
        question: "When someone asks what you do, you:",
        options: ["Talk about what I used to do", "Struggle to answer", "Have found new ways to describe myself", "Feel at peace with who I am now"],
        scores: [0, 1, 2, 3]
      },
      {
        question: "Your relationship with your pre-illness self is:",
        options: ["I grieve that person daily", "I'm angry at what I lost", "I'm starting to see who I'm becoming", "I've integrated both versions of myself"],
        scores: [0, 1, 2, 3]
      },
      {
        question: "When you see healthy people doing things you can't, you feel:",
        options: ["Devastated", "Envious but trying not to be", "A mix of sadness and acceptance", "Mostly neutral — their life isn't mine"],
        scores: [0, 1, 2, 3]
      },
      {
        question: "Your sense of purpose currently comes from:",
        options: ["I don't have one anymore", "Surviving each day", "Small things I've discovered matter", "A new understanding of what matters"],
        scores: [0, 1, 2, 3]
      },
      {
        question: "If someone told you this illness has gifts, you would:",
        options: ["Want to punch them", "Understand the idea but not feel it yet", "Agree reluctantly — I've found some", "Agree fully — though I'd trade them for health"],
        scores: [0, 1, 2, 3]
      },
    ],
    results: [
      { min: 0, max: 4, title: "In the Grief", text: "You're in the early stages of identity loss, and it hurts. This is not a phase to rush through. The person you were mattered, and mourning them is appropriate. But you are not gone — you are changing. And change, even forced change, eventually reveals what was always underneath." },
      { min: 5, max: 9, title: "In the Transition", text: "You're between who you were and who you're becoming. This is the hardest place to be because nothing feels solid. But this in-between space is where the real work happens. You're not lost — you're in transit." },
      { min: 10, max: 15, title: "In the Integration", text: "You've begun to weave your illness into your identity rather than letting it replace your identity. This doesn't mean you're okay with being sick. It means you've found ways to be whole that don't depend on being well. That's a profound achievement." },
    ]
  },
  {
    id: "nervous-system",
    title: "Is Your Nervous System Running the Show?",
    description: "Find out whether your autonomic nervous system is stuck in fight-or-flight, freeze, or finding balance.",
    category: "The Medical",
    questions: [
      {
        question: "Your resting heart rate tends to be:",
        options: ["High — I can feel it racing even lying down", "Variable — it spikes unpredictably", "Normal but I feel wired inside", "Steady and calm"],
        scores: [3, 2, 1, 0]
      },
      {
        question: "When you stand up quickly, you:",
        options: ["Get dizzy or see stars regularly", "Sometimes feel lightheaded", "Occasionally notice it", "Feel fine"],
        scores: [3, 2, 1, 0]
      },
      {
        question: "Your sleep pattern is:",
        options: ["Wired but tired — can't fall asleep despite exhaustion", "Fall asleep but wake at 3am", "Unrefreshing no matter how long I sleep", "Generally okay"],
        scores: [3, 2, 1, 0]
      },
      {
        question: "Your digestion is:",
        options: ["Constantly disrupted", "Sensitive to stress and certain foods", "Occasionally problematic", "Mostly fine"],
        scores: [3, 2, 1, 0]
      },
      {
        question: "Your startle response is:",
        options: ["Extreme — I jump at everything", "Heightened compared to before", "About normal", "I'm actually quite calm"],
        scores: [3, 2, 1, 0]
      },
      {
        question: "After a stressful event, your body:",
        options: ["Stays activated for days", "Takes hours to settle", "Recovers within an hour", "Returns to baseline quickly"],
        scores: [3, 2, 1, 0]
      },
    ],
    results: [
      { min: 0, max: 5, title: "Relatively Regulated", text: "Your autonomic nervous system appears to be functioning reasonably well. This doesn't mean you don't have fatigue — it means the ANS component may not be your primary driver. Focus on other factors like mitochondrial function, immune dysregulation, or sleep architecture." },
      { min: 6, max: 11, title: "Dysregulated but Functional", text: "Your nervous system is showing signs of dysregulation — the kind that's common in ME/CFS, POTS, and post-viral conditions. Vagal tone exercises, careful pacing, and nervous system-aware approaches could help. This is the territory where the body is stuck between states." },
      { min: 12, max: 18, title: "Significantly Dysregulated", text: "Your autonomic nervous system is running in overdrive. This level of dysregulation affects everything — sleep, digestion, cognition, pain. It's not anxiety (though it can look like it). Consider working with a provider who understands dysautonomia, and explore our articles on nervous system regulation." },
    ]
  },
  {
    id: "brain-fog",
    title: "How Deep Is Your Brain Fog?",
    description: "Map the cognitive dimension of your fatigue — from mild haze to complete whiteout.",
    category: "The Mystery",
    questions: [
      {
        question: "Reading a full article feels:",
        options: ["Impossible most days", "Difficult — I reread paragraphs constantly", "Manageable if I'm rested", "Fine — cognitive symptoms aren't my main issue"],
        scores: [3, 2, 1, 0]
      },
      {
        question: "Finding the right word in conversation:",
        options: ["Happens constantly — I trail off mid-sentence", "I substitute wrong words regularly", "Occasionally frustrating", "Not a problem"],
        scores: [3, 2, 1, 0]
      },
      {
        question: "Your short-term memory is:",
        options: ["Essentially gone — I forget what I'm doing while doing it", "Unreliable — I need lists for everything", "Patchy — some days better than others", "Mostly intact"],
        scores: [3, 2, 1, 0]
      },
      {
        question: "Making decisions (even small ones) feels:",
        options: ["Overwhelming — I avoid them", "Exhausting — each one costs energy", "Harder than it used to be", "About the same as before"],
        scores: [3, 2, 1, 0]
      },
      {
        question: "After cognitive exertion (reading, conversation, screens), you:",
        options: ["Crash as hard as after physical exertion", "Need significant recovery time", "Feel tired but recover quickly", "Don't notice much impact"],
        scores: [3, 2, 1, 0]
      },
    ],
    results: [
      { min: 0, max: 4, title: "Light Haze", text: "Your cognitive symptoms are present but manageable. This is a good sign — it suggests your neuroinflammation may be mild or that you've found effective ways to manage cognitive load. Protect what you have by pacing cognitive activities as carefully as physical ones." },
      { min: 5, max: 9, title: "Moderate Fog", text: "The fog is real and it's affecting your daily life. This level of cognitive impairment is one of the most frustrating aspects of ME/CFS because it's invisible to others. Strategies like cognitive pacing, reducing sensory input, and timing demanding tasks for your best hours can help." },
      { min: 10, max: 15, title: "Dense Whiteout", text: "Your cognitive function is severely impacted. This isn't laziness or lack of effort — it's neuroinflammation, and it's measurable. Research by Anthony Komaroff and others has documented the objective cognitive deficits in ME/CFS. You're not imagining it. Prioritize brain rest as seriously as physical rest." },
    ]
  },
  {
    id: "support-system",
    title: "How Strong Is Your Support System?",
    description: "Chronic illness reveals who stays. This quiz assesses the quality of support around you.",
    category: "The Identity",
    questions: [
      {
        question: "The people closest to you understand your condition:",
        options: ["Not at all — they think I'm lazy", "They try but don't really get it", "They understand the basics", "They truly get it and adjust accordingly"],
        scores: [0, 1, 2, 3]
      },
      {
        question: "When you cancel plans, the typical response is:",
        options: ["Frustration or guilt-tripping", "Disappointment but acceptance", "Understanding without question", "They check in to see if I need anything"],
        scores: [0, 1, 2, 3]
      },
      {
        question: "You have at least one person who:",
        options: ["I don't have anyone who understands", "Listens when I talk about it", "Actively researches my condition", "Advocates for me when I can't"],
        scores: [0, 1, 2, 3]
      },
      {
        question: "Your online community connection is:",
        options: ["Nonexistent — I feel completely alone", "I lurk in forums but don't engage", "I participate in one or two groups", "I have meaningful connections with others who get it"],
        scores: [0, 1, 2, 3]
      },
      {
        question: "When you need practical help (groceries, rides, meals), you:",
        options: ["Have no one to ask", "Have to beg or feel guilty asking", "Have people who help when asked", "Have people who offer before I ask"],
        scores: [0, 1, 2, 3]
      },
    ],
    results: [
      { min: 0, max: 4, title: "Isolated", text: "You're carrying this largely alone, and that's an enormous weight on top of an already heavy condition. Isolation compounds every symptom. Even one connection — online or in person — can change the equation. You don't need a village. You need one person who believes you." },
      { min: 5, max: 9, title: "Partially Supported", text: "You have some support but it's incomplete. This is common — most people with chronic illness have a mix of people who try and people who don't understand. Focus your limited energy on the relationships that actually nourish you, and give yourself permission to step back from those that drain you." },
      { min: 10, max: 15, title: "Well Supported", text: "You've built or maintained a support system that actually works. This is rare and valuable. The people around you are part of your treatment plan whether they know it or not. Social support is one of the strongest predictors of quality of life in chronic illness." },
    ]
  },
  {
    id: "sleep-quality",
    title: "What's Really Happening with Your Sleep?",
    description: "Beyond hours in bed — explore the quality, architecture, and impact of your sleep.",
    category: "The Management",
    questions: [
      {
        question: "You wake up feeling:",
        options: ["Like I haven't slept at all", "Slightly less exhausted than when I went to bed", "Variable — some days okay, most days not", "Reasonably rested"],
        scores: [3, 2, 1, 0]
      },
      {
        question: "Falling asleep takes:",
        options: ["Hours — my body is tired but my brain won't stop", "30-60 minutes usually", "Under 30 minutes", "I fall asleep instantly (which might be a problem)"],
        scores: [2, 1, 0, 3]
      },
      {
        question: "During the night, you:",
        options: ["Wake multiple times and struggle to fall back asleep", "Wake once or twice but fall back asleep", "Sleep through but don't feel rested", "Sleep through and feel okay"],
        scores: [3, 1, 2, 0]
      },
      {
        question: "Your sleep schedule is:",
        options: ["Completely irregular — I sleep when I crash", "Shifted late — I'm a forced night owl", "Roughly consistent but not by choice", "Consistent and intentional"],
        scores: [3, 2, 1, 0]
      },
      {
        question: "Naps for you are:",
        options: ["Essential — I can't function without them", "Helpful but I feel guilty", "Occasional and strategic", "Not needed"],
        scores: [3, 2, 1, 0]
      },
      {
        question: "Your dreams are:",
        options: ["Vivid, intense, or disturbing", "More active than before I got sick", "Normal", "I don't remember them"],
        scores: [3, 2, 0, 1]
      },
    ],
    results: [
      { min: 0, max: 5, title: "Functional Sleep", text: "Your sleep, while perhaps not perfect, is doing its job reasonably well. This is a significant advantage in managing chronic fatigue. Protect your sleep hygiene fiercely — it's one of the foundations everything else rests on." },
      { min: 6, max: 11, title: "Disrupted Sleep", text: "Your sleep architecture is compromised. The unrefreshing sleep that characterizes ME/CFS is one of its most debilitating features — you can spend 10 hours in bed and wake up feeling like you pulled an all-nighter. Sleep studies, if you can access them, may reveal issues with deep sleep stages." },
      { min: 12, max: 18, title: "Severely Impaired Sleep", text: "Sleep has become another symptom rather than a recovery tool. This level of sleep disruption amplifies every other symptom — pain, fog, emotional regulation, immune function. This is worth bringing to a sleep specialist who understands ME/CFS, not just standard insomnia." },
    ]
  },
];

function QuizComponent({ quiz }: { quiz: Quiz }) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );
  const [showResult, setShowResult] = useState(false);

  const totalScore = useMemo(
    () => answers.reduce((sum: number, a) => sum + (a ?? 0), 0),
    [answers]
  );

  const result = useMemo(() => {
    if (!showResult) return null;
    return quiz.results.find((r) => totalScore >= r.min && totalScore <= r.max) || quiz.results[quiz.results.length - 1];
  }, [showResult, totalScore, quiz.results]);

  const allAnswered = answers.every((a) => a !== null);

  const handleAnswer = (qi: number, score: number) => {
    const newAnswers = [...answers];
    newAnswers[qi] = score;
    setAnswers(newAnswers);
  };

  const handleReset = () => {
    setAnswers(new Array(quiz.questions.length).fill(null));
    setShowResult(false);
  };

  return (
    <div className="border border-border rounded-sm p-6 bg-card">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-sans text-heather font-medium uppercase tracking-wider">
          {quiz.category}
        </span>
      </div>
      <h3 className="font-serif text-xl font-bold mb-2">{quiz.title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{quiz.description}</p>

      {!showResult ? (
        <>
          <div className="space-y-6">
            {quiz.questions.map((q, qi) => (
              <div key={qi}>
                <p className="font-sans text-sm font-medium mb-3">
                  {qi + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => handleAnswer(qi, q.scores[oi])}
                      className={`w-full text-left px-4 py-2.5 text-sm rounded-sm border transition-colors ${
                        answers[qi] === q.scores[oi]
                          ? "border-heather bg-heather/10 text-foreground"
                          : "border-border hover:border-heather/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt}
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
                ? "bg-heather text-white hover:bg-heather/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            See Your Result
          </button>
        </>
      ) : (
        <div className="bg-muted/30 border border-border rounded-sm p-6">
          <p className="text-xs font-sans text-heather font-medium uppercase tracking-wider mb-2">
            Your Result
          </p>
          <h4 className="font-serif text-lg font-bold mb-3">{result?.title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {result?.text}
          </p>
          <button
            onClick={handleReset}
            className="text-sm font-sans text-heather hover:underline"
          >
            Take this quiz again
          </button>
        </div>
      )}
    </div>
  );
}

export default function QuizzesPage() {
  return (
    <>
      <SeoHead
        title={`Self-Assessment Quizzes — ${SITE_CONFIG.title}`}
        description="Interactive quizzes to help you understand your pacing style, nervous system state, sleep quality, and more. Client-side — no data collected."
        canonical={`${SITE_CONFIG.url}/quizzes`}
      />

      <main className="container py-6">
        <nav className="text-xs font-sans text-muted-foreground mb-4">
          <Link href="/" className="hover:text-heather">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Quizzes</span>
        </nav>
        <hr className="rule-double mb-8" />

        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Self-Assessment Quizzes
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-2">
            These quizzes are not diagnostic tools. They're mirrors — designed to
            help you see patterns you might be too close to notice. All processing
            happens in your browser. We don't collect or store your answers.
          </p>
          <p className="text-sm text-muted-foreground mb-10">
            {QUIZZES.length} quizzes available
          </p>

          <div className="space-y-8">
            {QUIZZES.map((quiz) => (
              <QuizComponent key={quiz.id} quiz={quiz} />
            ))}
          </div>

          {/* Health Disclaimer */}
          <div className="mt-10 p-5 bg-gradient-to-br from-sage/10 to-sage/5 border border-sage/30 rounded-sm">
            <h3 className="font-serif text-sm font-bold text-sage mb-2">
              Important Note
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              These quizzes are for self-reflection only and are not substitutes for
              professional medical assessment. If your results concern you, please
              discuss them with a qualified healthcare provider who understands
              ME/CFS and related conditions.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
