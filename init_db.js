import { getDashboardStats } from './src/lib/portfolioRepository.js';

process.env.DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/portfolio';
process.env.POSTGRES_SSL = 'false';

async function test() {
  try {
    console.log('Testing database initialization...');
    const stats = await getDashboardStats();
    console.log('Stats:', stats);
    console.log('Database initialized and seeded successfully!');
  } catch (err) {
    console.error('Initialization failed:', err);
    process.exit(1);
  }
}

test();
