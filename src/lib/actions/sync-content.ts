'use server';

import { extractPlainTextFromRichText } from '../services/contentful-parser';
import { generateBlogEmbeddings } from '../services/embeddings';
import {
  deleteBlogEmbeddingsByContentfulId,
  getAllContentfulIds,
  upsertBlogEmbeddings,
} from '../services/vector-db';

import type { NewBlogEmbedding } from '@src/db/schema/blog-embeddings';
import { client } from '@src/lib/client';

/**
 * Server Action: Sync a single blog post to vector database
 */
export async function syncBlogPostAction(slug: string, locale: string = 'en-US') {
  try {
    const { pageBlogPostCollection } = await client.pageBlogPost({
      slug,
      locale,
    });

    const blogPost = pageBlogPostCollection?.items[0];

    if (!blogPost) {
      return {
        success: false,
        error: `Blog post not found: ${slug}`,
      };
    }

    // Extract plain text from rich text content
    const plainTextContent = blogPost.content?.json
      ? extractPlainTextFromRichText(blogPost.content.json as any)
      : '';

    if (!plainTextContent || plainTextContent.trim().length === 0) {
      return {
        success: false,
        error: `No content found for blog post: ${slug}`,
      };
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

    // Upsert all chunks (delete old, insert new) for this locale only
    await upsertBlogEmbeddings(blogPost.sys.id, locale, chunkRecords);

    return {
      success: true,
      message: `Synced blog post: ${blogPost.title} (${slug}) - ${embeddingChunks.length} chunks`,
      chunksCount: embeddingChunks.length,
    };
  } catch (error) {
    console.error(`Error syncing blog post ${slug}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Server Action: Sync all blog posts from Contentful
 */
export async function syncAllBlogPostsAction(locale: string = 'en-US') {
  try {
    // Fetch all blog posts
    const { pageBlogPostCollection } = await client.pageBlogPostCollection({
      locale,
      limit: 100, // Adjust based on your content volume
    });

    const blogPosts = pageBlogPostCollection?.items || [];
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const blogPost of blogPosts) {
      if (!blogPost?.slug) continue;

      const result = await syncBlogPostAction(blogPost.slug, locale);

      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push(`${blogPost.slug}: ${result.error}`);
      }
    }

    // Clean up deleted posts
    const currentIds = blogPosts.map(p => p?.sys.id).filter(Boolean) as string[];
    const storedIds = await getAllContentfulIds();
    const deletedIds = storedIds.filter(id => !currentIds.includes(id));

    for (const id of deletedIds) {
      await deleteBlogEmbeddingsByContentfulId(id);
    }

    return {
      success: true,
      message: `Sync complete for ${locale}`,
      stats: {
        ...results,
        deleted: deletedIds.length,
      },
    };
  } catch (error) {
    console.error(`Error during full sync for ${locale}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
