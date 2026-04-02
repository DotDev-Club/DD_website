/**
 * Seed script — populates the database with sample data for all models.
 * Run with: npm run seed
 * Requires NEXT_PUBLIC_MONGODB_URI in a .env.local file.
 */

import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI || "";

// ─── Schemas (inline to keep seed self-contained) ───────────────────────────

const EventSchema = new mongoose.Schema({
  id: String, title: String, description: String, date: String,
  type: String, bannerImage: String, registrationLink: String,
  status: String, venue: String, dateCreated: String, dateModified: String,
});
const MemberSchema = new mongoose.Schema({
  id: String, name: String, role: String, category: String,
  photo: String, linkedin: String, github: String, batch: String, bio: String,
});
const ProjectSchema = new mongoose.Schema({
  id: String, name: String, description: String, techStack: [String],
  domain: String, coverImage: String, liveUrl: String, githubUrl: String,
  teamMembers: [String], year: String, featured: Boolean,
});
const WorkshopSchema = new mongoose.Schema({
  id: String, title: String, facilitator: String, date: String,
  duration: String, description: String, resourcesLink: String,
  coverImage: String, tags: [String], dateCreated: String,
});
const ApplicationSchema = new mongoose.Schema({
  name: String, email: String, year: String, branch: String,
  whyJoin: String, skills: String, submittedAt: String, status: String,
});
const GallerySchema = new mongoose.Schema({
  id: String, imageUrl: String, caption: String, eventTag: String, uploadedAt: String,
});

const EventModel    = mongoose.models.devevents      || mongoose.model("devevents",      EventSchema);
const MemberModel   = mongoose.models.devmembers     || mongoose.model("devmembers",     MemberSchema);
const ProjectModel  = mongoose.models.devprojects    || mongoose.model("devprojects",    ProjectSchema);
const WorkshopModel = mongoose.models.devworkshops   || mongoose.model("devworkshops",   WorkshopSchema);
const AppModel      = mongoose.models.devapplications || mongoose.model("devapplications", ApplicationSchema);
const GalleryModel  = mongoose.models.devgallery     || mongoose.model("devgallery",     GallerySchema);

// ─── Seed data ───────────────────────────────────────────────────────────────

const now = new Date().toISOString();

const PLACEHOLDER_IMG = "https://res.cloudinary.com/demo/image/upload/w_800,h_450,c_fill,q_auto/sample.jpg";
const PLACEHOLDER_AVATAR = "https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill,g_face,q_auto/sample.jpg";

const events = [
  {
    id: uuidv4(), title: "DevSprint 1.0 — 24-Hour Hackathon",
    description: "Build a working product in 24 hours. Open to all domains — Web, Mobile, AI/ML, and more. Top 3 teams win cash prizes and mentorship.",
    date: "2025-08-15", type: "Hackathon", bannerImage: PLACEHOLDER_IMG,
    registrationLink: "https://forms.gle/example", status: "upcoming",
    venue: "Innovation Lab, REVA University", dateCreated: now, dateModified: now,
  },
  {
    id: uuidv4(), title: "Full-Stack Bootcamp — Next.js Edition",
    description: "A 3-day intensive workshop covering Next.js 14, MongoDB, and Tailwind CSS. Walk away with a deployed project.",
    date: "2025-07-20", type: "Workshop", bannerImage: PLACEHOLDER_IMG,
    registrationLink: "", status: "upcoming",
    venue: "Seminar Hall A, Block 4", dateCreated: now, dateModified: now,
  },
  {
    id: uuidv4(), title: "Product Thinking in the Age of AI",
    description: "Industry talk by a senior PM from a top startup on how AI is reshaping product strategy and roadmaps.",
    date: "2025-06-30", type: "Talk", bannerImage: PLACEHOLDER_IMG,
    registrationLink: "", status: "past",
    venue: "Auditorium, REVA University", dateCreated: now, dateModified: now,
  },
  {
    id: uuidv4(), title: "Product Sprint — HealthTech Edition",
    description: "A week-long sprint where teams ideate, prototype, and present solutions for real healthcare challenges.",
    date: "2025-09-01", type: "Product Sprint", bannerImage: PLACEHOLDER_IMG,
    registrationLink: "https://forms.gle/example2", status: "upcoming",
    venue: "Design Studio, REVA University", dateCreated: now, dateModified: now,
  },
  {
    id: uuidv4(), title: "Smart India Hackathon — Internal Round",
    description: "Internal selection round for SIH 2025. Top teams represent REVA University at the national level.",
    date: "2025-05-10", type: "Hackathon", bannerImage: PLACEHOLDER_IMG,
    registrationLink: "", status: "past",
    venue: "Main Campus", dateCreated: now, dateModified: now,
  },
  {
    id: uuidv4(), title: "Git & GitHub Workshop for Beginners",
    description: "Hands-on session covering version control, branching strategies, and collaborative development.",
    date: "2025-04-12", type: "Workshop", bannerImage: PLACEHOLDER_IMG,
    registrationLink: "", status: "past",
    venue: "Lab 301, REVA University", dateCreated: now, dateModified: now,
  },
];

