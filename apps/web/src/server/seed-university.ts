import { db } from "./db";
import { colleges, departments, courses, semesters, faculty, courseSections } from "./db/schema";

const now = new Date();

const COLLEGES = [
  { id: "col-eng", name: "College of Engineering", slug: "engineering", iconEmoji: "🏗️", description: "Software development, architecture, testing, and DevOps." },
  { id: "col-biz", name: "School of Business & Finance", slug: "business", iconEmoji: "💰", description: "DeFi, trading, token economics, and on-chain analytics." },
  { id: "col-art", name: "College of Creative Arts", slug: "creative-arts", iconEmoji: "🎨", description: "Content creation, storytelling, copywriting, and social media." },
  { id: "col-inf", name: "School of Information Sciences", slug: "information-sciences", iconEmoji: "🔍", description: "Web search, academic research, social intelligence, and data feeds." },
  { id: "col-dai", name: "School of Data & AI", slug: "data-ai", iconEmoji: "🔬", description: "Text processing, NLP, sentiment analysis, and machine learning." },
  { id: "col-gen", name: "General Studies", slug: "general-studies", iconEmoji: "📚", description: "Foundational skills, self-assessment, and cross-disciplinary growth." },
] as const;

const DEPARTMENTS = [
  // Engineering
  { id: "dept-swe", collegeId: "col-eng", name: "Software Engineering", slug: "software-engineering", description: "Code generation, review, and debugging." },
  { id: "dept-arc", collegeId: "col-eng", name: "Architecture & Documentation", slug: "architecture-docs", description: "System design, refactoring, and technical writing." },
  // Business
  { id: "dept-defi", collegeId: "col-biz", name: "DeFi & Trading", slug: "defi-trading", description: "Decentralized finance and trading strategies." },
  { id: "dept-growth", collegeId: "col-biz", name: "Growth & Community", slug: "growth-community", description: "KOL management and community building." },
  // Creative Arts
  { id: "dept-write", collegeId: "col-art", name: "Writing & Narrative", slug: "writing-narrative", description: "Storytelling, professional writing, and copywriting." },
  { id: "dept-media", collegeId: "col-art", name: "Media & Marketing", slug: "media-marketing", description: "Social media strategy and content pipelines." },
  // Information Sciences
  { id: "dept-search", collegeId: "col-inf", name: "Search & Discovery", slug: "search-discovery", description: "Web search, academic research, and RSS feeds." },
  { id: "dept-socint", collegeId: "col-inf", name: "Social Intelligence", slug: "social-intelligence", description: "Twitter and Reddit intelligence gathering." },
  // Data & AI
  { id: "dept-nlp", collegeId: "col-dai", name: "Natural Language Processing", slug: "nlp", description: "Summarization, translation, and text rewriting." },
  { id: "dept-analysis", collegeId: "col-dai", name: "Text Analysis", slug: "text-analysis", description: "Keyword extraction and sentiment analysis." },
  // General Studies
  { id: "dept-foundations", collegeId: "col-gen", name: "Foundations", slug: "foundations", description: "Mental models, assessment, and self-improvement." },
  { id: "dept-ops", collegeId: "col-gen", name: "Operations & Tools", slug: "operations-tools", description: "Health monitoring, certification, and campus tools." },
] as const;

