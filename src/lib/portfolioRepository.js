import { DEFAULT_ACHIEVEMENTS, DEFAULT_PROJECTS, DEFAULT_SKILL_GROUPS, flattenSkillGroups, groupSkillsByCategory } from "@/lib/portfolioData";
import { getSchemaPromise, query, setSchemaPromise, withTransaction } from "@/lib/postgres";

export { query, withTransaction };

const SCHEMA_STATEMENTS = [
  `
    CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      index_label TEXT NOT NULL,
      title TEXT NOT NULL,
      tech_stack TEXT NOT NULL,
      description TEXT NOT NULL,
      year_label TEXT NOT NULL,
      project_link TEXT NOT NULL,
      image_url TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS achievements (
      id SERIAL PRIMARY KEY,
      image_url TEXT NOT NULL,
      title TEXT NOT NULL,
      organizer TEXT NOT NULL,
      year_label TEXT NOT NULL,
      category TEXT NOT NULL,
      details TEXT NOT NULL,
      location TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Admin',
      permissions JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS media_assets (
      id SERIAL PRIMARY KEY,
      file_name TEXT NOT NULL,
      public_url TEXT NOT NULL,
      file_type TEXT,
      file_size INTEGER,
      content TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS global_settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS pages (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      parent_id INTEGER REFERENCES pages(id) ON DELETE SET NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_folder BOOLEAN NOT NULL DEFAULT FALSE,
      meta_title TEXT,
      meta_description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS sections (
      id SERIAL PRIMARY KEY,
      page_id INTEGER REFERENCES pages(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
      is_locked BOOLEAN NOT NULL DEFAULT FALSE,
      is_global BOOLEAN NOT NULL DEFAULT FALSE,
      template_name TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS widgets (
      id SERIAL PRIMARY KEY,
      section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      content JSONB NOT NULL DEFAULT '{}',
      style JSONB NOT NULL DEFAULT '{}',
      layout JSONB NOT NULL DEFAULT '{}',
      animation JSONB NOT NULL DEFAULT '{}',
      visibility JSONB NOT NULL DEFAULT '{}',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS menus (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      location TEXT
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS menu_items (
      id SERIAL PRIMARY KEY,
      menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
      label TEXT NOT NULL,
      url TEXT NOT NULL,
      parent_id INTEGER REFERENCES menu_items(id) ON DELETE SET NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      badge_text TEXT,
      icon TEXT
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS page_revisions (
      id SERIAL PRIMARY KEY,
      page_id INTEGER REFERENCES pages(id) ON DELETE CASCADE,
      composition JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      comment TEXT
    );
  `,
  `
    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `,
];

const toInteger = (value, fallback = 0) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const mapSkill = (row) => ({
  id: row.id,
  category: row.category,
  name: row.name,
  sortOrder: row.sort_order,
});

const mapProject = (row) => ({
  id: row.id,
  index: row.index_label,
  title: row.title,
  tech: row.tech_stack,
  desc: row.description,
  year: row.year_label,
  link: row.project_link,
  imageUrl: row.image_url,
  sortOrder: row.sort_order,
});

const mapAchievement = (row) => ({
  id: row.id,
  imageUrl: row.image_url,
  title: row.title,
  organizer: row.organizer,
  year: row.year_label,
  category: row.category,
  details: row.details,
  location: row.location,
  sortOrder: row.sort_order,
});

const mapMessage = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  message: row.message,
  createdAt: row.created_at,
});

async function seedSkillsIfEmpty() {
  const countResult = await query("SELECT COUNT(*)::int AS count FROM skills;");
  if (countResult.rows[0].count > 0) return;

  const seeds = flattenSkillGroups(DEFAULT_SKILL_GROUPS);
  await withTransaction(async (client) => {
    for (const seed of seeds) {
      await client.query(
        `
          INSERT INTO skills (category, name, sort_order)
          VALUES ($1, $2, $3);
        `,
        [seed.category, seed.name, seed.sortOrder]
      );
    }
  });
}

