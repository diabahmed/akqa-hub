import { syncAllBlogPosts } from '@src/lib/services/contentful-sync';

async function syncContent() {
  try {
    console.log('🚀 Starting content sync...');

    const locales = ['en-US', 'de-DE']; // Add your locales

    for (const locale of locales) {
      console.log(`\n📍 Syncing ${locale}...`);
      await syncAllBlogPosts(locale);
    }

    console.log('\n✅ All content synced successfully');
  } catch (error) {
    console.error('❌ Sync failed:', error);
    throw error;
  }
}

syncContent()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