const COURSES = [
  // Engineering — Software Engineering
  { id: "crs-eng101", departmentId: "dept-swe", code: "ENG-101", title: "Software Development Fundamentals", description: "Learn to generate clean, functional code across languages and frameworks.", credits: 3, skillSlugs: ["code-gen"] },
  { id: "crs-eng201", departmentId: "dept-swe", code: "ENG-201", title: "Code Quality & Review", description: "Master code review practices, identify bugs, and ensure quality standards.", credits: 3, skillSlugs: ["code-review"], prerequisiteCourseIds: ["crs-eng101"] },
  { id: "crs-eng301", departmentId: "dept-swe", code: "ENG-301", title: "Debugging & Troubleshooting", description: "Systematic debugging techniques for complex software issues.", credits: 3, skillSlugs: ["debugger"], prerequisiteCourseIds: ["crs-eng201"] },
  // Engineering — Architecture
  { id: "crs-eng302", departmentId: "dept-arc", code: "ENG-302", title: "Refactoring & Architecture", description: "Restructure codebases for maintainability and scalability.", credits: 3, skillSlugs: ["refactor"], prerequisiteCourseIds: ["crs-eng201"] },
  { id: "crs-eng401", departmentId: "dept-arc", code: "ENG-401", title: "Technical Documentation", description: "Write clear, comprehensive technical documentation and API guides.", credits: 3, skillSlugs: ["doc-gen"], prerequisiteCourseIds: ["crs-eng101"] },
  // Business — DeFi & Trading
  { id: "crs-biz101", departmentId: "dept-defi", code: "BIZ-101", title: "On-Chain Analysis Fundamentals", description: "Analyze blockchain data, token flows, and wallet activities.", credits: 3, skillSlugs: ["chain-analyzer"] },
  { id: "crs-biz201", departmentId: "dept-defi", code: "BIZ-201", title: "DEX Trading Strategies", description: "Execute trades on decentralized exchanges with risk management.", credits: 4, skillSlugs: ["dex-trader"], prerequisiteCourseIds: ["crs-biz101"] },
  { id: "crs-biz301", departmentId: "dept-defi", code: "BIZ-301", title: "Token Launch & Economics", description: "Design tokenomics, launch tokens, and manage initial distribution.", credits: 4, skillSlugs: ["token-launcher"], prerequisiteCourseIds: ["crs-biz101"] },
  // Business — Growth
  { id: "crs-biz302", departmentId: "dept-growth", code: "BIZ-302", title: "KOL & Community Management", description: "Build and manage KOL networks and community engagement.", credits: 3, skillSlugs: ["kol-manager"] },
  { id: "crs-biz401", departmentId: "dept-growth", code: "BIZ-401", title: "Wallet Monitoring & Risk", description: "Monitor wallet activities and assess on-chain risk signals.", credits: 3, skillSlugs: ["wallet-monitor"], prerequisiteCourseIds: ["crs-biz101"] },
  // Creative Arts — Writing
  { id: "crs-art101", departmentId: "dept-write", code: "ART-101", title: "Creative Brainstorming", description: "Generate innovative ideas through structured brainstorming techniques.", credits: 3, skillSlugs: ["brainstorm"] },
  { id: "crs-art201", departmentId: "dept-write", code: "ART-201", title: "Narrative & Storytelling", description: "Craft compelling narratives and story structures.", credits: 3, skillSlugs: ["storyteller"], prerequisiteCourseIds: ["crs-art101"] },
  { id: "crs-art202", departmentId: "dept-write", code: "ART-202", title: "Professional Writing", description: "Write professional documents, reports, and articles.", credits: 3, skillSlugs: ["writer"] },
  { id: "crs-art301", departmentId: "dept-write", code: "ART-301", title: "Copywriting for Conversion", description: "Write persuasive copy that drives action and engagement.", credits: 3, skillSlugs: ["copywriter"], prerequisiteCourseIds: ["crs-art202"] },
  // Creative Arts — Media
  { id: "crs-art302", departmentId: "dept-media", code: "ART-302", title: "Social Media Strategy", description: "Plan and execute social media campaigns across platforms.", credits: 3, skillSlugs: ["social-media"] },
  { id: "crs-art401", departmentId: "dept-media", code: "ART-401", title: "Content Engine & Pipeline", description: "Build automated content production and distribution pipelines.", credits: 4, skillSlugs: ["content-engine"], prerequisiteCourseIds: ["crs-art302"] },
  // Information Sciences — Search
  { id: "crs-inf101", departmentId: "dept-search", code: "INF-101", title: "Web Search & Discovery", description: "Master web search techniques and information retrieval.", credits: 3, skillSlugs: ["google-search"] },
  { id: "crs-inf102", departmentId: "dept-search", code: "INF-102", title: "Academic Research Methods", description: "Find and analyze academic papers and scholarly sources.", credits: 3, skillSlugs: ["academic-search"] },
  { id: "crs-inf201", departmentId: "dept-search", code: "INF-201", title: "RSS & Information Feeds", description: "Manage and curate information feeds from multiple sources.", credits: 2, skillSlugs: ["rss-manager"] },
  // Information Sciences — Social Intel
  { id: "crs-inf301", departmentId: "dept-socint", code: "INF-301", title: "Twitter Intelligence", description: "Gather insights and trends from Twitter/X platform data.", credits: 3, skillSlugs: ["twitter-intel"] },
  { id: "crs-inf302", departmentId: "dept-socint", code: "INF-302", title: "Reddit Community Analysis", description: "Track and analyze Reddit communities and discussions.", credits: 3, skillSlugs: ["reddit-tracker"] },
  // Data & AI — NLP
  { id: "crs-dai101", departmentId: "dept-nlp", code: "DAI-101", title: "Text Summarization", description: "Distill long documents into concise, accurate summaries.", credits: 3, skillSlugs: ["summarizer"] },
  { id: "crs-dai102", departmentId: "dept-nlp", code: "DAI-102", title: "Translation & Localization", description: "Translate content across languages while preserving meaning.", credits: 2, skillSlugs: ["translator"] },
  { id: "crs-dai201", departmentId: "dept-nlp", code: "DAI-201", title: "Content Rewriting", description: "Rephrase and restructure text while maintaining intent.", credits: 2, skillSlugs: ["rewriter"] },
  // Data & AI — Analysis
  { id: "crs-dai301", departmentId: "dept-analysis", code: "DAI-301", title: "Keyword & Entity Extraction", description: "Extract meaningful keywords, entities, and topics from text.", credits: 3, skillSlugs: ["keyword-extractor"], prerequisiteCourseIds: ["crs-dai101"] },
  { id: "crs-dai302", departmentId: "dept-analysis", code: "DAI-302", title: "Sentiment Analysis", description: "Analyze sentiment, emotion, and opinion in text data.", credits: 3, skillSlugs: ["sentiment-analyzer"], prerequisiteCourseIds: ["crs-dai101"] },
  // General Studies — Foundations
  { id: "crs-gen101", departmentId: "dept-foundations", code: "GEN-101", title: "Mental Models for Agents", description: "Apply proven mental models to decision-making and problem-solving.", credits: 3, skillSlugs: ["mental-models"] },
  { id: "crs-gen102", departmentId: "dept-foundations", code: "GEN-102", title: "Agent Self-Assessment", description: "Evaluate your own capabilities, strengths, and growth areas.", credits: 3, skillSlugs: ["assessment"] },
  { id: "crs-gen202", departmentId: "dept-foundations", code: "GEN-202", title: "Self-Optimization", description: "Continuously improve performance through feedback loops.", credits: 3, skillSlugs: ["selfoptimize"], prerequisiteCourseIds: ["crs-gen102"] },
  // General Studies — Operations
  { id: "crs-gen201", departmentId: "dept-ops", code: "GEN-201", title: "Health Check & Monitoring", description: "Monitor agent health, uptime, and performance metrics.", credits: 2, skillSlugs: ["healthcheck"] },
  { id: "crs-gen301", departmentId: "dept-ops", code: "GEN-301", title: "Certification Preparation", description: "Prepare for and pass agent certification exams.", credits: 3, skillSlugs: ["certify"], prerequisiteCourseIds: ["crs-gen102"] },
  { id: "crs-gen302", departmentId: "dept-ops", code: "GEN-302", title: "Task & Reminder Management", description: "Manage tasks, schedules, and reminders effectively.", credits: 2, skillSlugs: ["reminder"] },
  { id: "crs-gen401", departmentId: "dept-ops", code: "GEN-401", title: "Campus SDK Integration", description: "Integrate with the Lobster University Campus platform via SDK.", credits: 3, skillSlugs: ["campus-sdk"] },
] as const;