async function seedProjectsIfEmpty() {
  const countResult = await query("SELECT COUNT(*)::int AS count FROM projects;");
  if (countResult.rows[0].count > 0) return;

  await withTransaction(async (client) => {
    for (const seed of DEFAULT_PROJECTS) {
      await client.query(
        `
          INSERT INTO projects
            (index_label, title, tech_stack, description, year_label, project_link, image_url, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `,
        [
          seed.index,
          seed.title,
          seed.tech,
          seed.desc,
          seed.year,
          seed.link,
          seed.imageUrl ?? "",
          seed.sortOrder ?? 0,
        ]
      );
    }
  });
}

async function seedAchievementsIfEmpty() {
  const countResult = await query("SELECT COUNT(*)::int AS count FROM achievements;");
  if (countResult.rows[0].count > 0) return;

  await withTransaction(async (client) => {
    for (const seed of DEFAULT_ACHIEVEMENTS) {
      await client.query(
        `
          INSERT INTO achievements
            (image_url, title, organizer, year_label, category, details, location, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `,
        [
          seed.imageUrl,
          seed.title,
          seed.organizer,
          seed.year,
          seed.category,
          seed.details,
          seed.location,
          seed.sortOrder ?? 0,
        ]
      );
    }
  });
}

async function seedUsersIfEmpty() {
  const countResult = await query("SELECT COUNT(*)::int AS count FROM users;");
  if (countResult.rows[0].count > 0) return;

  await query(
    `
      INSERT INTO users (username, password_hash)
      VALUES ($1, $2);
    `,
    ["Harshad", "$2b$10$ilKFYqmJzunzcsa9wUglPOzJBiwrzzEbyih0.iqiJd.7wb/Z/N7nu"]
  );
}

async function seedPageBuilderIfEmpty() {
  const countResult = await query("SELECT COUNT(*)::int AS count FROM pages;");
  if (countResult.rows[0].count > 0) return;

  const projectsRes = await query(
    `
      SELECT
        id, index_label, title, tech_stack, description, year_label,
        project_link, image_url, sort_order
      FROM projects
      ORDER BY sort_order ASC, id ASC;
    `
  );
  const dbProjects = projectsRes.rows.map(mapProject);

  const skillsRes = await query(
    `
      SELECT id, category, name, sort_order
      FROM skills
      ORDER BY category ASC, sort_order ASC, id ASC;
    `
  );
  const dbSkillGroups = groupSkillsByCategory(skillsRes.rows.map(mapSkill));

  await withTransaction(async (client) => {
    // 1. Create page
    const pageResult = await client.query(
      `
        INSERT INTO pages (slug, title, status)
        VALUES ('home', 'Home Page', 'published')
        RETURNING id;
      `
    );
    const pageId = pageResult.rows[0].id;

    // 2. Create Hero Section
    const heroSecRes = await client.query(
      `
        INSERT INTO sections (page_id, name, sort_order)
        VALUES ($1, 'Hero Section', 0)
        RETURNING id;
      `,
      [pageId]
    );
    const heroSecId = heroSecRes.rows[0].id;
    await client.query(
      `
        INSERT INTO widgets (section_id, type, content, style)
        VALUES ($1, 'hero', $2, $3);
      `,
      [
        heroSecId,
        JSON.stringify({
          tagline: "CREATIVE DEVELOPER",
          title: "Designing immersive digital craft.",
          subtitle: "Specializing in high performance frontend, 3D WebGL, and custom GSAP interfaces.",
          showCta: true,
          ctaText: "Explore My Work",
          ctaLink: "#section-projects"
        }),
        JSON.stringify({
          paddingTop: "6rem",
          paddingBottom: "6rem",
          textColor: "#0c0c0c",
          backgroundColor: "#eae7e1",
          textAlign: "left"
        })
      ]
    );

    // 3. Create About Section
    const aboutSecRes = await client.query(
      `
        INSERT INTO sections (page_id, name, sort_order)
        VALUES ($1, 'About Section', 1)
        RETURNING id;
      `,
      [pageId]
    );
    const aboutSecId = aboutSecRes.rows[0].id;
    await client.query(
      `
        INSERT INTO widgets (section_id, type, content, style)
        VALUES ($1, 'text', $2, $3);
      `,
      [
        aboutSecId,
        JSON.stringify({
          header: "My Philosophy",
          body: "<p>I create premium digital interfaces that stand at the cross-section of layout design and software engineering. Clean architecture, robust APIs, and interactive visual aesthetics are the values I build upon.</p>"
        }),
        JSON.stringify({
          paddingTop: "4rem",
          paddingBottom: "4rem",
          textColor: "#0c0c0c",
          backgroundColor: "#ffffff",
          textAlign: "left"
        })
      ]
    );

    // 4. Create Projects Section
    const projSecRes = await client.query(
      `
        INSERT INTO sections (page_id, name, sort_order)
        VALUES ($1, 'Projects Section', 2)
        RETURNING id;
      `,
      [pageId]
    );
    const projSecId = projSecRes.rows[0].id;
    await client.query(
      `
        INSERT INTO widgets (section_id, type, content, style)
        VALUES ($1, 'project-grid', $2, $3);
      `,
      [
        projSecId,
        JSON.stringify({
          title: "Selected Works Showcase",
          projects: dbProjects
        }),
        JSON.stringify({
          paddingTop: "5rem",
          paddingBottom: "5rem",
          backgroundColor: "#111827",
          textColor: "#f3f4f6"
        })
      ]
    );

    // 5. Create Skills Section
    const skillSecRes = await client.query(
      `
        INSERT INTO sections (page_id, name, sort_order)
        VALUES ($1, 'Skills Section', 3)
        RETURNING id;
      `,
      [pageId]
    );
    const skillSecId = skillSecRes.rows[0].id;
    await client.query(
      `
        INSERT INTO widgets (section_id, type, content, style)
        VALUES ($1, 'skills-list', $2, $3);
      `,
      [
        skillSecId,
        JSON.stringify({
          title: "Technical Stack",
          groups: dbSkillGroups
        }),
        JSON.stringify({
          paddingTop: "4rem",
          paddingBottom: "4rem",
          backgroundColor: "#ffffff",
          textColor: "#1f2937"
        })
      ]
    );
  });
}

