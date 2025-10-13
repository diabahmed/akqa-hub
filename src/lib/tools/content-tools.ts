import { tool } from 'ai';
import { z } from 'zod';

import { generateEmbedding } from '@src/lib/services/embeddings';
import {
  getBlogEmbeddingsBySlug,
  groupChunksByArticle,
  semanticSearch,
} from '@src/lib/services/vector-db';

/**
 * Tool 1: Search Knowledge Base
 * Semantic search across all blog content with chunking support
 */
const searchKnowledgeBase = tool({
  description: `Search the content knowledge base for articles related to a user's query. 
    Use this tool to find relevant blog posts when users ask questions or request recommendations.
    Returns top matching articles with their most relevant excerpts.`,
  inputSchema: z.object({
    query: z.string().describe('The search query - can be a question, topic, or keywords'),
    limit: z.number().optional().default(5).describe('Number of articles to return (default: 5)'),
    locale: z.string().optional().default('en-US').describe('Content locale'),
  }),
  execute: async ({ query, limit, locale }) => {
    try {
      // Generate embedding for the search query
      const queryEmbedding = await generateEmbedding(query);

      // Perform semantic search across chunks
      // Fetch more chunks than needed to ensure we get enough unique articles
      const chunkResults = await semanticSearch(queryEmbedding, {
        limit: (limit || 5) * 3, // Get 3x chunks to ensure enough articles
        threshold: 0.5, // Minimum similarity threshold
        locale,
      });

      if (chunkResults.length === 0) {
        return {
          success: false,
          message: 'No relevant articles found in the knowledge base.',
          results: [],
        };
      }

      // Group chunks by article and rank articles
      const articleResults = groupChunksByArticle(chunkResults);

      // Take top N articles
      const topArticles = articleResults.slice(0, limit || 5);

      // Format results for the AI (exclude technical metrics like similarity scores)
      const formattedResults = topArticles.map(article => ({
        title: article.title,
        slug: article.slug,
        locale: article.locale, // Include locale for link generation
        description:
          article.shortDescription || article.matchingChunks[0]?.content.substring(0, 200) + '...',
        author: article.authorName,
        publishedDate: article.publishedDate?.toISOString(),
        relevantExcerpt: article.matchingChunks[0]?.content, // Best matching chunk
      }));

      return {
        success: true,
        message: `Found ${topArticles.length} relevant article(s)`,
        results: formattedResults,
      };
    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        message: 'Error searching the knowledge base.',
        results: [],
      };
    }
  },
});

/**
 * Tool 2: Get Article Content
 * Retrieve full content of a specific article by slug
 */
const getArticleContent = tool({
  description: `Retrieve the full content of a specific article by its slug.
    Use this tool when you need to read the complete article to answer detailed questions or create summaries.`,
  inputSchema: z.object({
    slug: z.string().describe('The article slug/URL identifier'),
    locale: z.string().optional().default('en-US').describe('Content locale'),
  }),
  execute: async ({ slug, locale }) => {
    try {
      const chunks = await getBlogEmbeddingsBySlug(slug, locale || 'en-US');

      if (chunks.length === 0) {
        return {
          success: false,
          message: `Article not found: ${slug}`,
        };
      }

      // Use first chunk for metadata (all chunks have same metadata)
      const firstChunk = chunks[0];

      // Reconstruct full content from all chunks
      const fullContent = chunks
        .sort((a, b) => a.chunkIndex - b.chunkIndex)
        .map(chunk => chunk.chunkContent)
        .join('\n\n');

      return {
        success: true,
        article: {
          title: firstChunk.title,
          slug: firstChunk.slug,
          locale: firstChunk.locale,
          description: firstChunk.shortDescription,
          content: fullContent,
          author: firstChunk.authorName,
          publishedDate: firstChunk.publishedDate?.toISOString(),
          totalChunks: firstChunk.totalChunks,
        },
      };
    } catch (error) {
      console.error('Error fetching article:', error);
      return {
        success: false,
        message: 'Error retrieving article content.',
      };
    }
  },
});

/**
 * Tool 3: Recommend Related Articles
 * Find articles similar to a given article using chunked embeddings
 */
const recommendRelatedArticles = tool({
  description: `Find articles related to a specific article by slug.
    Use this tool to recommend similar content to users based on what they're currently reading.`,
  inputSchema: z.object({
    slug: z.string().describe('The reference article slug'),
    limit: z.number().optional().default(3).describe('Number of recommendations (default: 3)'),
    locale: z.string().optional().default('en-US').describe('Content locale'),
  }),
  execute: async ({ slug, limit, locale }) => {
    try {
      // Get the reference article's chunks
      const referenceChunks = await getBlogEmbeddingsBySlug(slug, locale || 'en-US');

      if (referenceChunks.length === 0) {
        return {
          success: false,
          message: `Reference article not found: ${slug}`,
          recommendations: [],
        };
      }

      // Use the first chunk's embedding as representative (or could use average)
      const referenceEmbedding = referenceChunks[0].embedding as unknown as number[];

      // Search for similar articles (excluding the reference article)
      const chunkResults = await semanticSearch(referenceEmbedding, {
        limit: ((limit || 3) + 1) * 3, // +1 to account for excluding self, *3 for enough chunks
        threshold: 0.5,
        locale: locale || 'en-US',
        excludeSlugs: [slug],
      });

      // Group by article and rank
      const articleResults = groupChunksByArticle(chunkResults);

      // Take top N articles (excluding self if it appears)
      const recommendations = articleResults
        .filter(r => r.slug !== slug)
        .slice(0, limit || 3)
        .map(article => ({
          title: article.title,
          slug: article.slug,
          locale: article.locale,
          description:
            article.shortDescription ||
            article.matchingChunks[0]?.content.substring(0, 200) + '...',
          author: article.authorName,
          // Note: similarity score removed - keep results clean and focused on content
        }));

      // Provide clear messaging about results
      let message = '';
      if (recommendations.length === 0) {
        message = `No related articles found for "${referenceChunks[0].title}". The archive may not have closely matching content yet.`;
      } else if (recommendations.length < (limit || 3)) {
        message = `Found ${recommendations.length} related article(s) for "${referenceChunks[0].title}" (fewer than requested, but these are the most relevant matches)`;
      } else {
        message = `Found ${recommendations.length} related article(s) for "${referenceChunks[0].title}"`;
      }

      return {
        success: recommendations.length > 0,
        message,
        referenceArticle: {
          title: referenceChunks[0].title,
          slug: referenceChunks[0].slug,
          locale: referenceChunks[0].locale,
        },
        recommendations,
      };
    } catch (error) {
      console.error('Error finding recommendations:', error);
      return {
        success: false,
        message: 'Error finding related articles.',
        recommendations: [],
      };
    }
  },
});

// Export all tools as a single object
export const contentTools = {
  searchKnowledgeBase,
  getArticleContent,
  recommendRelatedArticles,
};
