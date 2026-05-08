import { DEFAULT_ACHIEVEMENTS, DEFAULT_PROJECTS, DEFAULT_SKILL_GROUPS, flattenSkillGroups, groupSkillsByCategory } from "@/lib/portfolioData";
import { getSchemaPromise, query, setSchemaPromise, withTransaction } from "@/lib/postgres";

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
    ["admin", "$2b$10$sEY6nu2kBo.vPk0fFiW.NuVbh86dDkEr4kWzHr0/RDX6ZvIwriAhi"]
  );
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
    await seedSkillsIfEmpty();
    await seedProjectsIfEmpty();
    await seedAchievementsIfEmpty();
    await seedUsersIfEmpty();
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
  const [projectsCount, skillsCount, achievementsCount, messagesCount] = await Promise.all([
    query("SELECT COUNT(*)::int AS count FROM projects;"),
    query("SELECT COUNT(*)::int AS count FROM skills;"),
    query("SELECT COUNT(*)::int AS count FROM achievements;"),
    query("SELECT COUNT(*)::int AS count FROM contact_messages;"),
  ]);

  return {
    projects: projectsCount.rows[0].count,
    skills: skillsCount.rows[0].count,
    achievements: achievementsCount.rows[0].count,
    messages: messagesCount.rows[0].count,
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