export async function ensurePortfolioSchema() {
  const existingPromise = getSchemaPromise();
  if (existingPromise) {
    await existingPromise;
    return;
  }

  const schemaWork = (async () => {
    for (const statement of SCHEMA_STATEMENTS) {
      await query(statement);
    }
    // Ensure role and permissions exist if users table was created previously
    await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'Admin';");
    await query("ALTER TABLE users ADD COLUMN IF NOT EXISTS permissions JSONB NOT NULL DEFAULT '[]';");
    // Ensure pages SEO columns exist
    await query("ALTER TABLE pages ADD COLUMN IF NOT EXISTS keywords TEXT;");
    await query("ALTER TABLE pages ADD COLUMN IF NOT EXISTS canonical_url TEXT;");
    await query("ALTER TABLE pages ADD COLUMN IF NOT EXISTS og_image TEXT;");
    await query("ALTER TABLE pages ADD COLUMN IF NOT EXISTS robots_meta TEXT;");
    await seedSkillsIfEmpty();
    await seedProjectsIfEmpty();
    await seedAchievementsIfEmpty();
    await seedUsersIfEmpty();
    await seedPageBuilderIfEmpty();
  })();

  setSchemaPromise(schemaWork);

  try {
    await schemaWork;
  } catch (error) {
    setSchemaPromise(null);
    throw error;
  }
}

export async function listSkills() {
  await ensurePortfolioSchema();
  const result = await query(
    `
      SELECT id, category, name, sort_order
      FROM skills
      ORDER BY category ASC, sort_order ASC, id ASC;
    `
  );
  return result.rows.map(mapSkill);
}

export async function listSkillGroups() {
  const skills = await listSkills();
  return groupSkillsByCategory(skills);
}