const SEMESTERS = [
  {
    id: "sem-2026-spring",
    name: "Spring 2026",
    slug: "spring-2026",
    startDate: new Date("2026-02-01"),
    endDate: new Date("2026-06-30"),
    enrollmentOpenDate: new Date("2026-01-15"),
    enrollmentCloseDate: new Date("2026-02-28"),
    isActive: true,
  },
  {
    id: "sem-2026-fall",
    name: "Fall 2026",
    slug: "fall-2026",
    startDate: new Date("2026-09-01"),
    endDate: new Date("2027-01-31"),
    enrollmentOpenDate: new Date("2026-08-15"),
    enrollmentCloseDate: new Date("2026-09-30"),
    isActive: false,
  },
] as const;

const FACULTY = [
  { id: "fac-alice", name: "Dr. Alice Chen", title: "Professor of Software Engineering", departmentId: "dept-swe", bio: "15 years of experience in distributed systems and code quality.", avatarUrl: null },
  { id: "fac-bob", name: "Prof. Bob Martinez", title: "Associate Professor", departmentId: "dept-arc", bio: "Expert in system architecture and technical documentation.", avatarUrl: null },
  { id: "fac-carol", name: "Dr. Carol Kim", title: "Professor of DeFi", departmentId: "dept-defi", bio: "Researcher in decentralized finance and on-chain analytics.", avatarUrl: null },
  { id: "fac-dave", name: "Prof. Dave Johnson", title: "Lecturer", departmentId: "dept-growth", bio: "Community building and KOL network specialist.", avatarUrl: null },
  { id: "fac-eve", name: "Dr. Eve Williams", title: "Professor of Creative Writing", departmentId: "dept-write", bio: "Published author and narrative design expert.", avatarUrl: null },
  { id: "fac-frank", name: "Prof. Frank Liu", title: "Associate Professor", departmentId: "dept-media", bio: "Social media strategy and content pipeline architect.", avatarUrl: null },
  { id: "fac-grace", name: "Dr. Grace Park", title: "Professor of Information Science", departmentId: "dept-search", bio: "Specialist in information retrieval and web intelligence.", avatarUrl: null },
  { id: "fac-henry", name: "Prof. Henry Zhao", title: "Lecturer", departmentId: "dept-socint", bio: "Social intelligence and OSINT researcher.", avatarUrl: null },
  { id: "fac-iris", name: "Dr. Iris Thompson", title: "Professor of NLP", departmentId: "dept-nlp", bio: "Natural language processing and multilingual AI researcher.", avatarUrl: null },
  { id: "fac-jack", name: "Prof. Jack Rivera", title: "Associate Professor", departmentId: "dept-analysis", bio: "Text mining and sentiment analysis expert.", avatarUrl: null },
  { id: "fac-kate", name: "Dr. Kate Brown", title: "Professor of Foundations", departmentId: "dept-foundations", bio: "Agent cognition and self-improvement frameworks.", avatarUrl: null },
  { id: "fac-leo", name: "Prof. Leo Nakamura", title: "Lecturer", departmentId: "dept-ops", bio: "Operations tooling and agent certification specialist.", avatarUrl: null },
] as const;

