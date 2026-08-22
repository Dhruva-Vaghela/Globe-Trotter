process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_JU7aEI5nlOyS@ep-jolly-fog-az4250at-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

import { prisma } from './config/db.js';
import { AdminService } from './services/adminService.js';
import { Role } from '@prisma/client';

async function runModule12Tests() {
  console.log('========================================================================');
  console.log('  STARTING MODULE 12 (ADMIN & ANALYTICS) VERIFICATION TESTS  ');
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
    // 1. Setup Admin User & Standard User
    let adminUser = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: 'admin_test@globetrotter.app',
          passwordHash: 'dummyhash',
          name: 'System Administrator',
          role: Role.ADMIN,
        },
      });
    }

    let standardUser = await prisma.user.create({
      data: {
        email: `standard_${Date.now()}@globetrotter.app`,
        passwordHash: 'dummyhash',
        name: 'Test Standard User',
        role: Role.USER,
      },
    });

    assert(!!adminUser.id && adminUser.role === Role.ADMIN, 'Admin user account verified');
    assert(!!standardUser.id && standardUser.role === Role.USER, 'Standard user account created for testing');

    // 2. Test Get Dashboard Analytics
    const analytics = await AdminService.getDashboardAnalytics();
    assert(
      analytics.users.total >= 2 &&
        analytics.users.admins >= 1 &&
        analytics.trips.total >= 0 &&
        analytics.destinations.total >= 0 &&
        analytics.engagement.totalPosts >= 0,
      'getDashboardAnalytics aggregates user, trip, destination, activity, and engagement metrics'
    );

    // 3. Test Get Popular Items
    const popular = await AdminService.getPopularItems(3);
    assert(
      Array.isArray(popular.popularDestinations) && Array.isArray(popular.popularActivities),
      'getPopularItems returns popular destinations and popular activities'
    );

    // 4. Test List Users with Search and Role Filtering
    const userList = await AdminService.listUsers({ search: 'Standard' });
    assert(
      userList.users.length > 0 && userList.users.some((u) => u.id === standardUser.id),
      'listUsers correctly filters users by search query'
    );

    const adminList = await AdminService.listUsers({ role: Role.ADMIN });
    assert(
      adminList.users.length > 0 && adminList.users.every((u) => u.role === Role.ADMIN),
      'listUsers correctly filters users by ADMIN role'
    );

    // 5. Test Update User Role
    const updatedRole = await AdminService.updateUserRole(adminUser.id, standardUser.id, Role.ADMIN);
    assert(updatedRole.role === Role.ADMIN, 'updateUserRole promotes standard user to ADMIN role');

    // 6. Test Admin Self-Modification Guard
    let selfModPrevented = false;
    try {
      await AdminService.updateUserRole(adminUser.id, adminUser.id, Role.USER);
    } catch (err: any) {
      selfModPrevented = err.statusCode === 400;
    }
    assert(selfModPrevented, 'updateUserRole prevents admins from modifying their own role');

    // 7. Test Delete User Account
    const deleteResult = await AdminService.deleteUser(adminUser.id, standardUser.id);
    assert(deleteResult.success === true, 'deleteUser removes target user account');

    const checkDeleted = await prisma.user.findUnique({ where: { id: standardUser.id } });
    assert(checkDeleted === null, 'Target user record confirmed deleted from PostgreSQL');

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

runModule12Tests();