export async function createSkill(input) {
  await ensurePortfolioSchema();
  const sortOrder =
    toInteger(input.sortOrder, -1) >= 0
      ? toInteger(input.sortOrder, 0)
      : (await query("SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM skills;")).rows[0].next;

  const result = await query(
    `
      INSERT INTO skills (category, name, sort_order)
      VALUES ($1, $2, $3)
      RETURNING id, category, name, sort_order;
    `,
    [input.category, input.name, sortOrder]
  );
  return mapSkill(result.rows[0]);
}

export async function updateSkill(id, input) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      UPDATE skills
      SET category = $1,
          name = $2,
          sort_order = $3,
          updated_at = NOW()
      WHERE id = $4
      RETURNING id, category, name, sort_order;
    `,
    [input.category, input.name, toInteger(input.sortOrder, 0), id]
  );
  return result.rows[0] ? mapSkill(result.rows[0]) : null;
}

export async function deleteSkill(id) {
  await ensurePortfolioSchema();
  const result = await query("DELETE FROM skills WHERE id = $1;", [id]);
  return result.rowCount > 0;
}

export async function listProjects() {
  await ensurePortfolioSchema();
  const result = await query(
    `
      SELECT
        id, index_label, title, tech_stack, description, year_label,
        project_link, image_url, sort_order
      FROM projects
      ORDER BY sort_order ASC, id ASC;
    `
  );
  return result.rows.map(mapProject);
}

export async function createProject(input) {
  await ensurePortfolioSchema();
  const sortOrder =
    toInteger(input.sortOrder, -1) >= 0
      ? toInteger(input.sortOrder, 0)
      : (await query("SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM projects;")).rows[0].next;

  const result = await query(
    `
      INSERT INTO projects
        (index_label, title, tech_stack, description, year_label, project_link, image_url, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id, index_label, title, tech_stack, description, year_label,
        project_link, image_url, sort_order;
    `,
    [
      input.index,
      input.title,
      input.tech,
      input.desc,
      input.year,
      input.link,
      input.imageUrl,
      sortOrder,
    ]
  );
  return mapProject(result.rows[0]);
}

export async function updateProject(id, input) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      UPDATE projects
      SET index_label = $1,
          title = $2,
          tech_stack = $3,
          description = $4,
          year_label = $5,
          project_link = $6,
          image_url = $7,
          sort_order = $8,
          updated_at = NOW()
      WHERE id = $9
      RETURNING
        id, index_label, title, tech_stack, description, year_label,
        project_link, image_url, sort_order;
    `,
    [
      input.index,
      input.title,
      input.tech,
      input.desc,
      input.year,
      input.link,
      input.imageUrl,
      toInteger(input.sortOrder, 0),
      id,
    ]
  );
  return result.rows[0] ? mapProject(result.rows[0]) : null;
}

export async function deleteProject(id) {
  await ensurePortfolioSchema();
  const result = await query("DELETE FROM projects WHERE id = $1;", [id]);
  return result.rowCount > 0;
}

export async function listAchievements() {
  await ensurePortfolioSchema();
  const result = await query(
    `
      SELECT
        id, image_url, title, organizer, year_label, category,
        details, location, sort_order
      FROM achievements
      ORDER BY sort_order ASC, id ASC;
    `
  );
  return result.rows.map(mapAchievement);
}

export async function createAchievement(input) {
  await ensurePortfolioSchema();
  const sortOrder =
    toInteger(input.sortOrder, -1) >= 0
      ? toInteger(input.sortOrder, 0)
      : (await query("SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM achievements;")).rows[0].next;

  const result = await query(
    `
      INSERT INTO achievements
        (image_url, title, organizer, year_label, category, details, location, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id, image_url, title, organizer, year_label, category,
        details, location, sort_order;
    `,
    [
      input.imageUrl,
      input.title,
      input.organizer,
      input.year,
      input.category,
      input.details,
      input.location,
      sortOrder,
    ]
  );
  return mapAchievement(result.rows[0]);
}

