# Contentful Webhook Setup Guide

This guide explains how to configure automatic vector database synchronization when blog posts are updated in Contentful.

## Overview

When you publish, update, or delete a blog post in Contentful, a webhook will automatically trigger the vector database to re-sync, ensuring your AI chat assistant always has the latest content.

## Prerequisites

- Contentful space with blog posts
- Next.js application deployed (production URL needed)
- Admin access to Contentful

## Step 1: Set Up Environment Variables

### Overview

**Signature verification is enforced in ALL environments** (development and production) when `CONTENTFUL_WEBHOOK_SECRET` is configured. This ensures consistent security behavior across all environments.

The implementation follows Contentful's official verification algorithm using Node.js built-in `crypto` module (HMAC-SHA256).

### For Development (Local Testing)

**Recommended Setup:**

1. Create a signing secret in Contentful (see Step 2 below)
2. Add to `.env.local`:
   ```bash
   CONTENTFUL_WEBHOOK_SECRET=your-64-char-secret-here
   ```
3. Start ngrok normally:
   ```bash
   pnpm dev
   # In another terminal:
   ngrok http 3000
   ```
4. Your app will verify signatures automatically

✅ **Benefits:**

- Same security behavior as production
- Tests the actual verification code
- Simple setup - just set one environment variable

**For Initial Testing Only (No Verification):**

If you want to test webhooks without verification initially:

```bash
# .env.local
# (don't set CONTENTFUL_WEBHOOK_SECRET)
```

⚠️ **Warning:** This will log warnings and should only be used for initial setup/testing.

### For Production

**Signature verification is REQUIRED in production!**

1. **Create a signing secret in Contentful:**

   Go to your Contentful space → Settings → Webhooks → Settings tab → "Enable request verification"

   This generates a 64-character secret. Copy it immediately - you won't be able to see it again!

2. **Add the secret to your environment:**

   ```bash
   # .env.local (development)
   CONTENTFUL_WEBHOOK_SECRET=<your-64-char-secret>

   # .env or Vercel (production)
   CONTENTFUL_WEBHOOK_SECRET=<your-64-char-secret>
   ```

   **Important:** Once set, signature verification is **always enforced** in both dev and prod. Use the same secret in both environments.

## Step 2: Configure Webhook in Contentful

Contentful's webhook verification follows the official specification:
https://www.contentful.com/developers/docs/webhooks/request-verification/

**Verification Headers:**

- `x-contentful-signature` - HMAC-SHA256 signature (hex encoded)
- `x-contentful-signed-headers` - Comma-separated list of headers included in signature
- `x-contentful-timestamp` - Request timestamp (used for TTL check, default 30 seconds)

**How it works:**

```typescript
import { createHmac } from 'crypto';

// Build canonical request: [method, path, headers, body].join('\n')
const canonicalRequest = [
  'POST',
  '/api/webhooks/contentful',
  'content-type:application/vnd.contentful.management.v1+json',
  '{"sys":{...}}', // raw body string
].join('\n');

// Compute HMAC-SHA256 signature (hex encoded)
const hmac = createHmac('sha256', WEBHOOK_SECRET);
hmac.update(canonicalRequest);
const expectedSignature = hmac.digest('hex');

// Compare with x-contentful-signature header
const isValid = signature === expectedSignature;
```

The implementation automatically:

- ✅ Builds canonical request format
- ✅ Computes HMAC-SHA256 signature
- ✅ Verifies timestamp TTL (30 seconds)
- ✅ Compares signatures securely

## Step 2: Configure Webhook in Contentful

1. **Go to Contentful Dashboard**
   - Navigate to Settings → Webhooks
   - Click "Add Webhook"

2. **Basic Configuration**
   - **Name**: `Vector DB Auto-Sync`
   - **URL**: `https://your-domain.com/api/webhooks/contentful`
     - For local testing: Use ngrok or similar tunneling service
     - For production: Use your deployed URL
   - **HTTP Method**: POST (default)
   - **Content Type**: `application/vnd.contentful.management.v1+json` (default)

