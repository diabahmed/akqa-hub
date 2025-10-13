'use server';

import { count, eq, sql } from 'drizzle-orm';

import { db } from '@src/db';
import { blogEmbeddings } from '@src/db/schema/blog-embeddings';

/**
 * Get sync status and statistics for the vector database
 */
export async function getSyncStatusAction() {
  try {
    // Total chunks
    const totalChunks = await db.select({ count: count() }).from(blogEmbeddings);

    // Unique articles (by contentfulId)
    const uniqueArticles = await db
      .select({ count: sql<number>`count(distinct ${blogEmbeddings.contentfulId})` })
      .from(blogEmbeddings);

    // By locale
    const byLocale = await db
      .select({
        locale: blogEmbeddings.locale,
        count: count(),
      })
      .from(blogEmbeddings)
      .groupBy(blogEmbeddings.locale);

    // Recent syncs (last 10 articles)
    const recentSyncs = await db
      .select({
        title: blogEmbeddings.title,
        slug: blogEmbeddings.slug,
        locale: blogEmbeddings.locale,
        lastSyncedAt: blogEmbeddings.lastSyncedAt,
        totalChunks: sql<number>`max(${blogEmbeddings.totalChunks})`,
      })
      .from(blogEmbeddings)
      .groupBy(
        blogEmbeddings.contentfulId,
        blogEmbeddings.title,
        blogEmbeddings.slug,
        blogEmbeddings.locale,
        blogEmbeddings.lastSyncedAt,
      )
      .orderBy(sql`${blogEmbeddings.lastSyncedAt} desc`)
      .limit(10);

    return {
      success: true,
      stats: {
        totalChunks: totalChunks[0]?.count || 0,
        uniqueArticles: uniqueArticles[0]?.count || 0,
        byLocale: byLocale.map(item => ({
          locale: item.locale,
          chunks: item.count,
        })),
        recentSyncs: recentSyncs.map(item => ({
          title: item.title,
          slug: item.slug,
          locale: item.locale,
          lastSyncedAt: item.lastSyncedAt,
          chunks: item.totalChunks,
        })),
      },
    };
  } catch (error) {
    console.error('Error getting sync status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get list of all synced articles with their chunk counts
 */
export async function getAllSyncedArticlesAction(locale?: string) {
  try {
    const conditions = locale ? [eq(blogEmbeddings.locale, locale)] : [];

    const articles = await db
      .select({
        contentfulId: blogEmbeddings.contentfulId,
        title: blogEmbeddings.title,
        slug: blogEmbeddings.slug,
        locale: blogEmbeddings.locale,
        authorName: blogEmbeddings.authorName,
        publishedDate: blogEmbeddings.publishedDate,
        lastSyncedAt: blogEmbeddings.lastSyncedAt,
        totalChunks: sql<number>`max(${blogEmbeddings.totalChunks})`,
        chunkCount: count(),
      })
      .from(blogEmbeddings)
      .where(conditions.length > 0 ? sql`${conditions[0]}` : undefined)
      .groupBy(
        blogEmbeddings.contentfulId,
        blogEmbeddings.title,
        blogEmbeddings.slug,
        blogEmbeddings.locale,
        blogEmbeddings.authorName,
        blogEmbeddings.publishedDate,
        blogEmbeddings.lastSyncedAt,
      )
      .orderBy(sql`${blogEmbeddings.lastSyncedAt} desc`);

    return {
      success: true,
      articles: articles.map(article => ({
        contentfulId: article.contentfulId,
        title: article.title,
        slug: article.slug,
        locale: article.locale,
        authorName: article.authorName,
        publishedDate: article.publishedDate,
        lastSyncedAt: article.lastSyncedAt,
        totalChunks: article.totalChunks,
        chunkCount: article.chunkCount,
      })),
    };
  } catch (error) {
    console.error('Error getting synced articles:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
