import { PrismaClient, Role, TripStatus, ExpenseCategory } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Neon PostgreSQL database...');

  // 1. Password Hash
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 2. Upsert Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@globetrotter.app' },
    update: { passwordHash },
    create: {
      name: 'System Admin',
      email: 'admin@globetrotter.app',
      passwordHash,
      role: Role.ADMIN,
      bio: 'GlobeTrotter Lead Explorer & Administrator',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      preference: {
        create: {
          defaultCurrency: 'USD',
          preferredLanguage: 'en',
          travelStyle: 'Luxury & Adventure',
        },
      },
    },
  });

  // 3. Upsert Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@globetrotter.app' },
    update: { passwordHash },
    create: {
      name: 'Demo Traveler',
      email: 'demo@globetrotter.app',
      passwordHash,
      role: Role.USER,
      bio: 'Passionate globetrotter exploring beaches, mountain trails, and street food across the world.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      preference: {
        create: {
          defaultCurrency: 'INR',
          preferredLanguage: 'en',
          travelStyle: 'Backpacker & Explorer',
        },
      },
    },
  });

  // 4. Seed Activity Categories
  const categories = [
    { name: 'Beaches & Islands', iconName: 'Palmtree', description: 'Tropical beaches, scuba diving, and boat cruises' },
    { name: 'Cultural & Heritage', iconName: 'Landmark', description: 'Ancient forts, UNESCO monuments, and palaces' },
    { name: 'Hill Stations & Treks', iconName: 'Mountain', description: 'Scenic mountain peaks, tea plantations, and hiking trails' },
    { name: 'Food & Dining', iconName: 'Utensils', description: 'Street food walks, culinary workshops, and dining' },
    { name: 'Adventures & Safaris', iconName: 'Zap', description: 'Rafting, hot air ballooning, desert safari, and wildlife' },
    { name: 'Spiritual Trails', iconName: 'Flame', description: 'Ghat rituals, holy shrines, and temple tours' },
  ];

  for (const cat of categories) {
    await prisma.activityCategory.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat,
    });
  }

  const beachCat = await prisma.activityCategory.findUnique({ where: { name: 'Beaches & Islands' } });
  const heritageCat = await prisma.activityCategory.findUnique({ where: { name: 'Cultural & Heritage' } });
  const hillsCat = await prisma.activityCategory.findUnique({ where: { name: 'Hill Stations & Treks' } });
  const foodCat = await prisma.activityCategory.findUnique({ where: { name: 'Food & Dining' } });
  const advCat = await prisma.activityCategory.findUnique({ where: { name: 'Adventures & Safaris' } });

  // 5. Seed Activities
  const activities = [
    {
      name: 'Scuba Diving & Coral Reef Tour',
      locationName: 'Goa, India',
      estimatedCost: 3500,
      durationMinutes: 240,
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=500&q=80',
      description: 'Underwater scuba dive with certified PADI instructors at Malvan island coral reef.',
      categoryId: beachCat?.id,
    },
    {
      name: 'Eiffel Tower Priority Access Sunset Tour',
      locationName: 'Paris, France',
      estimatedCost: 5800,
      durationMinutes: 150,
      rating: 4.85,
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80',
      description: 'Skip-the-line elevator ticket to 2nd floor summit with champagne toast.',
      categoryId: heritageCat?.id,
    },
    {
      name: 'Gion District Ramen & Izakaya Food Walk',
      locationName: 'Kyoto, Japan',
      estimatedCost: 4500,
      durationMinutes: 180,
      rating: 4.92,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80',
      description: 'Guided evening street food tour tasting Tonkotsu ramen and yakitori.',
      categoryId: foodCat?.id,
    },
    {
      name: 'Thar Desert Sunset Camel Safari & Folk Dance',
      locationName: 'Jaisalmer, India',
      estimatedCost: 1800,
      durationMinutes: 300,
      rating: 4.88,
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=500&q=80',
      description: 'Sunset camel trek across Sam Sand Dunes followed by Rajasthani buffet and Kalbelia dance.',
      categoryId: advCat?.id,
    },
    {
      name: 'White Water Ganges River Rafting (16 km)',
      locationName: 'Rishikesh, India',
      estimatedCost: 1200,
      durationMinutes: 180,
      rating: 4.86,
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=500&q=80',
      description: 'Thrill rafting from Shivpuri to Laxman Jhula with cliff jumping session.',
      categoryId: advCat?.id,
    },
    {
      name: 'Munnar Tea Factory & Plantation Walk',
      locationName: 'Munnar, India',
      estimatedCost: 600,
      durationMinutes: 120,
      rating: 4.82,
      imageUrl: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=500&q=80',
      description: 'Guided walk through rolling tea estates and orthodox tea processing demonstration.',
      categoryId: hillsCat?.id,
    },
  ];

  for (const act of activities) {
    const existing = await prisma.activity.findFirst({ where: { name: act.name } });
    if (!existing) {
      await prisma.activity.create({ data: act });
    }
  }

  // 6. Seed Demo Trips for Demo User
  // Upcoming Trip: Goa Beach & Heritage Break
  const upcomingTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      name: 'Goa Beach & Heritage Weekend',
      description: 'Relaxing 4-day escape in North Goa featuring watersports and fort walks.',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in future
      endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      status: TripStatus.UPCOMING,
      coverImageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      stops: {
        create: [
          {
            destinationName: 'Calangute & Anjuna',
            city: 'Goa',
            country: 'India',
            arrivalDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            departureDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
            orderIndex: 0,
          },
        ],
      },
      budget: {
        create: {
          totalBudget: 25000,
        },
      },
      expenses: {
        create: [
          { category: ExpenseCategory.ACCOMMODATION, amount: 9000, description: 'Beachfront Resort Stay (3 Nights)' },
          { category: ExpenseCategory.ACTIVITIES, amount: 3500, description: 'Scuba Diving Package' },
          { category: ExpenseCategory.TRANSPORT, amount: 4500, description: 'Return Flight Tickets' },
        ],
      },
    },
  });

  // Completed Trip: Jaipur Royal Fort Tour
  await prisma.trip.create({
    data: {
      userId: demoUser.id,
      name: 'Jaipur Royal Heritage Expedition',
      description: 'Explored Amber Fort, City Palace, and enjoyed local Rajasthani delicacies.',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
      status: TripStatus.COMPLETED,
      coverImageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
      stops: {
        create: [
          {
            destinationName: 'Pink City Jaipur',
            city: 'Jaipur',
            country: 'India',
            arrivalDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            departureDate: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
            orderIndex: 0,
          },
        ],
      },
      budget: {
        create: {
          totalBudget: 18000,
        },
      },
      expenses: {
        create: [
          { category: ExpenseCategory.ACCOMMODATION, amount: 7500, description: 'Heritage Haveli Hotel' },
          { category: ExpenseCategory.MEALS, amount: 3200, description: 'Thali Dining & Street Food' },
          { category: ExpenseCategory.TRANSPORT, amount: 3800, description: 'Cab transfers' },
        ],
      },
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