export async function updateAchievement(id, input) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      UPDATE achievements
      SET image_url = $1,
          title = $2,
          organizer = $3,
          year_label = $4,
          category = $5,
          details = $6,
          location = $7,
          sort_order = $8,
          updated_at = NOW()
      WHERE id = $9
      RETURNING
        id, image_url, title, organizer, year_label, category,
        details, location, sort_order;
    `,
    [
      input.imageUrl,
      input.title,
      input.organizer,
      input.year,
      input.category,
      input.details,
      input.location,
      toInteger(input.sortOrder, 0),
      id,
    ]
  );
  return result.rows[0] ? mapAchievement(result.rows[0]) : null;
}

export async function deleteAchievement(id) {
  await ensurePortfolioSchema();
  const result = await query("DELETE FROM achievements WHERE id = $1;", [id]);
  return result.rowCount > 0;
}

export async function createContactMessage(input) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      INSERT INTO contact_messages (name, email, message)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, message, created_at;
    `,
    [input.name, input.email, input.message]
  );
  return mapMessage(result.rows[0]);
}

export async function listContactMessages() {
  await ensurePortfolioSchema();
  const result = await query(
    `
      SELECT id, name, email, message, created_at
      FROM contact_messages
      ORDER BY created_at DESC, id DESC;
    `
  );
  return result.rows.map(mapMessage);
}

export async function deleteContactMessage(id) {
  await ensurePortfolioSchema();
  const result = await query("DELETE FROM contact_messages WHERE id = $1;", [id]);
  return result.rowCount > 0;
}

export async function getDashboardStats() {
  await ensurePortfolioSchema();
  const [
    projectsCount,
    skillsCount,
    achievementsCount,
    messagesCount,
    totalPages,
    publishedPages,
    draftPages,
    totalWidgets
  ] = await Promise.all([
    query("SELECT COUNT(*)::int AS count FROM projects;"),
    query("SELECT COUNT(*)::int AS count FROM skills;"),
    query("SELECT COUNT(*)::int AS count FROM achievements;"),
    query("SELECT COUNT(*)::int AS count FROM contact_messages;"),
    query("SELECT COUNT(*)::int AS count FROM pages;"),
    query("SELECT COUNT(*)::int AS count FROM pages WHERE status = 'published';"),
    query("SELECT COUNT(*)::int AS count FROM pages WHERE status = 'draft';"),
    query("SELECT COUNT(*)::int AS count FROM widgets;"),
  ]);

  return {
    projects: projectsCount.rows[0].count,
    skills: skillsCount.rows[0].count,
    achievements: achievementsCount.rows[0].count,
    messages: messagesCount.rows[0].count,
    totalPages: totalPages.rows[0].count,
    publishedPages: publishedPages.rows[0].count,
    draftPages: draftPages.rows[0].count,
    totalWidgets: totalWidgets.rows[0].count,
  };
}

export async function findUserByUsername(username) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      SELECT id, username, password_hash
      FROM users
      WHERE username = $1;
    `,
    [username]
  );
  return result.rows[0] || null;
}

export async function trackMediaAsset(data) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      INSERT INTO media_assets (file_name, public_url, file_type, file_size, content)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, file_name, public_url;
    `,
    [data.fileName, data.publicUrl, data.fileType, data.fileSize, data.content]
  );
  return result.rows[0];
}

