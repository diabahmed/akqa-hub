import { and, cosineDistance, desc, eq, gt, sql } from 'drizzle-orm';

import { db } from '@src/db';
import {
  blogEmbeddings,
  type BlogEmbedding,
  type NewBlogEmbedding,
} from '@src/db/schema/blog-embeddings';

/**
 * Insert a single blog embedding chunk
 */
export async function insertBlogEmbedding(data: NewBlogEmbedding): Promise<BlogEmbedding> {
  const [result] = await db.insert(blogEmbeddings).values(data).returning();
  return result;
}

/**
 * Insert multiple blog embedding chunks in a transaction
 */
export async function insertBlogEmbeddingBatch(data: NewBlogEmbedding[]): Promise<BlogEmbedding[]> {
  if (data.length === 0) return [];

  return await db.insert(blogEmbeddings).values(data).returning();
}

/**
 * Delete all chunks for a specific blog post
 */
export async function deleteBlogEmbeddingsByContentfulId(contentfulId: string): Promise<void> {
  await db.delete(blogEmbeddings).where(eq(blogEmbeddings.contentfulId, contentfulId));
}

/**
 * Delete all chunks for a specific blog post and locale
 */
export async function deleteBlogEmbeddingsByContentfulIdAndLocale(
  contentfulId: string,
  locale: string,
): Promise<void> {
  await db
    .delete(blogEmbeddings)
    .where(and(eq(blogEmbeddings.contentfulId, contentfulId), eq(blogEmbeddings.locale, locale)));
}

/**
 * Upsert blog embeddings (delete old chunks for this locale, insert new ones)
 */
export async function upsertBlogEmbeddings(
  contentfulId: string,
  locale: string,
  chunks: NewBlogEmbedding[],
): Promise<BlogEmbedding[]> {
  // Delete existing chunks for this article AND locale
  await deleteBlogEmbeddingsByContentfulIdAndLocale(contentfulId, locale);

  // Insert new chunks
  return await insertBlogEmbeddingBatch(chunks);
}

/**
 * Semantic search using cosine similarity
 * Returns chunks ranked by similarity
 */
export interface SearchResult extends BlogEmbedding {
  similarity: number;
}

export async function semanticSearch(
  queryEmbedding: number[],
  options: {
    limit?: number;
    threshold?: number;
    locale?: string;
    excludeSlugs?: string[];
  } = {},
): Promise<SearchResult[]> {
  const { limit = 3, threshold = 0.5, locale, excludeSlugs = [] } = options;

  // Calculate similarity using Drizzle's cosineDistance helper
  // IMPORTANT: Parentheses around cosineDistance() to ensure correct operator precedence
  // Formula: similarity = 1 - (cosine_distance)
  const similarity = sql<number>`1 - (${cosineDistance(blogEmbeddings.embedding, queryEmbedding)})`;

  // Build WHERE conditions using Drizzle operators
  // Use gt() helper to ensure proper SQL generation with correct precedence
  const conditions = [gt(similarity, threshold)];

  if (locale) {
    conditions.push(eq(blogEmbeddings.locale, locale));
  }

  if (excludeSlugs.length > 0) {
    conditions.push(
      sql`${blogEmbeddings.slug} NOT IN (${sql.join(
        excludeSlugs.map(s => sql`${s}`),
        sql`, `,
      )})`,
    );
  } // Execute query using Drizzle query builder
  const results = await db
    .select({
      id: blogEmbeddings.id,
      contentfulId: blogEmbeddings.contentfulId,
      slug: blogEmbeddings.slug,
      locale: blogEmbeddings.locale,
      title: blogEmbeddings.title,
      shortDescription: blogEmbeddings.shortDescription,
      authorName: blogEmbeddings.authorName,
      publishedDate: blogEmbeddings.publishedDate,
      chunkContent: blogEmbeddings.chunkContent,
      chunkIndex: blogEmbeddings.chunkIndex,
      totalChunks: blogEmbeddings.totalChunks,
      embedding: blogEmbeddings.embedding,
      tags: blogEmbeddings.tags,
      lastSyncedAt: blogEmbeddings.lastSyncedAt,
      createdAt: blogEmbeddings.createdAt,
      updatedAt: blogEmbeddings.updatedAt,
      similarity,
    })
    .from(blogEmbeddings)
    .where(and(...conditions))
    .orderBy(desc(similarity))
    .limit(limit);

  return results as SearchResult[];
}

/**
 * Get all chunks for a specific blog post
 */
export async function getBlogEmbeddingsBySlug(
  slug: string,
  locale: string = 'en-US',
): Promise<BlogEmbedding[]> {
  return await db
    .select()
    .from(blogEmbeddings)
    .where(and(eq(blogEmbeddings.slug, slug), eq(blogEmbeddings.locale, locale)))
    .orderBy(blogEmbeddings.chunkIndex);
}

/**
 * Get a specific chunk by slug and chunk index
 */
export async function getBlogEmbeddingChunk(
  slug: string,
  chunkIndex: number,
  locale: string = 'en-US',
): Promise<BlogEmbedding | null> {
  const [result] = await db
    .select()
    .from(blogEmbeddings)
    .where(
      and(
        eq(blogEmbeddings.slug, slug),
        eq(blogEmbeddings.chunkIndex, chunkIndex),
        eq(blogEmbeddings.locale, locale),
      ),
    )
    .limit(1);

  return result || null;
}

/**
 * Get all unique contentful IDs (for sync comparison)
 */
export async function getAllContentfulIds(): Promise<string[]> {
  const results = await db
    .selectDistinct({ contentfulId: blogEmbeddings.contentfulId })
    .from(blogEmbeddings);

  return results.map(r => r.contentfulId);
}

/**
 * Group search results by article (aggregate chunk scores)
 * Returns top articles with their best matching chunks
 */
export interface ArticleSearchResult {
  slug: string;
  locale: string;
  title: string;
  shortDescription: string | null;
  authorName: string | null;
  publishedDate: Date | null;
  maxSimilarity: number; // Highest chunk similarity
  avgSimilarity: number; // Average of all chunk similarities
  matchingChunks: Array<{
    content: string;
    chunkIndex: number;
    similarity: number;
  }>;
}

export function groupChunksByArticle(chunks: SearchResult[]): ArticleSearchResult[] {
  const articleMap = new Map<string, SearchResult[]>();

  // Group chunks by slug
  for (const chunk of chunks) {
    if (!articleMap.has(chunk.slug)) {
      articleMap.set(chunk.slug, []);
    }
    articleMap.get(chunk.slug)!.push(chunk);
  }

  // Create article results
  const results: ArticleSearchResult[] = [];

  for (const [slug, articleChunks] of articleMap.entries()) {
    const similarities = articleChunks.map(c => c.similarity);
    const maxSimilarity = Math.max(...similarities);
    const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;

    // Use data from first chunk (they all have same metadata)
    const firstChunk = articleChunks[0];

    results.push({
      slug,
      locale: firstChunk.locale,
      title: firstChunk.title,
      shortDescription: firstChunk.shortDescription,
      authorName: firstChunk.authorName,
      publishedDate: firstChunk.publishedDate,
      maxSimilarity,
      avgSimilarity,
      matchingChunks: articleChunks
        .sort((a, b) => b.similarity - a.similarity)
        .map(c => ({
          content: c.chunkContent,
          chunkIndex: c.chunkIndex,
          similarity: c.similarity,
        })),
    });
  }

  // Sort by max similarity (best matching chunk per article)
  return results.sort((a, b) => b.maxSimilarity - a.maxSimilarity);
}
