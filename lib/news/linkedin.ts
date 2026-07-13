export type NewsCategory = "aiData" | "infrastructure" | "people" | "organization";
export type NewsSource = "company" | "leadership";

export interface LinkedInNewsItem {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  source: NewsSource;
  activityId: string;
  image?: string;
  featured?: boolean;
  searchTerms: string[];
}

const linkedInPost = (activityId: string) =>
  `https://www.linkedin.com/feed/update/urn:li:activity:${activityId}`;

export const NEWS_PAGE_SIZE = 6;

// Curated DDC and leadership references. Local images are used only when available
// in the repository; additions require editorial and rights review.
export const LINKEDIN_NEWS_INDEX: LinkedInNewsItem[] = [
  {
    id: "ai-platform",
    title: "DDC advances the National Bank's AI platform",
    summary:
      "A look at the engineering work behind the National Bank's AI platform and the practical systems that support it.",
    category: "aiData",
    source: "company",
    activityId: "7473705322331791361",
    image: "/images/linkedin/post_0_ai_platform.jpg",
    featured: true,
    searchTerms: ["ai", "artificial intelligence", "platform", "data", "national bank"],
  },
  {
    id: "digital-services",
    title: "Digital services built around reliable public infrastructure",
    summary:
      "DDC explains how its specialists turn operational requirements into dependable digital services for the National Bank.",
    category: "infrastructure",
    source: "company",
    activityId: "7471090932830855168",
    image: "/images/linkedin/post_1_digital_services.jpg",
    searchTerms: ["digital services", "infrastructure", "operations"],
  },
  {
    id: "project-management",
    title: "The people who coordinate critical digital projects",
    summary:
      "A team perspective on project management, delivery discipline, and collaboration across financial infrastructure programmes.",
    category: "people",
    source: "company",
    activityId: "7468260379098472448",
    image: "/images/linkedin/post_2_project_manager.jpg",
    searchTerms: ["project manager", "team", "delivery", "career"],
  },
  {
    id: "system-administration",
    title: "System administration behind resilient services",
    summary:
      "An inside view of the people and practices that keep essential systems stable and available.",
    category: "people",
    source: "company",
    activityId: "7430554463469453312",
    image: "/images/linkedin/post_3_sysadmin_nurali.jpg",
    searchTerms: ["system administrator", "reliability", "team", "operations"],
  },
  {
    id: "interview-tips",
    title: "Preparing for a technical career at DDC",
    summary:
      "Practical recruitment guidance for candidates preparing to join a team working on national-scale technology.",
    category: "people",
    source: "company",
    activityId: "7463529329201709056",
    image: "/images/linkedin/post_5_interview_tips.jpg",
    searchTerms: ["career", "interview", "recruitment", "team"],
  },
  {
    id: "llm-programme",
    title: "Applied LLM learning and engineering practice",
    summary:
      "DDC shares an education initiative focused on practical AI and LLM engineering skills.",
    category: "aiData",
    source: "company",
    activityId: "7434466951747268608",
    image: "/images/linkedin/post_6_nfactorial_llm.jpg",
    searchTerms: ["llm", "ai", "education", "engineering"],
  },
  {
    id: "it-architecture",
    title: "Architecture as a foundation for trusted digital services",
    summary:
      "A perspective on the IT architecture principles that guide complex financial-sector systems.",
    category: "infrastructure",
    source: "company",
    activityId: "7450435545597456385",
    image: "/images/linkedin/post_9_it_architecture.jpg",
    searchTerms: ["architecture", "it", "systems", "infrastructure"],
  },
  {
    id: "open-meeting",
    title: "A leadership conversation on DDC's digital direction",
    summary:
      "A meeting that brought the team together around the next stage of the National Bank's digital development.",
    category: "organization",
    source: "company",
    activityId: "7448264532290064384",
    image: "/images/linkedin/post_10_binur_meeting.jpg",
    searchTerms: ["leadership", "meeting", "digital transformation", "ddc"],
  },
  {
    id: "ai-learning",
    title: "A growing AI learning community at DDC",
    summary:
      "How continuous learning and technical exchange help teams apply AI responsibly in public financial infrastructure.",
    category: "aiData",
    source: "company",
    activityId: "7393498306569547776",
    image: "/images/linkedin/post_11_llm_learning.jpg",
    searchTerms: ["ai", "llm", "learning", "community"],
  },
  {
    id: "nauryz",
    title: "DDC marks Nauryz with the team and community",
    summary:
      "A moment from the organisation's culture and the people who build its technology together.",
    category: "people",
    source: "company",
    activityId: "7440331749038927872",
    image: "/images/linkedin/post_12_nauryz.jpg",
    searchTerms: ["nauryz", "culture", "team", "kazakhstan"],
  },
  {
    id: "kfgd-automation",
    title: "Automation for stronger financial-sector processes",
    summary:
      "A DDC project focused on making operational processes more reliable, traceable, and efficient.",
    category: "infrastructure",
    source: "company",
    activityId: "7392499128875941889",
    image: "/images/linkedin/post_13_kfgd_automation.jpg",
    searchTerms: ["automation", "financial sector", "processes", "kfgd"],
  },
  {
    id: "republic-day",
    title: "Republic Day: building digital capability for Kazakhstan",
    summary:
      "DDC reflects on public technology, national progress, and the people contributing to the country's digital future.",
    category: "organization",
    source: "company",
    activityId: "7387435607020519424",
    image: "/images/linkedin/post_14_republic_day.jpg",
    searchTerms: ["republic day", "kazakhstan", "digital transformation"],
  },
  {
    id: "data-factory",
    title: "Data Factory: a foundation for better financial insight",
    summary:
      "A public look at DDC's data-focused work and the systems that turn complex information into useful decisions.",
    category: "aiData",
    source: "company",
    activityId: "7385921757829808128",
    image: "/images/linkedin/post_15_data_factory.jpg",
    searchTerms: ["data factory", "data", "analytics", "financial insight"],
  },
  {
    id: "key-projects",
    title: "Key DDC projects supporting the National Bank",
    summary:
      "An overview of the products and programmes that connect DDC's work to the National Bank's strategic priorities.",
    category: "organization",
    source: "company",
    activityId: "7384573685673840640",
    image: "/images/linkedin/post_16_key_projects.jpg",
    searchTerms: ["projects", "national bank", "ddc", "strategy"],
  },
  {
    id: "suleimenov-meeting",
    title: "Collaboration around the next generation of financial technology",
    summary:
      "A discussion on cooperation, innovation, and the institutional foundation for high-quality digital services.",
    category: "organization",
    source: "company",
    activityId: "7380833625589637120",
    image: "/images/linkedin/post_17_suleimenov_meeting.jpg",
    searchTerms: ["cooperation", "innovation", "meeting", "financial technology"],
  },
  {
    id: "tech-talks",
    title: "Tech Talks: sharing engineering knowledge and risk awareness",
    summary:
      "DDC's technical community exchanges practical experience on resilient systems and informed decision-making.",
    category: "people",
    source: "company",
    activityId: "7379732459627814913",
    image: "/images/linkedin/post_18_tech_talks_risks.jpg",
    searchTerms: ["tech talks", "engineering", "risk", "knowledge"],
  },
  {
    id: "welcome-meeting",
    title: "Welcoming new colleagues to DDC",
    summary:
      "A glimpse of the organisation's culture and the people joining its long-term technology mission.",
    category: "people",
    source: "company",
    activityId: "7369262809072705538",
    image: "/images/linkedin/post_19_welcome_meeting.jpg",
    searchTerms: ["welcome", "team", "culture", "careers"],
  },
  {
    id: "ddc-transformation-engine",
    title: "DDC as an engine for the National Bank's digital transformation",
    summary:
      "Binur Zhalenov outlines how DDC brings together core systems, a Data Factory, reporting, and AI-enabled services.",
    category: "aiData",
    source: "leadership",
    activityId: "7351863893935165440",
    searchTerms: ["binur zhalenov", "ddc", "ai", "data factory", "digital transformation"],
  },
  {
    id: "ddc-expansion",
    title: "From Bank Service Bureau to Digital Development Center",
    summary:
      "Binur Zhalenov shares the rationale for DDC's expanded role as an integrated IT partner for the National Bank.",
    category: "organization",
    source: "leadership",
    activityId: "7306530368705257472",
    searchTerms: ["binur zhalenov", "bank service bureau", "ddc", "national bank"],
  },
];

export const getLinkedInPostUrl = (activityId: string) => linkedInPost(activityId);
