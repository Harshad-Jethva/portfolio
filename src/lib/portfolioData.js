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
    cat: "Languages",
    items: ["JavaScript", "Python", "Java", "C", "C++", "VB.NET", "PHP"],
  },
  {
    cat: "Frontend",
    items: ["HTML5", "CSS3", "Tailwind CSS", "React.js", "Angular.js (basic)", "Bootstrap", "WordPress / Elementor"],
  },
  {
    cat: "Backend & Database",
    items: ["Node.js", "Express.js", "PHP", "ASP.NET", "MySQL", "PostgreSQL", "MongoDB"],
  },
  {
    cat: "Tools & Paradigms",
    items: ["Git / GitHub", "Vibe Coding", "UI / UX Design (Canva)", "DevOps (in progress)", "SDLC", "OOPS", "Postman", "ConnectWaba"],
  },
];

export const DEFAULT_PROJECTS = [
  {
    index: "01",
    title: "Sales Management ERP (SaaS)",
    tech: "React - PHP - PostgreSQL - Node.js - WhatsApp automation",
    desc: "A multi-user Sales Management System designed as a Software-as-a-Service (SaaS) product. Features comprehensive modules for lead tracking, inventory management, and multi-user access control.",
    year: "2024",
    link: "https://github.com/harshadjethva",
    imageUrl: toUnsplashUrl(PROJECT_IMAGE_IDS[0]),
    sortOrder: 1,
  },
  {
    index: "02",
    title: "SpacesByKd - Interior Design",
    tech: "HTML - CSS (Tailwind) - PHP - MySQL",
    desc: "Developed a management consultancy platform for SpacesByKd, focusing on interior design project workflows, consultancy phases, and client requirements tracking.",
    year: "2024",
    link: "https://github.com/harshadjethva",
    imageUrl: toUnsplashUrl(PROJECT_IMAGE_IDS[1]),
    sortOrder: 2,
  },
  {
    index: "03",
    title: "FixItBot - AI Complaint Management",
    tech: "HTML - CSS (Tailwind) - PHP - MySQL - Python AI",
    desc: "Built a web-based platform for automated complaint management tailored for municipal or institutional use, integrating a Python-based AI engine to categorize and process complaints efficiently.",
    year: "2025",
    link: "https://github.com/harshadjethva",
    imageUrl: toUnsplashUrl(PROJECT_IMAGE_IDS[2]),
    sortOrder: 3,
  },
  {
    index: "04",
    title: "Blood Donation & Trust Management",
    tech: "React.js - Angular.js",
    desc: "Designed and developed a dynamic website to manage donor databases and trust-related administrative tasks, focusing on high-level animations and a premium user experience.",
    year: "2025",
    link: "https://github.com/harshadjethva",
    imageUrl: toUnsplashUrl(PROJECT_IMAGE_IDS[0]),
    sortOrder: 4,
  },
];

export const DEFAULT_ACHIEVEMENTS = [
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[0], 280),
    title: "1st Rank: Dev Race Relay",
    organizer: "C.B. Patel BCA College",
    year: "2025",
    category: "Coding",
    details: "Won first place in Relay Coding in C/C++ competition.",
    location: "Surat, India",
    sortOrder: 1,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[1], 280),
    title: "1st Rank: Web Designing Competition",
    organizer: "Sri Uttar Gujarat BCA College",
    year: "2025",
    category: "Design",
    details: "Won first place in the inter-collegiate web designing challenge.",
    location: "Gujarat, India",
    sortOrder: 2,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[2], 280),
    title: "2nd Rank: Web Forge Competition",
    organizer: "Vidhyadeep University",
    year: "2026",
    category: "Competition",
    details: "Achieved runner-up position in Web Forge coding and layout event.",
    location: "Gujarat, India",
    sortOrder: 3,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[3], 280),
    title: "5th Rank: Overall University Rank in S.Y.B.C.A. (Sem-3)",
    organizer: "VNSGU University",
    year: "2024",
    category: "Academic",
    details: "Maintained outstanding academic standing with an SGPA of 9.18 (89.81%).",
    location: "Surat, India",
    sortOrder: 4,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[4], 280),
    title: "4th Rank: Overall University Rank in S.Y.B.C.A. (Sem-4)",
    organizer: "VNSGU University",
    year: "2025",
    category: "Academic",
    details: "Maintained outstanding academic standing with an SGPA of 9.18 (94.72%).",
    location: "Surat, India",
    sortOrder: 5,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[5], 280),
    title: "6th Rank: Overall University Rank in T.Y.B.C.A. (Sem-5)",
    organizer: "VNSGU University",
    year: "2025",
    category: "Academic",
    details: "Maintained outstanding academic standing with an SGPA of 9.00 (91.45%).",
    location: "Surat, India",
    sortOrder: 6,
  },
  {
    imageUrl: toUnsplashUrl(ACHIEVEMENT_IMAGE_IDS[6], 280),
    title: "Best Performance Award",
    organizer: "Sutex College",
    year: "2025",
    category: "Excellence",
    details: "Recognized for outstanding academic and extracurricular contributions.",
    location: "Surat, India",
    sortOrder: 7,
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