// Map department -> faculty for course section assignment
const DEPT_FACULTY: Record<string, string> = {
  "dept-swe": "fac-alice",
  "dept-arc": "fac-bob",
  "dept-defi": "fac-carol",
  "dept-growth": "fac-dave",
  "dept-write": "fac-eve",
  "dept-media": "fac-frank",
  "dept-search": "fac-grace",
  "dept-socint": "fac-henry",
  "dept-nlp": "fac-iris",
  "dept-analysis": "fac-jack",
  "dept-foundations": "fac-kate",
  "dept-ops": "fac-leo",
};

async function seedUniversity() {
  console.log("Seeding university data...");

  // Colleges
  for (const c of COLLEGES) {
    await db.insert(colleges).values({ ...c, createdAt: now }).onConflictDoNothing();
  }
  console.log(`  ${COLLEGES.length} colleges`);

  // Departments
  for (const d of DEPARTMENTS) {
    await db.insert(departments).values({ ...d, createdAt: now }).onConflictDoNothing();
  }
  console.log(`  ${DEPARTMENTS.length} departments`);

  // Courses
  for (const c of COURSES) {
    await db.insert(courses).values({
      id: c.id,
      departmentId: c.departmentId,
      code: c.code,
      title: c.title,
      description: c.description,
      credits: c.credits,
      skillSlugs: c.skillSlugs as unknown as string[],
      prerequisiteCourseIds: ("prerequisiteCourseIds" in c ? c.prerequisiteCourseIds : []) as unknown as string[],
      maxEnrollment: 50,
      createdAt: now,
    }).onConflictDoNothing();
  }
  console.log(`  ${COURSES.length} courses`);

  // Semesters
  for (const s of SEMESTERS) {
    await db.insert(semesters).values(s).onConflictDoNothing();
  }
  console.log(`  ${SEMESTERS.length} semesters`);

  // Faculty
  for (const f of FACULTY) {
    await db.insert(faculty).values({ ...f, createdAt: now }).onConflictDoNothing();
  }
  console.log(`  ${FACULTY.length} faculty members`);

  // Course sections (1 section per course for Spring 2026)
  let sectionCount = 0;
  for (const c of COURSES) {
    const instructorId = DEPT_FACULTY[c.departmentId];
    if (!instructorId) continue;
    await db.insert(courseSections).values({
      id: `sec-${c.id}-spring26`,
      courseId: c.id,
      semesterId: "sem-2026-spring",
      instructorId,
      sectionNumber: 1,
      maxEnrollment: 50,
      currentEnrollment: 0,
    }).onConflictDoNothing();
    sectionCount++;
  }
  console.log(`  ${sectionCount} course sections`);

  console.log("University seed complete.");
}

seedUniversity()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
