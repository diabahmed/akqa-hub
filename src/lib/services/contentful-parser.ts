import { Document } from '@contentful/rich-text-types';

/**
 * Extract plain text from Contentful Rich Text JSON
 * Recursively processes the document tree
 */
export function extractPlainTextFromRichText(document: Document): string {
  if (!document || !document.content) {
    return '';
  }

  const extractFromNode = (node: any): string => {
    if (node.nodeType === 'text') {
      return node.value || '';
    }

    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractFromNode).join(' ');
    }

    return '';
  };

  return document.content.map(extractFromNode).join('\n').replace(/\s+/g, ' ').trim();
}

/**
 * Truncate text to token limit (approximate)
 * OpenAI embedding models have 8191 token limit
 */
export function truncateToTokenLimit(text: string, maxTokens: number = 6000): string {
  // Rough approximation: 1 token ≈ 4 characters
  const maxChars = maxTokens * 4;

  if (text.length <= maxChars) {
    return text;
  }

  // Truncate at word boundary
  const truncated = text.substring(0, maxChars);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}