// Global Settings CRUD
export async function getGlobalSettings() {
  await ensurePortfolioSchema();
  const result = await query("SELECT key, value FROM global_settings;");
  const settings = {};
  for (const row of result.rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

export async function updateGlobalSettings(settings) {
  await ensurePortfolioSchema();
  await withTransaction(async (client) => {
    for (const [key, val] of Object.entries(settings)) {
      await client.query(
        `
          INSERT INTO global_settings (key, value)
          VALUES ($1, $2)
          ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
        `,
        [key, JSON.stringify(val)]
      );
    }
  });
  return getGlobalSettings();
}

// Pages CRUD
export async function listPages() {
  await ensurePortfolioSchema();
  const result = await query(
    `
      SELECT id, slug, title, status, parent_id as "parentId", sort_order as "sortOrder", is_folder as "isFolder", meta_title as "metaTitle", meta_description as "metaDescription", keywords, canonical_url as "canonicalUrl", og_image as "ogImage", robots_meta as "robotsMeta"
      FROM pages
      ORDER BY parent_id ASC, sort_order ASC, id ASC;
    `
  );
  return result.rows;
}

export async function findPageBySlug(slug) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      SELECT id, slug, title, status, parent_id as "parentId", sort_order as "sortOrder", is_folder as "isFolder", meta_title as "metaTitle", meta_description as "metaDescription", keywords, canonical_url as "canonicalUrl", og_image as "ogImage", robots_meta as "robotsMeta"
      FROM pages
      WHERE slug = $1;
    `,
    [slug]
  );
  return result.rows[0] || null;
}

export async function createPage(input) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      INSERT INTO pages (slug, title, status, parent_id, sort_order, is_folder, meta_title, meta_description, keywords, canonical_url, og_image, robots_meta)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, slug, title, status, parent_id as "parentId", sort_order as "sortOrder", is_folder as "isFolder", meta_title as "metaTitle", meta_description as "metaDescription", keywords, canonical_url as "canonicalUrl", og_image as "ogImage", robots_meta as "robotsMeta";
    `,
    [
      input.slug,
      input.title,
      input.status || "draft",
      input.parentId || null,
      toInteger(input.sortOrder, 0),
      input.isFolder || false,
      input.metaTitle || "",
      input.metaDescription || "",
      input.keywords || "",
      input.canonicalUrl || "",
      input.ogImage || "",
      input.robotsMeta || ""
    ]
  );
  return result.rows[0];
}

export async function updatePage(id, input) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      UPDATE pages
      SET slug = $1,
          title = $2,
          status = $3,
          parent_id = $4,
          sort_order = $5,
          is_folder = $6,
          meta_title = $7,
          meta_description = $8,
          keywords = $9,
          canonical_url = $10,
          og_image = $11,
          robots_meta = $12,
          updated_at = NOW()
      WHERE id = $13
      RETURNING id, slug, title, status, parent_id as "parentId", sort_order as "sortOrder", is_folder as "isFolder", meta_title as "metaTitle", meta_description as "metaDescription", keywords, canonical_url as "canonicalUrl", og_image as "ogImage", robots_meta as "robotsMeta";
    `,
    [
      input.slug,
      input.title,
      input.status,
      input.parentId || null,
      toInteger(input.sortOrder, 0),
      input.isFolder || false,
      input.metaTitle || "",
      input.metaDescription || "",
      input.keywords || "",
      input.canonicalUrl || "",
      input.ogImage || "",
      input.robotsMeta || "",
      id,
    ]
  );
  return result.rows[0] || null;
}

export async function deletePage(id) {
  await ensurePortfolioSchema();
  const result = await query("DELETE FROM pages WHERE id = $1;", [id]);
  return result.rowCount > 0;
}

// Sections CRUD
export async function listSections(pageId) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      SELECT id, page_id as "pageId", name, sort_order as "sortOrder", is_hidden as "isHidden", is_locked as "isLocked", is_global as "isGlobal", template_name as "templateName"
      FROM sections
      WHERE page_id = $1
      ORDER BY sort_order ASC, id ASC;
    `,
    [pageId]
  );
  return result.rows;
}

export async function createSection(input) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      INSERT INTO sections (page_id, name, sort_order, is_hidden, is_locked, is_global, template_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, page_id as "pageId", name, sort_order as "sortOrder", is_hidden as "isHidden", is_locked as "isLocked", is_global as "isGlobal", template_name as "templateName";
    `,
    [
      input.pageId,
      input.name,
      toInteger(input.sortOrder, 0),
      input.isHidden || false,
      input.isLocked || false,
      input.isGlobal || false,
      input.templateName || null,
    ]
  );
  return result.rows[0];
}

export async function updateSection(id, input) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      UPDATE sections
      SET name = $1,
          sort_order = $2,
          is_hidden = $3,
          is_locked = $4,
          is_global = $5,
          template_name = $6,
          updated_at = NOW()
      WHERE id = $7
      RETURNING id, page_id as "pageId", name, sort_order as "sortOrder", is_hidden as "isHidden", is_locked as "isLocked", is_global as "isGlobal", template_name as "templateName";
    `,
    [
      input.name,
      toInteger(input.sortOrder, 0),
      input.isHidden || false,
      input.isLocked || false,
      input.isGlobal || false,
      input.templateName || null,
      id,
    ]
  );
  return result.rows[0] || null;
}

