import { sql } from 'drizzle-orm';
import { index, integer, pgTable, text, timestamp, varchar, vector } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { nanoid } from '@src/lib/utils';

export const blogEmbeddings = pgTable(
  'blog_embeddings',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),

    // Contentful references
    contentfulId: varchar('contentful_id', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    locale: varchar('locale', { length: 10 }).notNull().default('en-US'),

    // Content fields
    title: text('title').notNull(),
    shortDescription: text('short_description'),
    authorName: varchar('author_name', { length: 255 }),
    publishedDate: timestamp('published_date'),

    // Chunk information
    chunkContent: text('chunk_content').notNull(), // The actual chunk text
    chunkIndex: integer('chunk_index').notNull(), // 0-based index
    totalChunks: integer('total_chunks').notNull(), // Total chunks for this article

    // Vector embedding (1536 dimensions for OpenAI text-embedding-3-small)
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),

    // Metadata for filtering
    tags: text('tags').array(), // Contentful tags

    // Timestamps
    lastSyncedAt: timestamp('last_synced_at')
      .notNull()
      .default(sql`now()`),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at')
      .notNull()
      .default(sql`now()`),
  },
  table => ({
    // Index for cosine similarity search
    embeddingIdx: index('embedding_idx').using('hnsw', table.embedding.op('vector_cosine_ops')),
    slugIdx: index('slug_idx').on(table.slug),
    contentfulIdIdx: index('contentful_id_idx').on(table.contentfulId),
    localeIdx: index('locale_idx').on(table.locale),
    chunkIdx: index('chunk_idx').on(table.contentfulId, table.chunkIndex),
  }),
);

// Schema for blog embeddings - used to validate API requests
export const insertBlogEmbeddingSchema = createSelectSchema(blogEmbeddings).extend({}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type for blog embeddings
export type BlogEmbedding = typeof blogEmbeddings.$inferSelect;
export type NewBlogEmbedding = z.infer<typeof insertBlogEmbeddingSchema>;
