const PLAYBOOKS = [
  {
    id: "ai-skill-learning",
    title: "AI Skill Learning: From Zero to Real Output",
    desc: "Learn any AI skill through structured practice with agent-guided feedback loops.",
    time: "20 min",
    level: "Beginner",
    skills: ["google-search", "summarizer", "assessment"],
  },
  {
    id: "career-learning-loop",
    title: "Career Learning Loop",
    desc: "Build a continuous professional development cycle with AI-assisted skill gap analysis.",
    time: "25 min",
    level: "Intermediate",
    skills: ["assessment", "mental-models", "selfoptimize"],
  },
  {
    id: "english-learning-professionals",
    title: "English for Professionals",
    desc: "Improve business English through immersive practice with real-time feedback.",
    time: "15 min",
    level: "Beginner",
    skills: ["translator", "rewriter", "content-engine"],
  },
  {
    id: "exam-prep-fast-track",
    title: "Exam Prep Fast Track",
    desc: "Ace any exam with spaced repetition, practice tests, and targeted weakness analysis.",
    time: "30 min",
    level: "Intermediate",
    skills: ["assessment", "summarizer", "keyword-extractor"],
  },
  {
    id: "learning-science-system",
    title: "Learning Science System",
    desc: "Apply evidence-based learning techniques with AI coaching and progress tracking.",
    time: "20 min",
    level: "Advanced",
    skills: ["mental-models", "assessment", "healthcheck"],
  },
  {
    id: "micro-learning-daily-digest",
    title: "Micro-Learning Daily Digest",
    desc: "Learn in 5-minute daily sessions with curated content and spaced repetition.",
    time: "10 min",
    level: "Beginner",
    skills: ["rss-manager", "summarizer", "reminder"],
  },
  {
    id: "personal-knowledge-system",
    title: "Personal Knowledge System",
    desc: "Build a second brain with AI-assisted capture, organization, and retrieval.",
    time: "25 min",
    level: "Intermediate",
    skills: ["keyword-extractor", "summarizer", "google-search"],
  },
  {
    id: "research-paper-reading",
    title: "Research Paper Reading",
    desc: "Read and synthesize academic papers efficiently with structured analysis workflows.",
    time: "20 min",
    level: "Intermediate",
    skills: ["academic-search", "summarizer", "keyword-extractor"],
  },
  {
    id: "technical-interview-training",
    title: "Technical Interview Training",
    desc: "Prepare for coding interviews with systematic practice and AI mock interviews.",
    time: "30 min",
    level: "Advanced",
    skills: ["code-gen", "debugger", "mental-models"],
  },
  {
    id: "writing-for-impact",
    title: "Writing for Impact",
    desc: "Master persuasive writing through structured frameworks and iterative AI feedback.",
    time: "20 min",
    level: "Intermediate",
    skills: ["writer", "copywriter", "rewriter"],
  },
];

export default function PlaybooksPage() {
  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
          Playbooks
        </h1>
        <p className="mb-12 text-lg text-zinc-500">
          End-to-end learning playbooks. Pick one, run the routine, ship the output.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLAYBOOKS.map((pb) => (
            <div
              key={pb.id}
              className="flex flex-col rounded-xl border border-zinc-200 p-6 transition hover:shadow-lg dark:border-zinc-800"
            >
              <div className="mb-3 flex items-center gap-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    pb.level === "Beginner"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : pb.level === "Intermediate"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                  }`}
                >
                  {pb.level}
                </span>
                <span className="text-xs text-zinc-400">{pb.time}</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
                {pb.title}
              </h3>
              <p className="mb-4 flex-1 text-sm text-zinc-500">{pb.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {pb.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
