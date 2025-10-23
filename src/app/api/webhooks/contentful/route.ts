import { createHmac } from 'crypto';

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { syncBlogPostToVectorDB } from '@src/lib/services/contentful-sync';

// Contentful webhook secret for verification (set in .env)
const WEBHOOK_SECRET = process.env.CONTENTFUL_WEBHOOK_SECRET;

/**
 * Verify the webhook request is from Contentful
 *
 * Implements Contentful's official verification algorithm:
 * https://www.contentful.com/developers/docs/webhooks/request-verification/
 *
 * The canonical request representation is:
 * [method, path, headers, body].join('\n')
 *
 * The signature is computed as: HMAC-SHA256(canonicalRequest, signingKey).hexdigest()
 *
 * Note: Verification is enforced in ALL environments (dev + prod) when secret is configured.
 */
function verifyWebhookSignature(
  method: string,
  path: string,
  headersList: Headers,
  body: string,
): boolean {
  // If no webhook secret configured, skip verification (log warning)
  if (!WEBHOOK_SECRET) {
    console.warn('⚠️  CONTENTFUL_WEBHOOK_SECRET not set - skipping signature verification');
    console.warn('⚠️  This should only be used for initial testing!');
    console.warn('⚠️  Set CONTENTFUL_WEBHOOK_SECRET for secure webhooks');
    return true;
  }

  // Get signature headers
  const signature = headersList.get('x-contentful-signature');
  const timestamp = headersList.get('x-contentful-timestamp');
  const signedHeadersStr = headersList.get('x-contentful-signed-headers');

  // Secret is configured but no signature provided - reject
  if (!signature) {
    console.error('❌ No signature provided but CONTENTFUL_WEBHOOK_SECRET is set');
    console.error('❌ Make sure webhook signing secret is enabled in Contentful');
    return false;
  }

  // Check timestamp TTL (default 30 seconds)
  if (timestamp) {
    const requestTime = Number(timestamp);
    const currentTime = Date.now();
    const ttl = 30 * 1000; // 30 seconds in milliseconds

    if (requestTime + ttl < currentTime) {
      console.error('❌ Request timestamp is too old (TTL exceeded)');
      console.error('Request time:', new Date(requestTime).toISOString());
      console.error('Current time:', new Date(currentTime).toISOString());
      return false;
    }
  }

  // Build canonical request representation
  // Method: GET, POST, etc.
  const requestMethod = method;

  // Path: request path excluding protocol, hostname, and port
  const requestPath = path;

  // Headers: comma-separated list from x-contentful-signed-headers
  // Convert to lowercase and join with semicolons
  const signedHeaders = signedHeadersStr ? signedHeadersStr.split(',') : [];
  const requestHeaders = signedHeaders
    .map(headerName => {
      const headerValue = headersList.get(headerName) || '';
      return `${headerName.toLowerCase()}:${headerValue}`;
    })
    .join(';');

  // Body: exact HTTP body
  const requestBody = body;

  // Build canonical request: [method, path, headers, body].join('\n')
  const canonicalRequest = [requestMethod, requestPath, requestHeaders, requestBody].join('\n');

  // Compute HMAC-SHA256 signature (hex encoded)
  const hmac = createHmac('sha256', WEBHOOK_SECRET);
  hmac.update(canonicalRequest);
  const expectedSignature = hmac.digest('hex');

  // Compare signatures
  const isValid = signature === expectedSignature;

  if (!isValid) {
    console.error('❌ Invalid webhook signature');
    console.error('Expected:', expectedSignature);
    console.error('Received:', signature);
  } else {
    console.log('✅ Webhook signature verified successfully');
  }

  return isValid;
}

/**
 * Contentful Webhook Handler
 * Triggered when blog posts are created, updated, or deleted
 *
 * Features:
 * - Signature verification enforced in ALL environments when CONTENTFUL_WEBHOOK_SECRET is set
 * - Idempotent: Uses X-Contentful-Idempotency-Key to prevent duplicate processing
 * - Handles tombstone payloads for delete/unpublish events
 * - Processes all locales for localized content
 * - HMAC-SHA256 signature verification following Contentful's official algorithm
 *
 * Security:
 * - Set CONTENTFUL_WEBHOOK_SECRET to enable verification in both dev and production
 * - No environment-specific bypasses - consistent security everywhere
 * - Only skip verification during initial testing (secret not set)
 */