const members = [
  {
    id: uuidv4(), name: "Arjun Sharma", role: "President", category: "Core Team",
    photo: PLACEHOLDER_AVATAR, linkedin: "https://linkedin.com/in/arjun-sharma",
    github: "https://github.com/arjun-sharma", batch: "2022-2026",
    bio: "Full-stack developer passionate about product-led growth.",
  },
  {
    id: uuidv4(), name: "Priya Nair", role: "Vice President", category: "Core Team",
    photo: PLACEHOLDER_AVATAR, linkedin: "https://linkedin.com/in/priya-nair",
    github: "https://github.com/priya-nair", batch: "2022-2026",
    bio: "UI/UX designer who loves building delightful user experiences.",
  },
  {
    id: uuidv4(), name: "Rahul Mehta", role: "Technical Lead", category: "Core Team",
    photo: PLACEHOLDER_AVATAR, linkedin: "https://linkedin.com/in/rahul-mehta",
    github: "https://github.com/rahul-mehta", batch: "2022-2026",
    bio: "Backend engineer specializing in scalable APIs.",
  },
  {
    id: uuidv4(), name: "Sneha Reddy", role: "Events Lead", category: "Core Team",
    photo: PLACEHOLDER_AVATAR, linkedin: "https://linkedin.com/in/sneha-reddy",
    github: "", batch: "2023-2027",
    bio: "Organizes hackathons and builds community experiences.",
  },
  {
    id: uuidv4(), name: "Karthik Bhat", role: "Design Lead", category: "Core Team",
    photo: PLACEHOLDER_AVATAR, linkedin: "https://linkedin.com/in/karthik-bhat",
    github: "https://github.com/karthik-bhat", batch: "2023-2027",
    bio: "Figma wizard and design systems enthusiast.",
  },
  {
    id: uuidv4(), name: "Dr. Meera Krishnan", role: "Faculty Advisor", category: "Faculty Advisor",
    photo: PLACEHOLDER_AVATAR, linkedin: "https://linkedin.com/in/dr-meera-krishnan",
    github: "", batch: "Faculty",
    bio: "Professor of Computer Science, research focus on distributed systems.",
  },
  {
    id: uuidv4(), name: "Vikram Anand", role: "Mentor — Product", category: "Mentor",
    photo: PLACEHOLDER_AVATAR, linkedin: "https://linkedin.com/in/vikram-anand",
    github: "", batch: "Alumni 2020",
    bio: "Product Manager at a Series B startup. REVA alumnus.",
  },
  {
    id: uuidv4(), name: "Divya Suresh", role: "Mentor — Engineering", category: "Mentor",
    photo: PLACEHOLDER_AVATAR, linkedin: "https://linkedin.com/in/divya-suresh",
    github: "https://github.com/divya-suresh", batch: "Alumni 2021",
    bio: "Senior SWE at a top tech company. Loves open source.",
  },
];

const projects = [
  {
    id: uuidv4(), name: "CampusEats", description: "A food ordering platform for REVA campus with real-time order tracking and canteen management.",
    techStack: ["Next.js", "Node.js", "MongoDB", "Tailwind CSS", "Socket.io"],
    domain: "Web", coverImage: PLACEHOLDER_IMG, liveUrl: "https://campus-eats.netlify.app",
    githubUrl: "https://github.com/dotdev-reva/campus-eats", teamMembers: ["Arjun Sharma", "Priya Nair", "Rahul Mehta"],
    year: "2025", featured: true,
  },
  {
    id: uuidv4(), name: "RevaBot", description: "An AI-powered chatbot for REVA University FAQs, admission queries, and campus navigation.",
    techStack: ["Python", "FastAPI", "OpenAI", "React", "PostgreSQL"],
    domain: "AI/ML", coverImage: PLACEHOLDER_IMG, liveUrl: "",
    githubUrl: "https://github.com/dotdev-reva/reva-bot", teamMembers: ["Karthik Bhat", "Sneha Reddy"],
    year: "2025", featured: true,
  },
  {
    id: uuidv4(), name: "DevTrack", description: "A project management tool built for student clubs — track tasks, milestones, and team progress.",
    techStack: ["React", "Express", "MongoDB", "Tailwind CSS"],
    domain: "Web", coverImage: PLACEHOLDER_IMG, liveUrl: "https://devtrack.netlify.app",
    githubUrl: "https://github.com/dotdev-reva/dev-track", teamMembers: ["Rahul Mehta"],
    year: "2024", featured: false,
  },
  {
    id: uuidv4(), name: "GreenLedger", description: "A blockchain-based carbon credit tracking system for small businesses.",
    techStack: ["Solidity", "Hardhat", "React", "ethers.js"],
    domain: "Blockchain", coverImage: PLACEHOLDER_IMG, liveUrl: "",
    githubUrl: "https://github.com/dotdev-reva/green-ledger", teamMembers: ["Arjun Sharma"],
    year: "2024", featured: false,
  },
  {
    id: uuidv4(), name: "MediScan", description: "A mobile app that uses ML to detect early signs of skin conditions from photos.",
    techStack: ["Flutter", "TensorFlow Lite", "Firebase"],
    domain: "Mobile", coverImage: PLACEHOLDER_IMG, liveUrl: "",
    githubUrl: "https://github.com/dotdev-reva/medi-scan", teamMembers: ["Sneha Reddy", "Karthik Bhat"],
    year: "2024", featured: false,
  },
  {
    id: uuidv4(), name: "OpenResume", description: "An open-source resume builder with ATS-friendly templates and one-click PDF export.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
    domain: "Open Source", coverImage: PLACEHOLDER_IMG, liveUrl: "https://open-resume.netlify.app",
    githubUrl: "https://github.com/dotdev-reva/open-resume", teamMembers: ["Priya Nair"],
    year: "2023", featured: false,
  },
];

