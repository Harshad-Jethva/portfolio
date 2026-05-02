const ACHIEVEMENT_IMAGE_IDS = [
  "1540968221243-29f5d70540bf",
  "1596135187959-562c650d98bc",
  "1628944682084-831f35256163",
  "1590013330451-3946e83e0392",
  "1590421959604-741d0eec0a2e",
  "1572613000712-eadc57acbecd",
  "1570097192570-4b49a6736f9f",
  "1620789550663-2b10e0080354",
  "1617775623669-20bff4ffaa5c",
  "1548600916-dc8492f8e845",
  "1573824969595-a76d4365a2e6",
  "1633936929709-59991b5fdd72",
];

const PROJECT_IMAGE_IDS = [
  "1517245386807-bb43f82c33c4",
  "1551288049-bebda4e38f71",
  "1507238691740-197a5714a947",
];

const toUnsplashUrl = (imageId, width = 600) =>
  `https://images.unsplash.com/photo-${imageId}?w=${width}`;

export const DEFAULT_SKILL_GROUPS = [
  {
    cat: "Frontend",
    items: ["React", "Next.js", "HTML / CSS", "Tailwind CSS", "GSAP", "Three.js"],
  },
  {
    cat: "Backend",
    items: ["Node.js", "Express", "MongoDB", "REST APIs", "JWT Auth"],
  },
  {
    cat: "Tooling",
    items: ["Git / GitHub", "VS Code", "Figma", "Webpack", "Vercel"],
  },
  {
    cat: "Creative",
    items: ["WebGL", "Motion Design", "UI / UX Thinking", "Interaction Design"],
  },
];

export const DEFAULT_PROJECTS = [
  {
    index: "01",
    title: "Cafe Management System",
    tech: "React - Node.js - MongoDB - Socket.io",
    desc: "Real-time order tracking, admin dashboard, and analytics for a modern cafe built end-to-end with MERN and live WebSockets.",
    year: "2024",
    link: "https://github.com/harshadjethva",
    imageUrl: toUnsplashUrl(PROJECT_IMAGE_IDS[0]),
    sortOrder: 1,
  },
  {
    index: "02",
    title: "Expense Tracker Pro",
    tech: "React - Express - MongoDB - Chart.js",
    desc: "A premium financial tool with multi-category budgeting, smart coaching insights, and rich data visualizations.",
    year: "2024",
    link: "https://github.com/harshadjethva",
    imageUrl: toUnsplashUrl(PROJECT_IMAGE_IDS[1]),
    sortOrder: 2,
  },
  {
    index: "03",
    title: "Portfolio - This Site",
    tech: "Next.js - GSAP - Three.js - Lenis",
    desc: "A premium portfolio with cinematic preloader, 3D particle background, and scroll-driven transitions.",
    year: "2025",
    link: "#hero",
    imageUrl: toUnsplashUrl(PROJECT_IMAGE_IDS[2]),
    sortOrder: 3,
  },
];

export const DEFAULT_ACHIEVEMENTS = [
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[0], 280),
    title: "National Hackathon Finalist",
    organizer: "Smart India Hackathon",
    year: "2025",
    category: "Competition",
    details:
      "Built a full-stack civic issue reporting platform with real-time tracking and reached the final round.",
    location: "Ahmedabad, India",
    sortOrder: 1,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[1], 280),
    title: "Best UI Design Award",
    organizer: "Web Creators Summit",
    year: "2025",
    category: "Design",
    details:
      "Recognized for a motion-first portfolio interface focused on storytelling, clarity, and performance.",
    location: "Virtual",
    sortOrder: 2,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[2], 280),
    title: "Top Performer - Frontend",
    organizer: "CodeSprint League",
    year: "2024",
    category: "Frontend",
    details:
      "Ranked in the top bracket across multiple timed frontend challenges and UI engineering tasks.",
    location: "Pune, India",
    sortOrder: 3,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[3], 280),
    title: "Open Source Contributor Certificate",
    organizer: "Hacktoberfest",
    year: "2024",
    category: "Open Source",
    details:
      "Completed multiple accepted pull requests improving developer tooling and documentation quality.",
    location: "Global",
    sortOrder: 4,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[4], 280),
    title: "MERN Excellence Badge",
    organizer: "Full Stack Academy",
    year: "2024",
    category: "Full Stack",
    details:
      "Delivered production-ready MERN applications with authentication, dashboards, and analytics modules.",
    location: "Online",
    sortOrder: 5,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[5], 280),
    title: "Innovation Showcase Winner",
    organizer: "College Tech Fest",
    year: "2023",
    category: "Innovation",
    details:
      "Won first place for a campus service platform that unified events, notices, and student resources.",
    location: "Rajkot, India",
    sortOrder: 6,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[6], 280),
    title: "JavaScript Problem Solving Star",
    organizer: "Code Arena",
    year: "2023",
    category: "Programming",
    details:
      "Earned distinction for consistent high scores in algorithmic and practical JavaScript rounds.",
    location: "Virtual",
    sortOrder: 7,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[7], 280),
    title: "Responsive Web Specialist",
    organizer: "Frontend Masters Club",
    year: "2023",
    category: "Frontend",
    details:
      "Certified for creating responsive, accessible layouts with strong performance across devices.",
    location: "Online",
    sortOrder: 8,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[8], 280),
    title: "GSAP Motion Craft Mention",
    organizer: "Motion Web Awards",
    year: "2023",
    category: "Animation",
    details:
      "Received a special mention for smooth scroll-linked transitions and interaction-driven scenes.",
    location: "Virtual",
    sortOrder: 9,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[9], 280),
    title: "Client Appreciation Recognition",
    organizer: "Freelance Portfolio Client",
    year: "2022",
    category: "Professional",
    details:
      "Awarded for delivering a complete brand website revamp ahead of deadline with high user satisfaction.",
    location: "Remote",
    sortOrder: 10,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[10], 280),
    title: "Best Project Presentation",
    organizer: "Department Project Expo",
    year: "2022",
    category: "Presentation",
    details:
      "Recognized for clear system architecture communication and polished live demo execution.",
    location: "Gujarat, India",
    sortOrder: 11,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[11], 280),
    title: "Rising Developer Award",
    organizer: "Developer Community Circle",
    year: "2022",
    category: "Community",
    details:
      "Honored as an emerging developer for consistent learning, mentorship, and community participation.",
    location: "India",
    sortOrder: 12,
  },
];

export function flattenSkillGroups(groups) {
  return groups.flatMap((group, groupIndex) =>
    group.items.map((item, itemIndex) => ({
      category: group.cat,
      name: item,
      sortOrder: groupIndex * 100 + itemIndex + 1,
    }))
  );
}

export function groupSkillsByCategory(skills) {
  const grouped = new Map();

  for (const skill of skills) {
    const category = skill.category || "General";
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category).push(skill.name);
  }

  return Array.from(grouped.entries()).map(([cat, items]) => ({
    cat,
    items,
  }));
}