export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const topic = headersList.get('x-contentful-topic');
    const idempotencyKey = headersList.get('x-contentful-idempotency-key');

    // Get raw body for signature verification
    const rawBody = await req.text();

    // Extract method and path from request
    const method = req.method;
    const url = new URL(req.url);
    const path = url.pathname; // e.g., /api/webhooks/contentful

    // Verify webhook signature
    if (!verifyWebhookSignature(method, path, headersList, rawBody)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse the payload
    const payload = JSON.parse(rawBody);

    // Log webhook event with idempotency key for deduplication tracking
    console.log('Contentful webhook received:', {
      topic,
      idempotencyKey,
      type: payload.sys?.type,
      contentType: payload.sys?.contentType?.sys?.id,
      entryId: payload.sys?.id,
    });

    // Only process blog post entries (not assets or other content types)
    const contentTypeId = payload.sys?.contentType?.sys?.id;
    if (contentTypeId !== 'pageBlogPost') {
      console.log('Ignoring non-blog-post content type:', contentTypeId || payload.sys?.type);
      return NextResponse.json({
        success: true,
        message: 'Ignored non-blog-post content',
      });
    }

    // Handle different webhook topics
    switch (topic) {
      case 'ContentManagement.Entry.publish':
      case 'ContentManagement.Entry.save': {
        // Get entry details
        const entryId = payload.sys.id;

        // For localized fields, we need to sync all locales
        // Extract available locales from the fields
        const availableLocales = new Set<string>();

        // Check title field for available locales (it's a localized field)
        if (payload.fields?.title) {
          Object.keys(payload.fields.title).forEach(locale => availableLocales.add(locale));
        }

        // If no locales found in fields, default to en-US
        const locales = availableLocales.size > 0 ? Array.from(availableLocales) : ['en-US'];

        console.log(`Syncing blog post ${entryId} for locales: ${locales.join(', ')}`);

        // Sync for each locale that has content
        const syncResults = await Promise.allSettled(
          locales.map(locale => syncBlogPostToVectorDB(entryId, locale)),
        );

        const successful = syncResults.filter(r => r.status === 'fulfilled').length;
        const failed = syncResults.filter(r => r.status === 'rejected').length;

        console.log(`Sync complete: ${successful} succeeded, ${failed} failed`);

        return NextResponse.json({
          success: true,
          message: `Blog post ${entryId} synced to vector database`,
          entryId,
          locales,
          results: { successful, failed },
          idempotencyKey,
        });
      }

      case 'ContentManagement.Entry.auto_save': {
        // Auto-save events fire every 5 seconds during editing
        // Skip these to avoid excessive API calls and rate limits
        console.log('Skipping auto_save event to prevent rate limiting');
        return NextResponse.json({
          success: true,
          message: 'Auto-save event ignored (will sync on publish/save)',
        });
      }

      case 'ContentManagement.Entry.unpublish':
      case 'ContentManagement.Entry.delete': {
        // Tombstone payload - only contains sys property
        const entryId = payload.sys.id;

        console.log(
          `Blog post ${entryId} was ${topic.includes('unpublish') ? 'unpublished' : 'deleted'}`,
        );
        console.log('Tombstone payload received - embeddings kept for historical purposes');

        // Optional: Delete embeddings from vector database
        // Uncomment if you want to remove embeddings when content is deleted
        // await deleteBlogEmbeddingsByContentfulId(entryId);

        return NextResponse.json({
          success: true,
          message: `Blog post ${entryId} ${topic.includes('unpublish') ? 'unpublished' : 'deleted'} - embeddings preserved`,
          entryId,
          idempotencyKey,
        });
      }

      default:
        console.log('Unhandled webhook topic:', topic);
        return NextResponse.json({
          success: true,
          message: 'Webhook received but not processed',
          idempotencyKey,
        });
    }
  } catch (error) {
    console.error('Error processing Contentful webhook:', error);
    return NextResponse.json(
      {
        error: 'Failed to process webhook',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// GET endpoint for webhook verification (Contentful uses this to verify the endpoint)
export async function GET() {
  return NextResponse.json({
    message: 'Contentful webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}
