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

  // 7. Seed Destinations (30+ Indian and Global Cities)
  const destinations = [
    {
      name: 'Goa',
      country: 'India',
      region: 'South Asia',
      description: 'Sun-kissed golden beaches, Portuguese heritage architecture, vibrant nightlife, and mouthwatering seafood.',
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      estimatedDailyCost: 45,
      tags: ['Beach', 'Nightlife', 'Water Sports', 'Heritage'],
    },
    {
      name: 'Jaipur',
      country: 'India',
      region: 'South Asia',
      description: 'The Pink City of Rajasthan, renowned for majestic hill forts, royal palaces, bustling bazaars, and rich craft traditions.',
      imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      estimatedDailyCost: 40,
      tags: ['Heritage', 'Forts', 'Culture', 'Shopping'],
    },
    {
      name: 'Manali',
      country: 'India',
      region: 'South Asia',
      description: 'A high-altitude Himalayan resort town famous for snow-capped peaks, adventure sports, apple orchards, and pine forests.',
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      estimatedDailyCost: 35,
      tags: ['Mountains', 'Adventure', 'Snow', 'Trekking'],
    },
    {
      name: 'Kerala',
      country: 'India',
      region: 'South Asia',
      description: 'God\'s Own Country offering serene backwaters, houseboat cruises, Ayurvedic wellness retreats, and lush tea plantations.',
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      estimatedDailyCost: 50,
      tags: ['Backwaters', 'Nature', 'Wellness', 'Relaxation'],
    },
    {
      name: 'Varanasi',
      country: 'India',
      region: 'South Asia',
      description: 'One of the world\'s oldest living cities, celebrated for spiritual Ganges river ghats, evening Ganga Aarti rituals, and ancient alleys.',
      imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      estimatedDailyCost: 30,
      tags: ['Spiritual', 'Heritage', 'Culture', 'Ghats'],
    },
    {
      name: 'Rishikesh',
      country: 'India',
      region: 'South Asia',
      description: 'The Yoga Capital of the World along the holy Ganges, famous for white-water river rafting, cliff jumping, and spiritual ashrams.',
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      estimatedDailyCost: 32,
      tags: ['Adventure', 'Yoga', 'Rafting', 'Spiritual'],
    },
    {
      name: 'Udaipur',
      country: 'India',
      region: 'South Asia',
      description: 'The Venice of the East, famed for romantic Lake Pichola, island palaces, ornate temples, and royal heritage stay experiences.',
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      rating: 4.85,
      estimatedDailyCost: 55,
      tags: ['Romance', 'Lakes', 'Palaces', 'Heritage'],
    },
    {
      name: 'Leh-Ladakh',
      country: 'India',
      region: 'South Asia',
      description: 'Stunning high-desert mountain wilderness featuring Pangong Tso lake, Buddhist monasteries, and world\'s highest motorable passes.',
      imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      estimatedDailyCost: 60,
      tags: ['Mountains', 'Adventure', 'Motorbiking', 'Monasteries'],
    },
    {
      name: 'Agra',
      country: 'India',
      region: 'South Asia',
      description: 'Home to the iconic Taj Mahal, Agra Fort, and rich Mughal architectural masterpieces along the Yamuna river.',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      rating: 4.75,
      estimatedDailyCost: 40,
      tags: ['Taj Mahal', 'Mughal', 'Heritage', 'History'],
    },
    {
      name: 'Mumbai',
      country: 'India',
      region: 'South Asia',
      description: 'India\'s bustling financial capital and Bollywood hub, blending colonial sea-facing promenades, street food, and modern energy.',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      rating: 4.65,
      estimatedDailyCost: 65,
      tags: ['Metropolis', 'Bollywood', 'Food', 'Nightlife'],
    },
    {
      name: 'Bengaluru',
      country: 'India',
      region: 'South Asia',
      description: 'India\'s Silicon Valley garden city, celebrated for microbreweries, leafy parks, pleasant year-round weather, and tech innovation.',
      imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      estimatedDailyCost: 50,
      tags: ['Gardens', 'Pubs', 'Tech', 'Food'],
    },
    {
      name: 'Darjeeling',
      country: 'India',
      region: 'South Asia',
      description: 'The Queen of the Hills, renowned for panoramic Kanchenjunga snow views, world-famous tea estates, and Toy Train heritage rides.',
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      estimatedDailyCost: 38,
      tags: ['Tea Estates', 'Mountains', 'Heritage Train', 'Views'],
    },
    {
      name: 'Andaman Islands',
      country: 'India',
      region: 'South Asia',
      description: 'Pristine turquoise waters, coral reefs, Radhanagar white sand beaches, scuba diving, and tropical rainforest island trails.',
      imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      estimatedDailyCost: 75,
      tags: ['Islands', 'Scuba', 'Beaches', 'Water Sports'],
    },
    {
      name: 'Ooty',
      country: 'India',
      region: 'South Asia',
      description: 'Picturesque Nilgiri hill station surrounded by eucalyptus forests, tea gardens, botanical parks, and misty valleys.',
      imageUrl: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      estimatedDailyCost: 35,
      tags: ['Hills', 'Tea Gardens', 'Nature', 'Boating'],
    },
    {
      name: 'Shimla',
      country: 'India',
      region: 'South Asia',
      description: 'Former summer capital of British India set amidst pine forests, featuring Mall Road promenade and Himalayan valley vistas.',
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      rating: 4.55,
      estimatedDailyCost: 38,
      tags: ['Colonial', 'Snow', 'Mountains', 'Shopping'],
    },
    {
      name: 'Amritsar',
      country: 'India',
      region: 'South Asia',
      description: 'Spiritual heart of Sikhism housing the glistening Golden Temple, legendary Kulcha gastronomy, and Wagah Border ceremony.',
      imageUrl: 'https://images.unsplash.com/photo-1609949279531-cf48d64bed89?auto=format&fit=crop&w=800&q=80',
      rating: 4.85,
      estimatedDailyCost: 32,
      tags: ['Golden Temple', 'Spiritual', 'Food', 'Culture'],
    },
    {
      name: 'Coorg',
      country: 'India',
      region: 'South Asia',
      description: 'The Scotland of India, cradled in Western Ghats coffee plantations, cascading waterfalls, and spice aroma estates.',
      imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      rating: 4.75,
      estimatedDailyCost: 42,
      tags: ['Coffee Estates', 'Waterfalls', 'Nature', 'Trekking'],
    },
    {
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      description: 'The City of Light, world-renowned for the Eiffel Tower, Louvre museum art, Seine river cruises, and haute cuisine.',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      estimatedDailyCost: 180,
      tags: ['Romance', 'Art', 'Museums', 'Food'],
    },
    {
      name: 'Tokyo',
      country: 'Japan',
      region: 'East Asia',
      description: 'An ultra-modern metropolis blending neon skyscrapers, ancient Shinto shrines, Michelin dining, and pop culture districts.',
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      rating: 4.92,
      estimatedDailyCost: 160,
      tags: ['Modern', 'Tech', 'Anime', 'Food'],
    },
    {
      name: 'Kyoto',
      country: 'Japan',
      region: 'East Asia',
      description: 'Japan\'s cultural heartland famed for classical Buddhist temples, bamboo groves, traditional wooden machiya houses, and cherry blossoms.',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      rating: 4.95,
      estimatedDailyCost: 140,
      tags: ['Culture', 'Temples', 'Nature', 'Heritage'],
    },
    {
      name: 'Rome',
      country: 'Italy',
      region: 'Europe',
      description: 'The Eternal City packed with ancient Roman ruins like the Colosseum, Vatican City masterpieces, and authentic gelato & pasta.',
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
      rating: 4.88,
      estimatedDailyCost: 150,
      tags: ['History', 'Colosseum', 'Food', 'Architecture'],
    },
    {
      name: 'Bali',
      country: 'Indonesia',
      region: 'Southeast Asia',
      description: 'Tropical paradise featuring sacred sea temples, lush Ubud rice terraces, vibrant beach clubs, and serene volcanic landscapes.',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      rating: 4.87,
      estimatedDailyCost: 70,
      tags: ['Beaches', 'Temples', 'Surfing', 'Relaxation'],
    },
    {
      name: 'London',
      country: 'United Kingdom',
      region: 'Europe',
      description: 'Global cultural epicenter boasting Big Ben, Tower Bridge, West End theater shows, royal parks, and world-class free museums.',
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
      rating: 4.86,
      estimatedDailyCost: 190,
      tags: ['Museums', 'Theater', 'History', 'Shopping'],
    },
    {
      name: 'New York',
      country: 'United States',
      region: 'North America',
      description: 'The city that never sleeps, featuring Manhattan skyline, Broadway shows, Central Park green space, and iconic neighborhoods.',
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
      rating: 4.89,
      estimatedDailyCost: 220,
      tags: ['Skyline', 'Theater', 'Shopping', 'Metropolis'],
    },
    {
      name: 'Dubai',
      country: 'United Arab Emirates',
      region: 'Middle East',
      description: 'Future city of luxury featuring Burj Khalifa, massive shopping malls, indoor skiing, palm islands, and dune bashing safaris.',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      rating: 4.84,
      estimatedDailyCost: 210,
      tags: ['Luxury', 'Skyscrapers', 'Shopping', 'Desert'],
    },
    {
      name: 'Singapore',
      country: 'Singapore',
      region: 'Southeast Asia',
      description: 'Futuristic garden city renowned for Gardens by the Bay, Marina Bay Sands skyline, hawker street food centers, and clean green spaces.',
      imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      estimatedDailyCost: 165,
      tags: ['Modern', 'Hawker Food', 'Gardens', 'Skyline'],
    },
    {
      name: 'Bangkok',
      country: 'Thailand',
      region: 'Southeast Asia',
      description: 'Vibrant Thai capital famous for ornate Grand Palace temples, bustling floating markets, street food stalls, and energetic nightlife.',
      imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
      rating: 4.82,
      estimatedDailyCost: 55,
      tags: ['Temples', 'Street Food', 'Markets', 'Nightlife'],
    },
    {
      name: 'Barcelona',
      country: 'Spain',
      region: 'Europe',
      description: 'Mediterranean city celebrated for Antoni Gaudí\'s Sagrada Família, Gothic Quarter alleys, golden beaches, and tapas bars.',
      imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80',
      rating: 4.88,
      estimatedDailyCost: 145,
      tags: ['Architecture', 'Beaches', 'Tapas', 'Culture'],
    },
    {
      name: 'Amsterdam',
      country: 'Netherlands',
      region: 'Europe',
      description: 'Charming canal city famed for Van Gogh museum, bicycle-friendly streets, historic gabled townhouses, and flower markets.',
      imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80',
      rating: 4.85,
      estimatedDailyCost: 155,
      tags: ['Canals', 'Biking', 'Museums', 'Culture'],
    },
    {
      name: 'Zurich',
      country: 'Switzerland',
      region: 'Europe',
      description: 'Swiss alpine city along Lake Zurich offering crystal clear water views, luxury shopping, historic Old Town, and proximity to snow peaks.',
      imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      rating: 4.91,
      estimatedDailyCost: 240,
      tags: ['Alps', 'Lakes', 'Luxury', 'Nature'],
    },
    {
      name: 'Sydney',
      country: 'Australia',
      region: 'Oceania',
      description: 'Harbor city famous for the Sydney Opera House, Harbor Bridge climbs, Bondi beach surfing, and sunlit coastal walks.',
      imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
      rating: 4.89,
      estimatedDailyCost: 175,
      tags: ['Harbor', 'Opera House', 'Beaches', 'Surfing'],
    },
    {
      name: 'Cairo',
      country: 'Egypt',
      region: 'Africa',
      description: 'Land of the Pharaohs housing the Great Pyramids of Giza, the Sphinx, Khan el-Khalili bazaar, and ancient Nile river heritage.',
      imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80',
      rating: 4.78,
      estimatedDailyCost: 50,
      tags: ['Pyramids', 'History', 'Nile', 'Culture'],
    },
    {
      name: 'Istanbul',
      country: 'Turkey',
      region: 'Europe',
      description: 'Crossroads of East and West straddling the Bosphorus strait, featuring Hagia Sophia, Grand Bazaar, and Turkish tea culture.',
      imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
      rating: 4.86,
      estimatedDailyCost: 65,
      tags: ['History', 'Bosphorus', 'Markets', 'Architecture'],
    },
  ];

  for (const dest of destinations) {
    const existing = await prisma.destination.findFirst({ where: { name: dest.name } });
    if (!existing) {
      await prisma.destination.create({ data: dest });
    } else {
      await prisma.destination.update({
        where: { id: existing.id },
        data: dest,
      });
    }
  }

  console.log(`Seeded ${destinations.length} destinations successfully!`);
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
