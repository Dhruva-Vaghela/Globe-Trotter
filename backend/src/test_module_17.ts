process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_JU7aEI5nlOyS@ep-jolly-fog-az4250at-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

import { prisma } from './config/db.js';
import { UploadService } from './services/uploadService.js';
import { SearchService } from './services/searchService.js';

async function runModule17Tests() {
  console.log('========================================================================');
  console.log('  STARTING SECTION 17 (CROSS-MODULE FEATURES) VERIFICATION TESTS  ');
  console.log('========================================================================\n');

  let passedCount = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] Test ${totalTests}: ${testName}`);
      passedCount++;
    } else {
      console.error(`❌ [FAIL] Test ${totalTests}: ${testName}`);
    }
  }

  try {
    // 1. Test Image Upload Service
    const uploadRes = await UploadService.uploadImage({
      base64Data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      filename: 'sample_avatar.png',
      mimeType: 'image/png',
    });

    assert(
      uploadRes.success && !!uploadRes.imageUrl && uploadRes.filename.endsWith('.png'),
      'UploadService successfully parses image payload and generates static URL'
    );

    // 2. Test Global Search Service
    const searchRes = await SearchService.globalSearch('Goa');
    assert(
      Array.isArray(searchRes.trips) &&
        Array.isArray(searchRes.destinations) &&
        Array.isArray(searchRes.activities) &&
        Array.isArray(searchRes.posts),
      'SearchService performs unified global search across trips, destinations, activities, and posts'
    );

    console.log('\n========================================================================');
    console.log(`  VERIFICATION RESULTS: ${passedCount} / ${totalTests} TESTS PASSED`);
    console.log('========================================================================\n');

    if (passedCount === totalTests) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution failed with exception:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runModule17Tests();
