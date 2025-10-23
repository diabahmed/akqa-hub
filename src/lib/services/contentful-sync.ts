import { extractPlainTextFromRichText } from './contentful-parser';
import { generateBlogEmbeddings } from './embeddings';
import {
  deleteBlogEmbeddingsByContentfulId,
  getAllContentfulIds,
  upsertBlogEmbeddings,
} from './vector-db';

import type { NewBlogEmbedding } from '@src/db/schema/blog-embeddings';
import { client } from '@src/lib/client';

/**
 * Sync a single blog post to vector database by Contentful ID
 * Used by webhooks when content is updated
 */
export async function syncBlogPostToVectorDB(
  contentfulId: string,
  locale: string = 'en-US',
): Promise<void> {
  try {
    // First, fetch the blog post collection to find the slug for this ID
    const { pageBlogPostCollection } = await client.pageBlogPostCollection({
      locale,
      limit: 100,
    });

    const blogPost = pageBlogPostCollection?.items.find(post => post?.sys.id === contentfulId);

    if (!blogPost || !blogPost.slug) {
      throw new Error(`Blog post not found with ID: ${contentfulId}`);
    }

    // Use the existing syncBlogPost function with the slug
    await syncBlogPost(blogPost.slug, locale);

    console.log(`✅ Webhook sync completed for blog post ID: ${contentfulId}`);
  } catch (error) {
    console.error(`❌ Error syncing blog post ${contentfulId}:`, error);
    throw error;
  }
}

/**
 * Sync a single blog post to vector database by slug
 */
export async function syncBlogPost(slug: string, locale: string = 'en-US'): Promise<void> {
  try {
    const { pageBlogPostCollection } = await client.pageBlogPost({
      slug,
      locale,
    });

    const blogPost = pageBlogPostCollection?.items[0];

    if (!blogPost) {
      throw new Error(`Blog post not found: ${slug}`);
    }

    // Extract plain text from rich text content
    const plainTextContent = blogPost.content?.json
      ? extractPlainTextFromRichText(blogPost.content.json as any)
      : '';

    if (!plainTextContent || plainTextContent.trim().length === 0) {
      console.warn(`⚠️  No content found for blog post: ${slug}`);
      return;
    }

    // Generate embeddings with chunking
    const embeddingChunks = await generateBlogEmbeddings({
      title: blogPost.title || '',
      shortDescription: blogPost.shortDescription || undefined,
      content: plainTextContent,
      authorName: blogPost.author?.name || undefined,
    });

    // Extract tags from Contentful metadata (if available)
    const tags: string[] = [];

    // Prepare database records for all chunks
    const chunkRecords: NewBlogEmbedding[] = embeddingChunks.map(chunk => ({
      contentfulId: blogPost.sys.id,
      slug: blogPost.slug || '',
      locale,
      title: blogPost.title || '',
      shortDescription: blogPost.shortDescription || null,
      authorName: blogPost.author?.name || null,
      publishedDate: blogPost.publishedDate ? new Date(blogPost.publishedDate) : null,
      chunkContent: chunk.content,
      chunkIndex: chunk.metadata.chunkIndex,
      totalChunks: chunk.metadata.totalChunks,
      embedding: chunk.embedding as any, // Drizzle vector type
      tags: tags as string[],
      lastSyncedAt: new Date(),
    }));

    // Upsert all chunks (delete old for this locale, insert new)
    await upsertBlogEmbeddings(blogPost.sys.id, locale, chunkRecords);

    console.log(
      `✅ Synced blog post: ${blogPost.title} (${slug}) - ${embeddingChunks.length} chunks`,
    );
  } catch (error) {
    console.error(`❌ Error syncing blog post ${slug}:`, error);
    throw error;
  }
}

/**
 * Sync all blog posts from Contentful
 */
export async function syncAllBlogPosts(
  locale: string = 'en-US',
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  try {
    // Fetch all blog posts
    const { pageBlogPostCollection } = await client.pageBlogPostCollection({
      locale,
      limit: 100, // Adjust based on your content volume
    });

    const blogPosts = pageBlogPostCollection?.items || [];

    console.log(`🔄 Syncing ${blogPosts.length} blog posts for locale ${locale}...`);

    for (const blogPost of blogPosts) {
      if (!blogPost?.slug) continue;

      try {
        await syncBlogPost(blogPost.slug, locale);
        success++;
      } catch (error) {
        console.error(`Failed to sync ${blogPost.slug}:`, error);
        failed++;
      }
    }

    // Clean up deleted posts
    const currentIds = blogPosts.map(p => p?.sys.id).filter(Boolean) as string[];
    const storedIds = await getAllContentfulIds();
    const deletedIds = storedIds.filter(id => !currentIds.includes(id));

    for (const id of deletedIds) {
      await deleteBlogEmbeddingsByContentfulId(id);
      console.log(`🗑️  Deleted embeddings for removed post: ${id}`);
    }

    console.log(`✅ Sync complete for ${locale}: ${success} succeeded, ${failed} failed`);

    return { success, failed };
  } catch (error) {
    console.error(`❌ Error during full sync for ${locale}:`, error);
    throw error;
  }
}
