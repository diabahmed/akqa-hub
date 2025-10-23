# Contentful Webhook Quick Start

This is a quick reference for setting up Contentful webhooks with signature verification using Node.js built-in `crypto` module (HMAC-SHA256).

## 🚀 Quick Setup

### 1. Create Signing Secret

**In Contentful UI:**

1. Go to https://app.contentful.com/spaces/qopidpv867t4/settings/webhooks
2. Click "Settings" tab → "Enable request verification"
3. Copy the 64-character secret (save it - you can't see it again!)

### 2. Configure Environment

Add the secret to your environment:

```bash
# .env.local (development)
CONTENTFUL_WEBHOOK_SECRET=<your-64-char-secret>

# .env or Vercel (production)
CONTENTFUL_WEBHOOK_SECRET=<your-64-char-secret>
```

**Important:** Once set, signature verification is **always enforced** in both dev and prod using HMAC-SHA256.

**For Initial Testing Only:**
You can skip setting the secret initially to test webhook delivery, but you'll see warning logs. Add the secret as soon as possible for security.

### 3. Local Testing with ngrok

```bash
# Start your dev server
pnpm dev

# In another terminal, start ngrok
ngrok http 3000

# Use the ngrok URL in Contentful webhook configuration
# Example: https://abc123.ngrok-free.app/api/webhooks/contentful
```

**Note:** Your app automatically verifies signatures using Node.js built-in `crypto` module. No additional configuration needed!

### 4. Create Webhook in Contentful

1. Go to Settings → Webhooks → "Add Webhook"
2. Configure:
   - **Name:** `Vector DB Auto-Sync`
   - **URL:** `https://your-domain.com/api/webhooks/contentful` (or ngrok URL)
   - **Topics:** `Entry.publish`, `Entry.save`
   - **Filters:** Add filter for content type:
     ```json
     {
       "equals": [{ "doc": "sys.contentType.sys.id" }, "pageBlogPost"]
     }
     ```
3. Save and enable

## 🔒 Security

**Signature Verification:**

- Uses `@contentful/node-apps-toolkit` - Contentful's official package
- Always enforced when `CONTENTFUL_WEBHOOK_SECRET` is set
- Same behavior in development and production
- No environment-specific bypasses

**Setup:**

1. Create signing secret in Contentful
2. Add to `.env.local` and production environment
3. That's it! Verification happens automatically

## 📚 Full Documentation

See [CONTENTFUL_WEBHOOK_SETUP.md](./CONTENTFUL_WEBHOOK_SETUP.md) for:

- Detailed configuration options
- Troubleshooting guide
- Advanced features (filters, transformations, etc.)
- Security best practices
- Monitoring and debugging

## 🧪 Testing

After setup, test by:

1. Publishing a blog post in Contentful
2. Check your app logs for: `✅ Webhook signature verified successfully`
3. Verify vector DB updated: Chat with AI assistant about the new post

## 🛠️ Troubleshooting

**401 Unauthorized:**

- Check secret matches in both Contentful and your app
- Verify header name: `x-contentful-signature` (not `x-contentful-webhook-signature`)

**No webhook triggered:**

- Check webhook is enabled in Contentful
- Verify content type filter matches `pageBlogPost`
- Check ngrok URL is correct

**Signature verification fails:**

- Ensure secret is exactly 64 characters
- Check for extra whitespace
- Try regenerating the secret

## 📖 References

- [Official Contentful Webhook Verification Docs](https://www.contentful.com/developers/docs/webhooks/request-verification/)
- [ngrok Contentful Integration](https://ngrok.com/docs/integrations/contentful/webhooks/)
- [Full Setup Guide](./CONTENTFUL_WEBHOOK_SETUP.md)
