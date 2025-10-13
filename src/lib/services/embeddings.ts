import { openai } from '@ai-sdk/openai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { embed, embedMany } from 'ai';

const EMBEDDING_MODEL = 'text-embedding-3-small';
const CHUNK_SIZE = 150; // Characters per chunk
const CHUNK_OVERLAP = 20; // Overlap between chunks for context continuity

const embeddingModel = openai.embedding(EMBEDDING_MODEL);

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: CHUNK_SIZE,
  chunkOverlap: CHUNK_OVERLAP,
  separators: ['\n\n', '\n', '. ', ' ', ''],
});

export interface EmbeddingChunk {
  content: string;
  embedding: number[];
  metadata: {
    chunkIndex: number;
    totalChunks: number;
  };
}

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: embeddingModel,
      value: text,
    });

    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Smart chunking using LangChain's RecursiveCharacterTextSplitter
 */
export async function generateChunks(text: string): Promise<string[]> {
  if (!text || text.trim().length === 0) {
    return [];
  }

  return await textSplitter.splitText(text.trim());
}

/**
 * Generate embeddings for chunks with metadata
 */
export async function generateChunkEmbeddings(chunks: string[]): Promise<EmbeddingChunk[]> {
  try {
    if (chunks.length === 0) {
      return [];
    }

    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: chunks,
    });

    return embeddings.map((embedding, index) => ({
      content: chunks[index],
      embedding,
      metadata: {
        chunkIndex: index,
        totalChunks: chunks.length,
      },
    }));
  } catch (error) {
    console.error('Error generating chunk embeddings:', error);
    throw new Error('Failed to generate chunk embeddings');
  }
}

/**
 * Prepare blog post content for embedding with metadata
 * Creates contextual chunks that include article metadata
 */
export function prepareBlogTextForEmbedding(blog: {
  title: string;
  shortDescription?: string;
  content: string;
  authorName?: string;
}): string {
  const parts = [
    `Title: ${blog.title}`,
    blog.shortDescription ? `Description: ${blog.shortDescription}` : '',
    blog.authorName ? `Author: ${blog.authorName}` : '',
    `Content: ${blog.content}`,
  ].filter(Boolean);

  return parts.join('\n\n');
}

/**
 * Generate embeddings for a blog post with chunking
 * Each chunk includes article context (title, author) for better retrieval
 */
export async function generateBlogEmbeddings(blog: {
  title: string;
  shortDescription?: string;
  content: string;
  authorName?: string;
}): Promise<EmbeddingChunk[]> {
  // Create context header that will be prepended to each chunk
  const contextHeader = [
    `Article: ${blog.title}`,
    blog.authorName ? `By ${blog.authorName}` : '',
    blog.shortDescription ? `Summary: ${blog.shortDescription}` : '',
    '',
  ]
    .filter(Boolean)
    .join('\n');

  // Generate chunks from main content
  const contentChunks = await generateChunks(blog.content);

  if (contentChunks.length === 0) {
    return [];
  }

  // Prepend context to each chunk for better semantic search
  const chunksWithContext = contentChunks.map(chunk => {
    return `${contextHeader}\n${chunk}`;
  });

  // Generate embeddings using shared function
  const embeddingChunks = await generateChunkEmbeddings(chunksWithContext);

  // Return with original content (without context header)
  return embeddingChunks.map((chunk, index) => ({
    ...chunk,
    content: contentChunks[index], // Store original content without context header
  }));
}