export async function deleteSection(id) {
  await ensurePortfolioSchema();
  const result = await query("DELETE FROM sections WHERE id = $1;", [id]);
  return result.rowCount > 0;
}

// Widgets CRUD
export async function listWidgets(sectionId) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      SELECT id, section_id as "sectionId", type, content, style, layout, animation, visibility, sort_order as "sortOrder"
      FROM widgets
      WHERE section_id = $1
      ORDER BY sort_order ASC, id ASC;
    `,
    [sectionId]
  );
  return result.rows;
}

export async function createWidget(input) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      INSERT INTO widgets (section_id, type, content, style, layout, animation, visibility, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, section_id as "sectionId", type, content, style, layout, animation, visibility, sort_order as "sortOrder";
    `,
    [
      input.sectionId,
      input.type,
      JSON.stringify(input.content || {}),
      JSON.stringify(input.style || {}),
      JSON.stringify(input.layout || {}),
      JSON.stringify(input.animation || {}),
      JSON.stringify(input.visibility || {}),
      toInteger(input.sortOrder, 0),
    ]
  );
  return result.rows[0];
}

export async function updateWidget(id, input) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      UPDATE widgets
      SET type = $1,
          content = $2,
          style = $3,
          layout = $4,
          animation = $5,
          visibility = $6,
          sort_order = $7,
          updated_at = NOW()
      WHERE id = $8
      RETURNING id, section_id as "sectionId", type, content, style, layout, animation, visibility, sort_order as "sortOrder";
    `,
    [
      input.type,
      JSON.stringify(input.content || {}),
      JSON.stringify(input.style || {}),
      JSON.stringify(input.layout || {}),
      JSON.stringify(input.animation || {}),
      JSON.stringify(input.visibility || {}),
      toInteger(input.sortOrder, 0),
      id,
    ]
  );
  return result.rows[0] || null;
}

export async function deleteWidget(id) {
  await ensurePortfolioSchema();
  const result = await query("DELETE FROM widgets WHERE id = $1;", [id]);
  return result.rowCount > 0;
}

// Full page composition helper
export async function getPageComposition(slug) {
  await ensurePortfolioSchema();
  const page = await findPageBySlug(slug);
  if (!page) return null;

  const sections = await listSections(page.id);
  const sectionsWithWidgets = await Promise.all(
    sections.map(async (sec) => {
      const widgets = await listWidgets(sec.id);
      return { ...sec, widgets };
    })
  );

  return {
    page,
    sections: sectionsWithWidgets,
  };
}

// Menus CRUD
export async function listMenus() {
  await ensurePortfolioSchema();
  const result = await query("SELECT id, name, location FROM menus ORDER BY id ASC;");
  return result.rows;
}

export async function createMenu(input) {
  await ensurePortfolioSchema();
  const result = await query(
    "INSERT INTO menus (name, location) VALUES ($1, $2) RETURNING id, name, location;",
    [input.name, input.location || ""]
  );
  return result.rows[0];
}

export async function deleteMenu(id) {
  await ensurePortfolioSchema();
  const result = await query("DELETE FROM menus WHERE id = $1;", [id]);
  return result.rowCount > 0;
}

// Menu Items CRUD
export async function listMenuItems(menuId) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      SELECT id, menu_id as "menuId", label, url, parent_id as "parentId", sort_order as "sortOrder", badge_text as "badgeText", icon
      FROM menu_items
      WHERE menu_id = $1
      ORDER BY parent_id ASC, sort_order ASC, id ASC;
    `,
    [menuId]
  );
  return result.rows;
}

