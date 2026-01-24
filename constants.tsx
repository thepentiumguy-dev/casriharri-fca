import { Bot, Calculator, ShieldCheck } from 'lucide-react';
import { Project, ContactInfo } from './types';

export const PERSONAL_INFO = {
  name: "CA Sriharri, FCA",
  title: "FinTech Chartered Accountant | AI App Developer",
  tagline: "I don't just audit numbers; I write code that understands them.",
  bio: "I am a Chartered Accountant with a profound passion for FinTech and Automation. Currently working at CA TRR Office, I specialize in building AI-powered financial tools that simplify complex tax and accounting workflows. My goal is to create practical, automated solutions for professionals to enhance efficiency and accuracy.",
  organization: "CA TRR Office"
};

export const CONTACT_INFO: ContactInfo = {
  phone: "9047434305",
  email: "dssriharri@gmail.com",
  organization: "CA TRR Office"
};

export const PROJECTS: Project[] = [
  {
    id: 'finsight',
    name: "FinSight AI",
    shortDescription: "Your balance sheet, decoded by AI.",
    fullDescription: "An advanced AI-powered application designed to revolutionize how financial statements are analyzed. Users can upload financial documents to receive detailed automated insights, key ratio comparisons against industry standards, and automatic identification of potential red flags.",
    features: [
      "Automated Ratio Analysis",
      "Red Flag Detection",
      "Upload PDF/Excel Support",
      "Instant Insight Generation"
    ],
    url: "https://finsightai-sh.netlify.app",
    icon: Bot,
    color: "text-purple-400"
  },
  {
    id: 'taxplanner',
    name: "Tax Planner",
    shortDescription: "Strategic tax saving for the modern elite.",
    fullDescription: "A comprehensive smart tax planning tool tailored for High Net-worth Individuals (HNIs), Firms, and Companies. It analyzes income streams to calculate optimal tax outflows and suggests legal avenues for tax saving.",
    features: [
      "Scenario Comparison",
      "Firm vs Partner Analysis",
      "Old vs New Regime Optimization",
      "Visual Tax Breakdown"
    ],
    url: "https://thepentiumguy-dev.github.io/hni-group-tax-planner/",
    icon: Calculator,
    color: "text-emerald-400"
  },
  {
    id: 'audit-mate',
    name: "AuditMate Pro",
    shortDescription: "Compliance never looked this good.",
    fullDescription: "A workflow automation tool for audit teams to track compliance status in real-time. (Concept/Demo)",
    features: ["Real-time Tracking", "Team Collaboration", "Auto-generated Reports"],
    url: "#",
    icon: ShieldCheck,
    color: "text-blue-400"
  }
];

export const SOCIAL_LINKS = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/sriharri-d-s-648046162/", icon: "linkedin" },
  { name: "GitHub", url: "https://github.com/thepentiumguy-dev", icon: "github" },
  { name: "Instagram", url: "https://www.instagram.com/thepentiumguy/?hl=en", icon: "instagram" },
];