3. **Topics (Trigger Events)**

   Configure which events trigger the webhook using the `[Type].[Action]` format:

   **Recommended Configuration:**

   ```
   Entry.publish
   Entry.save
   ```

   **All Available Options:**
   - `Entry.publish` - ✅ When a blog post is published (RECOMMENDED)
   - `Entry.save` - ✅ When changes are saved manually (RECOMMENDED)
   - `Entry.auto_save` - ⚠️ Auto-saves every 5 seconds (handler skips these)
   - `Entry.unpublish` - ⚠️ When unpublished (tombstone payload, logs only)
   - `Entry.delete` - ⚠️ When deleted (tombstone payload, logs only)
   - `Entry.create` - ⏭️ Not needed (publish will trigger sync)
   - `Entry.archive` - ⏭️ Not needed

   **Wildcard Support:**
   - `Entry.*` - All entry events
   - `*.*` - All events for all types (not recommended - includes assets, content types, etc.)

   **Note**: You can select specific events or use `Entry.*` and let the handler filter them.

4. **Filters (Content Type Filtering)**

   **IMPORTANT**: Add a filter to only trigger for blog posts!

   Click "Add filter" and configure:

   ```json
   {
     "equals": [{ "doc": "sys.contentType.sys.id" }, "pageBlogPost"]
   }
   ```

   **Common Filter Examples:**

   ```json
   // Only specific environments (master and staging)
   {
     "in": [
       { "doc": "sys.environment.sys.id" },
       ["master", "staging"]
     ]
   }

   // Only master environment
   {
     "equals": [
       { "doc": "sys.environment.sys.id" },
       "master"
     ]
   }

   // Combine multiple filters (AND logic)
   {
     "filters": [
       {
         "equals": [
           { "doc": "sys.contentType.sys.id" },
           "pageBlogPost"
         ]
       },
       {
         "equals": [
           { "doc": "sys.environment.sys.id" },
           "master"
         ]
       }
     ]
   }

   // Regex pattern for CI environments (e.g., ci-test, ci-staging)
   {
     "regexp": [
       { "doc": "sys.environment.sys.id" },
       { "pattern": "^ci-[a-z]{3,5}$" }
     ]
   }
   ```

   **Available Filter Properties:**
   - `sys.id` - Entry ID
   - `sys.environment.sys.id` - Environment ID
   - `sys.contentType.sys.id` - Content Type ID (entries only)
   - `sys.createdBy.sys.id` - Created by user ID
   - `sys.updatedBy.sys.id` - Updated by user ID
   - `sys.deletedBy.sys.id` - Deleted by user ID (unpublish/delete only)

   **Operators:**
   - `equals` - Exact match
   - `in` - Match any in array
   - `regexp` - Regular expression match

5. **Headers (Optional Custom Headers)**

   The following headers are sent automatically:
   - `X-Contentful-Topic` - Event type (e.g., `ContentManagement.Entry.publish`)
   - `X-Contentful-Webhook-Name` - Your webhook name
   - `X-Contentful-Idempotency-Key` - SHA256 hash for deduplication
   - `Content-Type` - `application/vnd.contentful.management.v1+json`

   You can add custom headers if needed for authentication or routing.

6. **Transformations (Optional)**

   By default, webhooks use:
   - HTTP Method: POST
   - Content-Type: `application/vnd.contentful.management.v1+json`
   - Full entity payload

   You can customize these using webhook transformations if needed (advanced).

7. **Save and Enable**
   - Click "Save" to create the webhook
   - Ensure the toggle is **ON** (enabled)
   - Webhook will now trigger for matching events

## Step 3: Test the Webhook

### Method 1: Test in Contentful

1. Go to your webhook settings
2. Click "Trigger test"
3. Select a blog post entry
4. Check your application logs for:
   ```
   Contentful webhook received: { topic: 'ContentManagement.Entry.publish', ... }
   ✅ Synced blog post via webhook: [Title] (ID: xxx) - X chunks
   ```

### Method 2: Publish/Update a Blog Post

1. Edit any blog post in Contentful
2. Click "Publish"
3. Check your application logs
4. Test the chat assistant to verify updated content

## Step 4: Monitor Webhook Activity

### In Contentful