export async function createMenuItem(input) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      INSERT INTO menu_items (menu_id, label, url, parent_id, sort_order, badge_text, icon)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, menu_id as "menuId", label, url, parent_id as "parentId", sort_order as "sortOrder", badge_text as "badgeText", icon;
    `,
    [
      input.menuId,
      input.label,
      input.url,
      input.parentId || null,
      toInteger(input.sortOrder, 0),
      input.badgeText || "",
      input.icon || ""
    ]
  );
  return result.rows[0];
}

export async function updateMenuItem(id, input) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      UPDATE menu_items
      SET label = $1,
          url = $2,
          parent_id = $3,
          sort_order = $4,
          badge_text = $5,
          icon = $6
      WHERE id = $7
      RETURNING id, menu_id as "menuId", label, url, parent_id as "parentId", sort_order as "sortOrder", badge_text as "badgeText", icon;
    `,
    [
      input.label,
      input.url,
      input.parentId || null,
      toInteger(input.sortOrder, 0),
      input.badgeText || "",
      input.icon || "",
      id
    ]
  );
  return result.rows[0] || null;
}

export async function deleteMenuItem(id) {
  await ensurePortfolioSchema();
  const result = await query("DELETE FROM menu_items WHERE id = $1;", [id]);
  return result.rowCount > 0;
}

// Tree structure helper for menu renderers
export async function getMenuStructure(menuLocation) {
  await ensurePortfolioSchema();
  const menuRes = await query("SELECT id, name, location FROM menus WHERE location = $1 LIMIT 1;", [menuLocation]);
  if (menuRes.rows.length === 0) return [];

  const menu = menuRes.rows[0];
  const items = await listMenuItems(menu.id);

  // Parse hierarchy
  const itemsMap = {};
  const rootItems = [];

  for (const item of items) {
    itemsMap[item.id] = { ...item, children: [] };
  }

  for (const item of items) {
    const mapped = itemsMap[item.id];
    if (item.parentId) {
      if (itemsMap[item.parentId]) {
        itemsMap[item.parentId].children.push(mapped);
      }
    } else {
      rootItems.push(mapped);
    }
  }

  return rootItems;
}

// Media Assets CRUD extensions
export async function listMediaAssets() {
  await ensurePortfolioSchema();
  const result = await query(
    `
      SELECT id, file_name as "fileName", public_url as "publicUrl", file_type as "fileType", file_size as "fileSize", created_at as "createdAt"
      FROM media_assets
      ORDER BY created_at DESC;
    `
  );
  return result.rows;
}

export async function deleteMediaAsset(id) {
  await ensurePortfolioSchema();
  const result = await query("DELETE FROM media_assets WHERE id = $1;", [id]);
  return result.rowCount > 0;
}

// Revisions and Version Control
export async function createPageRevision(pageId, composition, comment = "") {
  await ensurePortfolioSchema();
  const result = await query(
    `
      INSERT INTO page_revisions (page_id, composition, comment)
      VALUES ($1, $2, $3)
      RETURNING id, page_id as "pageId", created_at as "createdAt", comment;
    `,
    [pageId, JSON.stringify(composition), comment]
  );
  return result.rows[0];
}

export async function listPageRevisions(pageId) {
  await ensurePortfolioSchema();
  const result = await query(
    `
      SELECT id, page_id as "pageId", composition, created_at as "createdAt", comment
      FROM page_revisions
      WHERE page_id = $1
      ORDER BY created_at DESC;
    `,
    [pageId]
  );
  return result.rows;
}

// Audit Logs
export async function logAuditEvent(action, targetType, targetId = "") {
  await ensurePortfolioSchema();
  const result = await query(
    `
      INSERT INTO audit_logs (action, target_type, target_id)
      VALUES ($1, $2, $3)
      RETURNING id, action, target_type as "targetType", target_id as "targetId", created_at as "createdAt";
    `,
    [action, targetType, String(targetId)]
  );
  return result.rows[0];
}

export async function listAuditLogs() {
  await ensurePortfolioSchema();
  const result = await query(
    `
      SELECT id, action, target_type as "targetType", target_id as "targetId", created_at as "createdAt"
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 100;
    `
  );
  return result.rows;
}



