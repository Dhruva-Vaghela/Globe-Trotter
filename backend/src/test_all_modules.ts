import { execSync } from 'child_process';

async function runAllAPITests() {
  console.log('========================================================================');
  console.log('  STARTING MASTER API VERIFICATION SUITE (ALL BACKEND MODULES)  ');
  console.log('========================================================================\n');

  const testFiles = [
    'src/test_modules_6_7.ts',
    'src/test_module_8.ts',
    'src/test_module_11.ts',
    'src/test_module_12.ts',
    'src/test_module_17.ts',
  ];

  let passedSuites = 0;

  for (const file of testFiles) {
    console.log(`\n▶ Running ${file}...`);
    try {
      const output = execSync(`npx tsx ${file}`, {
        encoding: 'utf-8',
        env: {
          ...process.env,
          DATABASE_URL: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_JU7aEI5nlOyS@ep-jolly-fog-az4250at-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
        },
      });
      console.log(output);
      passedSuites++;
    } catch (err: any) {
      console.error(`❌ Suite ${file} failed:`, err.stdout || err.message);
      process.exit(1);
    }
  }

  console.log('========================================================================');
  console.log(`  MASTER API VERIFICATION RESULTS: ${passedSuites} / ${testFiles.length} TEST SUITES PASSED  `);
  console.log('========================================================================\n');
}

runAllAPITests();
