export type Answers = Record<string, string>;
export type Level =
  "Proficient" | "Partly proficient" | "Not learned" | "Not applicable";
export type Question = {
  id: string;
  title: string;
  help: string;
  options: readonly string[];
  skill?: string;
  when?: (a: Answers) => boolean;
};
const active = (a: Answers) => Boolean(a.tools && a.tools !== "Neither yet");
const levels = [
  "I do this confidently and check the outcome",
  "I have tried this, but need guidance",
  "I have not learned this yet",
  "Not relevant or unavailable in my setup",
] as const;
export const questions: Question[] = [
  {
    id: "tools",
    title: "Which AI tools do you use?",
    help: "Choose your current starting point. Every level is welcome.",
    options: ["ChatGPT", "Claude", "Both", "Neither yet"],
  },
  {
    id: "frequency",
    title: "How often does AI feature in your work?",
    help: "Think about your usual week, rather than what you hope to do.",
    options: [
      "Most working days",
      "A few times a week",
      "Occasionally",
      "I have not used it for work",
    ],
    when: active,
  },
  {
    id: "experience",
    title: "How would you describe your experience?",
    help: "This helps us set an appropriate pace.",
    options: [
      "Just getting started",
      "Experimenting with a few tasks",
      "Regularly using AI for work",
      "Building and refining workflows",
    ],
  },
  {
    id: "projects",
    title: "Do you organize work in Projects or workspaces?",
    help: "A dedicated space for related conversations and reusable context.",
    options: [
      "Yes, I use them regularly",
      "I have tried them",
      "Not yet",
      "Unavailable or not relevant",
    ],
    skill: "Projects & workspaces",
    when: active,
  },
  {
    id: "instructions",
    title: "How do you guide your AI’s behavior?",
    help: "For example, saved custom instructions for tone, boundaries and output format.",
    options: levels,
    skill: "Custom instructions",
    when: active,
  },
  {
    id: "projectInstructions",
    title: "Do your project instructions make the work repeatable?",
    help: "Consider task boundaries, practice terminology, output format and review steps—not simply creating a project.",
    options: levels,
    skill: "Project instructions",
    when: (a) =>
      active(a) &&
      ["Yes, I use them regularly", "I have tried them"].includes(a.projects),
  },
  {
    id: "sources",
    title: "How effectively do you use knowledge files and sources?",
    help: "For example, approved templates or anonymized SOPs, with sources kept current.",
    options: levels,
    skill: "Knowledge files & sources",
    when: active,
  },
  {
    id: "connectors",
    title: "How do you manage connectors and integrations?",
    help: "Connecting an approved drive or tool, checking permissions and limiting access. These features vary by plan.",
    options: levels,
    skill: "Connectors & integrations",
    when: active,
  },
  {
    id: "prompting",
    title: "Can you turn a task into a clear prompt?",
    help: "Include the goal, relevant context, constraints, an example and a useful output format.",
    options: levels,
    skill: "Prompting",
    when: active,
  },
  {
    id: "workflows",
    title: "Can you repeat an AI-assisted task reliably?",
    help: "Think of a reusable prompt or process with a clear human review step.",
    options: levels,
    skill: "Repeatable workflows",
    when: active,
  },
  {
    id: "applications",
    title: "Have you applied AI to bookkeeping-related work?",
    help: "For example, drafting a client reminder or an SOP using fictional details.",
    options: levels,
    skill: "Practical applications",
    when: active,
  },
  {
    id: "privacy",
    title: "Before sharing information with an AI tool, what do you do?",
    help: "Choose the closest match. Please do not share client information here.",
    options: [
      "Check permissions and data settings, minimize data, and use approved or fictional examples",
      "Remove names, but I am unsure about other data or settings",
      "I have not established a privacy process",
      "I do not use AI yet",
    ],
    skill: "Confidentiality & privacy",
  },
  {
    id: "verification",
    title: "How do you check an AI-generated answer?",
    help: "Consider a draft report or a spreadsheet explanation.",
    options: [
      "Independently verify numbers and sources, review context, and approve before use",
      "Read it for obvious errors",
      "Usually trust it if it sounds reasonable",
      "I have not learned how to verify outputs",
    ],
    skill: "Verification",
  },
  {
    id: "priority",
    title: "Which task would you most like help with?",
    help: "Choose one starting point. You can discuss other priorities with Maria later.",
    options: [
      "Client communications",
      "Document organization",
      "SOPs and checklists",
      "Spreadsheets and data analysis",
      "Reporting and advisory preparation",
    ],
  },
  {
    id: "outcome",
    title: "What would make learning AI useful to you?",
    help: "Your desired outcome helps shape a focused training agenda.",
    options: [
      "Know where to begin",
      "Improve a recurring task",
      "Use my existing tools more effectively",
      "Build a consistent team approach",
      "Strengthen privacy and review habits",
    ],
  },
];
export function visibleQuestions(a: Answers) {
  return questions.filter((q) => !q.when || q.when(a));
}
export function cleanAnswers(a: Answers) {
  return Object.fromEntries(
    visibleQuestions(a)
      .filter((q) => q.options.includes(a[q.id]))
      .map((q) => [q.id, a[q.id]]),
  );
}
export function validAnswers(a: Answers) {
  return visibleQuestions(a).every((q) => q.options.includes(a[q.id]));
}
export function capabilities(
  a: Answers,
): { name: string; level: Level; id: string }[] {
  return questions
    .filter((q) => q.skill)
    .map((q) => {
      let level: Level = "Not learned";
      const n = q.options.indexOf(a[q.id]);
      if (q.when && !q.when(a))
        level =
          a.tools === "Neither yet" && q.id !== "projectInstructions"
            ? "Not learned"
            : "Not applicable";
      else if (q.id === "privacy" && n === 3) level = "Not learned";
      else if (q.id === "verification")
        level =
          n === 0
            ? "Proficient"
            : n === 1
              ? "Partly proficient"
              : "Not learned";
      else
        level =
          n === 0
            ? "Proficient"
            : n === 1
              ? "Partly proficient"
              : n === 3
                ? "Not applicable"
                : "Not learned";
      return { id: q.id, name: q.skill!, level };
    });
}
export const workflowExamples: Record<string, string> = {
  "Client communications":
    "Draft a missing-document reminder using fictional client details. Specify tone and deadline, then check every request before sending.",
  "Document organization":
    "Create a document naming convention and intake checklist from a fictional practice example. Review exceptions before adopting it.",
  "SOPs and checklists":
    "Turn an anonymized process outline into a month-end checklist. Check the sequence, responsibilities and approval points.",
  "Spreadsheets and data analysis":
    "Ask for a formula explanation using a small synthetic dataset. Test it against independently calculated results.",
  "Reporting and advisory preparation":
    "Draft a plain-English summary from fictional figures. Verify every number and interpretation before using any client-facing version.",
};
export function results(a: Answers) {
  const skills = capabilities(a);
  const gaps = skills.filter(
    (s) => s.level === "Not learned" || s.level === "Partly proficient",
  );
  return {
    skills,
    strengths: skills.filter((s) => s.level === "Proficient"),
    gaps,
    priorities: [...gaps]
      .sort(
        (a, b) =>
          Number(["privacy", "verification"].includes(b.id)) -
          Number(["privacy", "verification"].includes(a.id)),
      )
      .slice(0, 3),
    example:
      workflowExamples[a.priority] || workflowExamples["Client communications"],
  };
}
export function referral(value: string | null | undefined) {
  return value && /^[a-z0-9_-]{1,40}$/i.test(value)
    ? value.toLowerCase()
    : "organic";
}
