import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgres://postgres:postgres@localhost:5432/portfolio';

const DEFAULT_SKILL_GROUPS = [
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

const DEFAULT_PROJECTS = [
  {
    index: "01",
    title: "Sales Management ERP (SaaS)",
    tech: "React - PHP - PostgreSQL - Node.js - WhatsApp automation",
    desc: "A multi-user Sales Management System designed as a Software-as-a-Service (SaaS) product. Features comprehensive modules for lead tracking, inventory management, and multi-user access control.",
    year: "2024",
    link: "https://github.com/harshadjethva",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600",
    sortOrder: 1,
  },
  {
    index: "02",
    title: "SpacesByKd - Interior Design",
    tech: "HTML - CSS (Tailwind) - PHP - MySQL",
    desc: "Developed a management consultancy platform for SpacesByKd, focusing on interior design project workflows, consultancy phases, and client requirements tracking.",
    year: "2024",
    link: "https://github.com/harshadjethva",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
    sortOrder: 2,
  },
  {
    index: "03",
    title: "FixItBot - AI Complaint Management",
    tech: "HTML - CSS (Tailwind) - PHP - MySQL - Python AI",
    desc: "Built a web-based platform for automated complaint management tailored for municipal or institutional use, integrating a Python-based AI engine to categorize and process complaints efficiently.",
    year: "2025",
    link: "https://github.com/harshadjethva",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-197a5714a947?w=600",
    sortOrder: 3,
  },
  {
    index: "04",
    title: "Blood Donation & Trust Management",
    tech: "React.js - Angular.js",
    desc: "Designed and developed a dynamic website to manage donor databases and trust-related administrative tasks, focusing on high-level animations and a premium user experience.",
    year: "2025",
    link: "https://github.com/harshadjethva",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600",
    sortOrder: 4,
  },
];

const DEFAULT_ACHIEVEMENTS = [
  {
    imageUrl: "https://images.unsplash.com/photo-1540968221243-29f5d70540bf?w=280",
    title: "1st Rank: Dev Race Relay",
    organizer: "C.B. Patel BCA College",
    year: "2025",
    category: "Coding",
    details: "Won first place in Relay Coding in C/C++ competition.",
    location: "Surat, India",
    sortOrder: 1,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1596135187959-562c650d98bc?w=280",
    title: "1st Rank: Web Designing Competition",
    organizer: "Sri Uttar Gujarat BCA College",
    year: "2025",
    category: "Design",
    details: "Won first place in the inter-collegiate web designing challenge.",
    location: "Gujarat, India",
    sortOrder: 2,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1628944682084-831f35256163?w=280",
    title: "2nd Rank: Web Forge Competition",
    organizer: "Vidhyadeep University",
    year: "2026",
    category: "Competition",
    details: "Achieved runner-up position in Web Forge coding and layout event.",
    location: "Gujarat, India",
    sortOrder: 3,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1590013330451-3946e83e0392?w=280",
    title: "5th Rank: Overall University Rank in S.Y.B.C.A. (Sem-3)",
    organizer: "VNSGU University",
    year: "2024",
    category: "Academic",
    details: "Maintained outstanding academic standing with an SGPA of 9.18 (89.81%).",
    location: "Surat, India",
    sortOrder: 4,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1590421959604-741d0eec0a2e?w=280",
    title: "4th Rank: Overall University Rank in S.Y.B.C.A. (Sem-4)",
    organizer: "VNSGU University",
    year: "2025",
    category: "Academic",
    details: "Maintained outstanding academic standing with an SGPA of 9.18 (94.72%).",
    location: "Surat, India",
    sortOrder: 5,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1572613000712-eadc57acbecd?w=280",
    title: "6th Rank: Overall University Rank in T.Y.B.C.A. (Sem-5)",
    organizer: "VNSGU University",
    year: "2025",
    category: "Academic",
    details: "Maintained outstanding academic standing with an SGPA of 9.00 (91.45%).",
    location: "Surat, India",
    sortOrder: 6,
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1570097192570-4b49a6736f9f?w=280",
    title: "Best Performance Award",
    organizer: "Sutex College",
    year: "2025",
    category: "Excellence",
    details: "Recognized for outstanding academic and extracurricular contributions.",
    location: "Surat, India",
    sortOrder: 7,
  },
];

async function run() {
  const client = new Client({ connectionString });
  await client.connect();

  console.log("Truncating existing tables...");
  await client.query("TRUNCATE TABLE skills, projects, achievements RESTART IDENTITY;");

  console.log("Inserting skills...");
  let sortOrder = 1;
  for (const group of DEFAULT_SKILL_GROUPS) {
    for (const item of group.items) {
      await client.query(
        "INSERT INTO skills (category, name, sort_order) VALUES ($1, $2, $3);",
        [group.cat, item, sortOrder++]
      );
    }
  }

  console.log("Inserting projects...");
  for (const project of DEFAULT_PROJECTS) {
    await client.query(
      `INSERT INTO projects 
        (index_label, title, tech_stack, description, year_label, project_link, image_url, sort_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [
        project.index,
        project.title,
        project.tech,
        project.desc,
        project.year,
        project.link,
        project.imageUrl,
        project.sortOrder,
      ]
    );
  }

  console.log("Inserting achievements...");
  for (const ach of DEFAULT_ACHIEVEMENTS) {
    await client.query(
      `INSERT INTO achievements 
        (image_url, title, organizer, year_label, category, details, location, sort_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [
        ach.imageUrl,
        ach.title,
        ach.organizer,
        ach.year,
        ach.category,
        ach.details,
        ach.location,
        ach.sortOrder,
      ]
    );
  }

  console.log("Database seeded successfully!");
  await client.end();
}

run().catch(console.error);