1. Go to Settings → Webhooks
2. Click on your webhook
3. View the "Activity log" tab to see:
   - Recent webhook calls
   - HTTP status codes
   - Response times
   - Error messages (if any)

### In Your Application

Check server logs for webhook events:

```bash
# Success
✅ Webhook sync completed for blog post ID: xxx

# Errors
❌ Error syncing blog post xxx: [error details]
```

## Webhook Payload Structure

The webhook sends this payload when a blog post is updated:

```json
{
  "sys": {
    "type": "Entry",
    "id": "contentful-entry-id",
    "contentType": {
      "sys": {
        "id": "pageBlogPost"
      }
    }
  },
  "fields": {
    "title": {
      "en-US": "Blog Title",
      "de-DE": "Blog Titel"
    },
    "slug": {
      "en-US": "blog-slug"
    },
    "content": {
      "en-US": { "nodeType": "document", ... },
      "de-DE": { "nodeType": "document", ... }
    }
    // ... other fields
  }
}
```

**Note**: The webhook automatically detects all locales from the `title` field (which is localized) and syncs each locale separately to the vector database.

## Security

### Webhook Signature Verification

The endpoint implements Contentful's official signature verification algorithm:
https://www.contentful.com/developers/docs/webhooks/request-verification/

```typescript
/**
 * Canonical Request Format:
 * [METHOD]\n[PATH]\n[HEADERS]\n[BODY]
 *
 * Example:
 * POST
 * /api/webhooks/contentful
 * content-type:application/vnd.contentful.management.v1+json;x-contentful-timestamp:1729728000000
 * {"sys":{"type":"Entry","id":"abc123"},...}
 */

// 1. Extract verification headers
const signature = headers.get('x-contentful-signature'); // hex-encoded HMAC-SHA256
const timestamp = headers.get('x-contentful-timestamp'); // Unix timestamp in ms
const signedHeaders = headers.get('x-contentful-signed-headers'); // comma-separated list

// 2. Check timestamp TTL (default 30 seconds)
if (Number(timestamp) + 30000 < Date.now()) {
  return 401 // Request too old
}

// 3. Build canonical request
const method = 'POST';
const path = '/api/webhooks/contentful';
const headerString = signedHeaders
  .split(',')
  .map(name => `${name.toLowerCase()}:${headers.get(name)}`)
  .join(';');
const body = rawRequestBody; // exact HTTP body

const canonicalRequest = [method, path, headerString, body].join('\n');

// 4. Compute HMAC-SHA256 signature (hex encoded)
const expectedSignature = crypto
  .createHmac('sha256', CONTENTFUL_WEBHOOK_SECRET)
  .update(canonicalRequest)
  .digest('hex');

// 5. Compare signatures (constant-time comparison recommended)
if (signature !== expectedSignature) {
  return 401 Unauthorized
}
```

**Security Features:**

- **HMAC-SHA256**: Industry-standard message authentication
- **Timestamp TTL**: Prevents replay attacks (30-second window)
- **Signed Headers**: Verifies integrity of specific headers
- **Canonical Format**: Consistent signature computation
- **Space-wide Secret**: One secret per Contentful space

### Key Rotation

To rotate your signing secret without downtime:

1. **Generate a new secret**:

   ```bash
   openssl rand -hex 32
   ```

2. **Update your backend to verify against both secrets** (temporary):

   ```typescript
   const secrets = [oldSecret, newSecret];
   const isValid = secrets.some(secret => verify(secret, request));
   ```

3. **Update the secret in Contentful**:
   - Via Web App: Settings → Webhooks → Settings → Enable request verification

4. **Remove old secret from your backend** after confirming new secret works

### Secret Requirements

Contentful requires signing secrets to:

- Be **exactly 64 characters** long
- Match regex: `/^[0-9a-zA-Z+/=_-]+$/`
- Use high-entropy random generation

**Recommended Generation:**

```bash
# Hex format (recommended)
openssl rand -hex 32

# Base64 format (also valid)
openssl rand -base64 48 | head -c 64
```

### Idempotency

The webhook handler tracks the `X-Contentful-Idempotency-Key` header (a SHA256 hash of the event) to handle duplicate webhook deliveries gracefully. While Contentful attempts to deliver each webhook exactly once, duplicate deliveries may occur during server failures.

