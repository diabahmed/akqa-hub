import { sql } from 'drizzle-orm';

import { db } from './index';

async function setupVectorExtension() {
  try {
    console.log('🔧 Setting up pgvector extension...');

    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector`);

    console.log('✅ pgvector extension enabled');

    // Verify installation
    const result = await db.execute(sql`
      SELECT extname, extversion 
      FROM pg_extension 
      WHERE extname = 'vector'
    `);

    console.log('📦 Extension info:', result.rows[0]);
  } catch (error) {
    console.error('❌ Error setting up pgvector:', error);
    throw error;
  }
}

setupVectorExtension()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