const workshops = [
  {
    id: uuidv4(), title: "Building REST APIs with Node.js & Express",
    facilitator: "Rahul Mehta", date: "2025-03-15", duration: "3 hours",
    description: "A hands-on session covering REST API design, middleware, authentication, and deployment. Participants built a fully functional API by the end.",
    resourcesLink: "https://drive.google.com/example", coverImage: PLACEHOLDER_IMG,
    tags: ["Node.js", "Express", "REST", "API"], dateCreated: now,
  },
  {
    id: uuidv4(), title: "Intro to Machine Learning with scikit-learn",
    facilitator: "Divya Suresh", date: "2025-02-20", duration: "4 hours",
    description: "From data preprocessing to model evaluation — a beginner-friendly ML workshop using real datasets.",
    resourcesLink: "https://drive.google.com/example2", coverImage: PLACEHOLDER_IMG,
    tags: ["Python", "ML", "scikit-learn", "Data Science"], dateCreated: now,
  },
  {
    id: uuidv4(), title: "Figma for Developers: Design Handoff Masterclass",
    facilitator: "Priya Nair", date: "2025-01-18", duration: "2.5 hours",
    description: "Learn how to read Figma designs, use auto-layout, extract tokens, and collaborate effectively with designers.",
    resourcesLink: "", coverImage: PLACEHOLDER_IMG,
    tags: ["Figma", "UI/UX", "Design Systems"], dateCreated: now,
  },
  {
    id: uuidv4(), title: "Docker & Containers 101",
    facilitator: "Vikram Anand", date: "2024-12-10", duration: "3 hours",
    description: "Containerise your applications, write Dockerfiles, and deploy with Docker Compose. Beginner to intermediate level.",
    resourcesLink: "https://drive.google.com/example3", coverImage: PLACEHOLDER_IMG,
    tags: ["Docker", "DevOps", "Containers"], dateCreated: now,
  },
  {
    id: uuidv4(), title: "Product Management 101 for Engineers",
    facilitator: "Vikram Anand", date: "2024-11-05", duration: "2 hours",
    description: "What does a PM actually do? How to write PRDs, prioritize features, and work cross-functionally. Essential for aspiring PMs.",
    resourcesLink: "", coverImage: PLACEHOLDER_IMG,
    tags: ["Product", "PM", "Strategy"], dateCreated: now,
  },
];

const galleryImages = [
  { id: uuidv4(), imageUrl: PLACEHOLDER_IMG, caption: "DevSprint 1.0 kickoff — teams huddle up!", eventTag: "DevSprint 1.0", uploadedAt: now },
  { id: uuidv4(), imageUrl: PLACEHOLDER_IMG, caption: "Workshop in progress — Next.js Bootcamp", eventTag: "Next.js Bootcamp", uploadedAt: now },
  { id: uuidv4(), imageUrl: PLACEHOLDER_IMG, caption: "Award ceremony — SIH Internal Round", eventTag: "SIH 2025", uploadedAt: now },
  { id: uuidv4(), imageUrl: PLACEHOLDER_IMG, caption: "Team .Dev at REVA Tech Fest 2025", eventTag: "Tech Fest", uploadedAt: now },
  { id: uuidv4(), imageUrl: PLACEHOLDER_IMG, caption: "Mentorship session with Vikram Anand", eventTag: "Mentorship", uploadedAt: now },
  { id: uuidv4(), imageUrl: PLACEHOLDER_IMG, caption: "Product Sprint — final presentations", eventTag: "Product Sprint", uploadedAt: now },
];

// ─── Main ────────────────────────────────────────────────────────────────────

async function seed() {
  if (!MONGODB_URI) {
    console.error("❌  NEXT_PUBLIC_MONGODB_URI is not set. Create a .env.local file.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.\n");

  const models = [
    { name: "Events",       model: EventModel,    data: events },
    { name: "Members",      model: MemberModel,   data: members },
    { name: "Projects",     model: ProjectModel,  data: projects },
    { name: "Workshops",    model: WorkshopModel, data: workshops },
    { name: "Gallery",      model: GalleryModel,  data: galleryImages },
  ];

  for (const { name, model, data } of models) {
    await model.deleteMany({});
    await model.insertMany(data);
    console.log(`✅  ${name}: seeded ${data.length} documents`);
  }

  console.log("\n🌱  Seed complete.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