**Current Behavior**: Logs the idempotency key for tracking. You can extend this to implement deduplication if needed.

### Tombstone Payloads

When a blog post is unpublished or deleted, Contentful sends a **tombstone payload** with:

- `sys.type` = `DeletedEntry` or `DeletedAsset`
- Only `sys` property (no `fields`)
- Limited metadata about the deletion

**Current Behavior**: Logs the event but keeps embeddings for historical purposes. Uncomment the deletion code if you want to remove embeddings when content is deleted.

### Best Practices

1. **Use HTTPS Only**: Never expose webhook endpoints over HTTP
2. **Strong Secrets**: Use cryptographically secure random strings
3. **Rotate Secrets**: Update webhook secrets periodically
4. **Monitor Logs**: Watch for suspicious activity
5. **Rate Limiting**: Consider implementing rate limits (Vercel does this automatically)

## Troubleshooting

### Webhook Not Triggering

1. Check webhook is enabled in Contentful
2. Verify URL is correct and accessible
3. Check content type filter matches your blog posts
4. Look for errors in Contentful's Activity log

### 401 Unauthorized

1. Verify `CONTENTFUL_WEBHOOK_SECRET` matches in both places
2. Check header name is exactly `x-contentful-webhook-signature`
3. Ensure secret has no extra whitespace

### 500 Internal Server Error

1. Check application logs for detailed error
2. Verify Contentful credentials in `.env`
3. Test the sync function manually:
   ```bash
   pnpm tsx -e "import {syncBlogPostToVectorDB} from './src/lib/services/contentful-sync'; syncBlogPostToVectorDB('entry-id', 'en-US')"
   ```

### Vector DB Not Updating

1. Check OpenAI API key is valid
2. Verify Neon database connection
3. Check for rate limiting errors
4. Review sync function logs

## Local Development

For testing webhooks locally, you need to expose your localhost to the internet.

### Using ngrok

```bash
# Install ngrok (if not already installed)
npm install -g ngrok

# Start your dev server
pnpm dev

# In another terminal, start ngrok
ngrok http 3000

# Use the ngrok URL in Contentful webhook configuration
# Example: https://abc123.ngrok-free.app/api/webhooks/contentful
```

**Note:** Your app handles all signature verification automatically using Node.js built-in `crypto` module. Just make sure `CONTENTFUL_WEBHOOK_SECRET` is set in your `.env.local`.

### Using Localtunnel (Alternative)

```bash
# Install localtunnel
npm install -g localtunnel

# Start your dev server
pnpm dev

# Create tunnel
lt --port 3000 --subdomain myapp

# Use the localtunnel URL
https://myapp.loca.lt/api/webhooks/contentful
```

## Performance Considerations

- **Sync Time**: Embedding generation takes ~1-3 seconds per article per locale
- **Rate Limits**: OpenAI has rate limits on embedding API (~3,000 requests/min for tier 1)
- **Auto-save Events**: Automatically skipped to prevent rate limiting (fire every 5 seconds)
- **Concurrent Updates**: Multiple webhooks are queued and processed sequentially
- **Timeout**: Webhook has 30-second timeout (processing happens asynchronously)
- **Retries**: Contentful retries failed webhooks (429, 5xx) up to 2 times with ~30s delay
- **Idempotency**: Track `X-Contentful-Idempotency-Key` to handle duplicate deliveries

## Advanced: Batch Updates

For bulk updates, use the admin sync UI instead of webhooks to avoid rate limits:

```
https://your-domain.com/en-US/admin/sync
```

## Monitoring

### Vercel Logs (if deployed on Vercel)

```bash
vercel logs --follow
```

### Custom Monitoring

Consider adding monitoring for:

- Webhook response times
- Sync success/failure rates
- OpenAI API usage
- Database performance

## Summary

✅ Webhook endpoint: `/api/webhooks/contentful`  
✅ Auto-syncs on: publish, save, auto-save  
✅ Security: HMAC signature verification  
✅ Filters: Only blog posts  
✅ Locale-aware: Syncs correct language version

Your vector database will now stay in perfect sync with Contentful! 🎉
