# AI for Bookkeepers — Project Context
*Last updated: October 28, 2026*

## 1. Business and audience
**AI for Bookkeepers** is a standalone AI training and consulting offering led by Maria Blair for independent bookkeepers and owners of small bookkeeping practices serving private clients. The audience ranges from AI beginners to professionals already using ChatGPT or Claude who want practical, personalized instruction. The goal is to help them save time, improve workflows, and use AI confidently and responsibly—not teach skills they already know.

## 2. Partnership and customer acquisition
Maria is partnering with **Anna**, whose family operates a bookkeeping business. Anna and her husband intend to offer their clients a roughly **six-week program** that includes AI training provided by Maria. Those clients are an initial referral channel, and Maria will be paid directly by clients for her training. The independent website must also attract **organic leads** beyond the partnership. Track referrals (e.g., an Anna-specific assessment URL) without creating separate experiences.

## 3. Services and pricing
- **Primary offer:** personalized, one-to-one AI consultation/training for bookkeepers, initially positioned at **$100 per hour**.
- **Secondary offer:** small-team/group workshops, with scope and pricing discussed individually.
- Site visitors can request a consultation or workshop. **No online payment collection in the first website version**; payment can be arranged separately. Do not require payment to take the assessment.

## 4. Public website and client journey
Create a standalone, SEO-friendly **AI for Bookkeepers** website with:
1. A marketing landing page explaining the audience, real bookkeeping use cases, training formats, and clear calls to action.
2. A **free, publicly accessible, short (target 5–7 minutes), adaptive AI skills assessment**; it serves both referrals and new visitors as a lead-generation tool.
3. A results page with strengths, gaps, and tailored recommendations, followed by an **optional consultation request** and contact capture.
4. A secure private consultant dashboard for Maria to review submitted assessments, lead/referral sources, and draft personalized training agendas ahead of meetings.

Do not make assessment completion dependent on booking. Avoid collecting actual client financial records in the assessment.

## 5. Assessment design
Adapt questions to whether the respondent uses **ChatGPT, Claude, both, or neither**. Assess:
- AI experience and frequency of use
- Projects/workspaces, instructions, and knowledge/source files
- Connectors/integrations (Google Drive and whichever tools the practice actually uses)
- Prompting and repeatable workflows
- Bookkeeping applications: client communications, document organization, SOPs, spreadsheet/data analysis, reporting, and advisory support
- Privacy, confidentiality, accuracy checks, and responsible handling of client information
- Top time-consuming tasks and desired outcomes

Classify each capability as **proficient / partly proficient / not learned / not applicable**. If someone already uses Projects, investigate whether their setup includes effective instructions and sources rather than reteaching project creation. Generate a draft training agenda focusing on their gaps and real tasks; Maria reviews it before delivery. A competency-based readiness view may be included, but avoid implying a validated certification or scientific score.

## 6. Training approach
The consultation is **prepared from the pre-session assessment**, not spent repeating basics. A possible 90-minute format discussed was 10 minutes confirming priorities, 60 minutes targeted coaching, and 20 minutes improving one real workflow; this is illustrative, **not a committed session duration**. Training may cover fundamentals, personalization/projects, connectors, prompting, bookkeeping workflows, and advanced applications where appropriate.

## 7. Technical direction
**Proposed stack (not yet implemented):** Next.js + React + TypeScript; Tailwind CSS v4 and shadcn/ui; Supabase PostgreSQL and admin authentication; server-side OpenAI API for draft agendas; Cloudflare-compatible hosting and analytics. Use static/server-rendered public marketing content, interactive assessment pages, and authenticated non-indexed dashboard pages. Prioritize accessible semantic HTML, structured data where appropriate, sitemap, metadata, crawlable public content, caching, optimized assets, and strong Core Web Vitals. AI-crawler discoverability and Lighthouse scores are **goals, not guarantees**.

## 8. Visual direction and status
Three full-page **concept mockups** have been explored: **Warm + Modern Professional**, **Premium AI Studio**, and **Modern Professional**. The user requested all three for comparison; **no final design has been selected yet**. Modern Professional uses light backgrounds, navy/blue accents, clean typography, and welcoming office imagery; Premium AI Studio uses dark navy, teal/purple accents, and a more futuristic presentation. The site has **not been built or deployed** in this conversation.

## 9. Open decisions / future enhancements
- Final design direction and permanent domain name
- Exact booking mechanism and whether scheduling is integrated in v1
- Lead notification, consent/retention, and administrative access details
- Whether to add online payments in a later version
- Refine copy and conversion strategy using a separately evaluated marketing/sales GitHub skills repository

**Guiding principle:** An independent, approachable, credible site that converts visitors into leads and saves bookkeepers' time by teaching only what they need next.
